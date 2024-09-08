import { Link , Outlet, useNavigate} from "react-router-dom";
import logo from "../imgs/logo.png";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import UserNavigationPanel from "./user-navigation.component";

const Navbar=()=>{
    const[searchBoxVisibility,setSearchBoxVisibility]=useState(false);
    const [UserNavPanel,setUserNavPanel]=useState(false);
    const { userAuth,userAuth:{access_token,profile_img}}= useContext(UserContext);
    let navigate=useNavigate();
    const handleUserNavPanel=()=>{
      setUserNavPanel(current=>!current);

    }
    const handleSearch=(e)=>{
      let query=e.target.value;
      if (e.keyCode==13 && query.length) {
        navigate(`/search/${query}`);
      }
    }
    const handleBlur=()=>{
      setTimeout(()=>{
      setUserNavPanel(false);
      },500);
    }
    return(
        <>        
        <nav className="navbar">
            <Link to="/" className="flex-none w-12">
                <img src={logo} className="w-14 h-14 "/>
            </Link>
            <div className={"absolute hidden bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show "+(searchBoxVisibility? "show":"hide")}>
                <input
                type="text"
                placeholder="Search" onKeyDown={handleSearch}
                className="w-full hidden md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"/>
                <i className="fi fi-rr-search hidden absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
            </div>
            
  <div className="flex items-center gap-3 md:gap-6 ml-auto">
    <button className="hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center" onClick={()=>setSearchBoxVisibility(current=>!current)}>
      <i className="fi fi-rr-search text-xl"></i>
    </button>

    <Link to="/editor" className="hidden md:flex gap-2 link">
      <i className=" hidden fi fi-rr-edit"></i>
      <p className=" hidden">write</p>
    </Link>

{
access_token ?
<>
<Link to="/dashboard/notification" className="hidden">
  <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10" >
<i className="fi fi-rr-bell text-2xl block mt-1"></i>
  </button>
</Link>
<div className="relative" onClick={handleUserNavPanel} onBlur={handleBlur}>
<button className="w-12 h-12 mt-1">
  <img src={profile_img} className="w-full h-full object-cover rounded-full"/>
</button>
{
  UserNavPanel ?
  <UserNavigationPanel/>:
  ""
}


</div>
</>
:
<>
<Link className="btn-dark py-2" to="/signin">Sign In</Link>
    <Link className="btn-light py-2 hidden md:block" to="/signup">Sign up</Link>

</>

}
   
  </div>


        </nav>
        <Outlet/>
        </>

    )
}
export default Navbar;