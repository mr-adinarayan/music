import { useContext } from "react";
import { BlogContext } from "../pages/blog.page";
import { Link } from "react-router-dom";
import {UserContext} from "../App";
import { Toaster,toast } from "react-hot-toast";

const BlogInteraction=()=>{
    let{userAuth:{username,access_token}}=useContext(UserContext);

    let{blog,blog:{blog_id,title,activity:{total_likes,total_comments},author:{personal_info:{username:author_username}}},setBlog,isLikeByUser,setLikeByUser}=useContext(BlogContext)
const handleLike=()=>{
    if (access_token) {
        setLikeByUser(preVal=>!preVal);
        !isLikeByUser ?
        total_likes : total_likes--;
        setBlog({...blog, activity:{...activity,total_likes}})
    }else{
        toast.error("Please Login to like this Blog")

    }

}

    return( 
<>
<Toaster/>
<hr className="border-grey my-2"/>
<div className="flex gap-6 justify-between">
    
    <div className="flex gap-3 items-center">
        <button 
        onClick={handleLike}
         className={"w-10 h-10 rounded-full flex items-center justify-center "+(isLikeByUser ? "bg-red/20 text-red" : "bg-grey/20" ) }><i className={"fi " +(isLikeByUser ? "fi-sr-heart" : "fi-rr-heart")}></i></button>
        <p className="text-xl text-drak-grey hidden">{total_likes}</p>

        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-purple duration-75 bg-grey/80"><i className="fi fi-rr-comment-dots"></i></button>
        <p className="text-xl text-drak-grey hidden">{total_comments}</p>
   
    </div>

    <div className="flex gap-6 items-center ">
        {
            username==author_username ?
            <Link to={`/editor/${blog_id}`} className="underline hover:text-purple">Edit</Link>:""
        }



        <Link to={`https://twitter.com/intent/tweet?text=Read${title}&url=${location.href}`}><i className="fi fi-brands-twitter text-xl hover:text-twitter"></i></Link>
        
    </div>

</div>
<hr className="border-grey my-2"/>
</>

        )
}
export default BlogInteraction;