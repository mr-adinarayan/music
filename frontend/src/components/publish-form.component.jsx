import toast, { Toaster } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";
import axios from "axios";
import { UserContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";

const PublishForm = () => {
    let taglimit=10;
    let navigate=useNavigate();
    let {blog_id}=useParams();
    let {userAuth:{access_token}}=useContext(UserContext)
    const handleKeyDown =(e)=>{
        if (e.keyCode==13 || e.keyCode==188) {
            e.preventDefault();

            let tag=e.target.value;
            if (tags.length<taglimit) {
                if (!tags.includes(tag) && tag.length) {
                    setBlog({...blog,tags:[...tags,tag]})
             }    
            }else{
                toast.error(`you can add only ${taglimit} tags`)
            }
            e.target.value="";
        }
    }
    let charaterlimit = 200;

    let {
        blog,
        blog: { banner, title, tags, des, content},
        setEditorState,
        setBlog,
    } = useContext(EditorContext);
    const handleClose = () => {
        setEditorState("editor");
    };

    const handleBlogTitlechange = (e) => {
        let input = e.target;
        setBlog({ ...blog, title: input.value });
    };
    const handledesChange = (e) => {
        let input = e.target;
        setBlog({ ...blog, des: input.value });
    };
    const handleTitle = (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    };

    
    const publishBlog=(e)=>{
        if (e.target.className.includes("disable")) {
            return;
            
        }
        if (!title.length) {
            return toast.error("Write Blog Tittle before Publishing");
        }
        if (!des.length) {
            return toast.error("Write Blog Description before Publishing under 200 chars");
        }
        if (!banner.length) {
            return toast.error("Upload Blog Banner before Publishing");
        }
        if (!tags.length) {
            return toast.error("Add Tags before Publishing to Rank your Blog");
        }
        let loadingToast=toast.loading("Publishing....");
        e.target.classList.add('disable');
        let blogObj={
            title,banner,des,tags,content,draft:false
        }
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/create-blog",{...blogObj,id:blog_id},{
            headers:{
                'Authorization':`Bearer ${access_token}`
            }
        }).then(()=>{
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast);
            toast.success("Blog is published ");

            setTimeout(()=>{
                navigate("/")
            },500);
        }).catch(({response})=>{
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast);
            return toast.error(response.data.error)
        })
    }
    return (
        <AnimationWrapper>
            <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
                <Toaster />
                <button
                    className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
                    onClick={handleClose}
                >
                    <i className="fi fi-br-cross"></i>
                </button>
                <div className="max-w-[550px] center">
                    <p className="text-dark-grey mb-1">Preview:</p>
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
                        <img src={banner} alt="banner" />
                    </div>
                    <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2 ">
                        {title}
                    </h1>
                    <p className="font-gelasio line-clamp-1 text-xl leading-7 mt-4">
                        {des}
                    </p>
                </div>
                <div className="border-grey lg:border-1 lg:pl-8">
                    <p className="text-dark-grey mb-2 mt-9">Blog title:</p>
                    <input
                        type="text"
                        placeholder="Blog title"
                        className="input-box pl-4"
                        defaultValue={title}
                        onChange={handleBlogTitlechange}
                    />

                    <p className="text-dark-grey mb-2 mt-9">
                        Short description about your Blog:
                    </p>
                    <textarea
                        maxLength={charaterlimit}
                        className="h-40 resize-none leading-7 input-box pl-4 "
                        onChange={handledesChange}
                        onKeyDown={handleTitle}
                        defaultValue={des}
                    ></textarea>
                    <p className="mt-1 text-dark-grey text-sm text-right">
                        {charaterlimit - des.length} charaters left
                    </p>
                    <p className="text-dark-grey mb-2 mt-9">Topics-(Add Tags related to Your Blog to rank your Blog)</p>
                    <div className="relative input-box pl-2 py-2 pb-4">
                        <input
                            type="text"
                            placeholder="Topics"
                            className=" sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white" onKeyDown={handleKeyDown}
                        />
                        {tags.map((tag, i) => {
                            return <Tag tag={tag} tagIndex={i} key={i} />;
                        })}
                        
                    </div>
                    <p className="mt-1 text-dark-grey text-sm text-right">{taglimit-tags.length} tags left</p>
                    <button className="btn-dark py-2" onClick={publishBlog}>Publish</button>
                </div>
            </section>
        </AnimationWrapper>
    );
};
export default PublishForm;
