import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogPostCard from "../components/blog-post.component";
import BlogContent from "../components/blog-content.component";


export const blogStruct={
    title:'',
    des:'',
    content:[],
    author:{personal_info:{}},
    banner:'',
    publishedAt:''
}


export const BlogContext=createContext({});

const BlogPage=()=>{
let [isLikeByUser,setLikeByUser]=useState(false);

    const [blog,setBlog]=useState(blogStruct);
    const [loading,setLoading]=useState(true);
    let{title,content,banner,author:{personal_info:{fullname,username,profile_img}},publishedAt}=blog;
    let {blog_id}=useParams()
    const [similar,setsimilar]=useState(null);

    const fetchBlog=()=>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog",{blog_id})
        .then(({ data:{blog} }) => {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN +"/search-blogs",{tag:blog.tags[0],limit:6,eleminate:blog_id})
            .then(({ data }) => {
                setsimilar(data.blogs);
            })
            setBlog(blog);
            setLoading(false);
        }).catch(err => {
            console.log(err);
        })
    }
    useEffect(()=>{
        resetState();
        fetchBlog();
    },[blog_id])
    const resetState=()=>{
        setBlog(blogStruct);
        setsimilar(null);
        setLoading(true);
    }

   
    return(
        <AnimationWrapper>
            {
                (loading) ? (<Loader/>) :
                <BlogContext.Provider value={{blog,setBlog,isLikeByUser,setLikeByUser}}>
                <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
                    <img src={banner} alt="banner" className="aspect-video"/>
                    <div className="mt-12">
                        <h2>{title}</h2>
                        <div className="flex max-sm:flex-col justify-between my-8 ">
                            <div className="flex gap-5 items-start">
                                <img src={profile_img} alt="img" className="w-12 h-12 rounded-full"/>
                                <p className="capitalize">{fullname}<br/><Link className="underline">{username}</Link>
                                </p>

                            </div>
                            <p className="text-dark-grey opacity-75max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">published on {getDay(publishedAt)}</p>
                        </div>
                    </div>
                    <BlogInteraction/>
                    <div className="my-12 font-gelasio blog-page-content">
                        {
                            content[0].blocks.map((block,i)=>{
                                return <div key={i} className="my-4 md:my-8">
                                    <BlogContent block={block}/>

                                    </div>
                            })
                        }
                    </div>
                    <BlogInteraction/>
                    {
                        similar!= null && similar.length ? 
                        <>
                        <h1 className="text-2xl mt-14 mb-10 font-medium">Similar Blogs</h1>
                        {
                            similar.map((blog,i)=>{
                                let {author:{personal_info}}=blog;
                                return<AnimationWrapper key={i} transition={{duration:1,delay:i*0.08}}>
                                    <BlogPostCard content={blog} author={personal_info}/>
                                </AnimationWrapper>
                            })

                        }
                        
                        </>:""
                    }

                </div> </BlogContext.Provider>
            }
        </AnimationWrapper>
    )
}
export default BlogPage;