import { useEffect, useRef, useState } from "react";

export let activeTab;
export let activebtn;


const InPageNavigation=({routes,defaultHidden=[],defaultActive=0,children})=>{
    let [inPageNavIndex,setInPageNavIndex]=useState(defaultActive);
     activeTab=useRef();
     activebtn=useRef();

   

    const changePage=(btn,i)=>{
        let {offsetWidth,offsetLeft}=btn;
        activeTab.current.style.width=offsetWidth +"px";
        activeTab.current.style.left=offsetLeft +"px";
        setInPageNavIndex(i);
    }

    useEffect(()=>{
        changePage(activebtn.current,defaultActive)
    },[])

    return(
    <>
    <div className="relative mb-8 bg-white border-grey flex flex-nowrap overflow-x-auto">
{
    routes.map((route,i)=>{
        return (
            <button ref={i==defaultActive? activebtn:null} key={i} className={"p-4 px-5 capitalize " + (inPageNavIndex==i?"text-black ":"text-dark-grey ") + (defaultHidden.includes(route) ? " md:hidden ":" ")} onClick={(e)=>{
                changePage(e.target,i)
            }}>{route}</button>
        )
    })
}
<hr ref={activeTab} className="absolute bottom-0 duration-500 "/>
    </div>
    {Array.isArray(children)?children[inPageNavIndex]:children}
    </>
    )
}
export default InPageNavigation;