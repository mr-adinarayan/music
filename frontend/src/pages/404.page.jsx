import { Link } from "react-router-dom";
import page404 from "../imgs/404.png";
import logos from "../imgs/full-logo.png";
const PageNotFound=()=>{
    return(
        <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
            <img src={page404} alt="404" className="select-none border-2 border-grey w-72 aspect-square object-cover rounded"/>
            <h1 className="text-4xl font-gelasio leading-7 ">Page Not Found</h1>
            <p className="text-dark-grey leading-7 text-xl -ml-8 ">The page your looking for not exist <Link to="/" className="text-black underline">HomePage</Link></p>
            <div className="mt-auto">
                <img src={logos} alt="logo" className="h-8 object-contain block mx-auto select-none"/>
                <p className="mt-5 text-dark-grey">read millions of stories</p>
            </div>
        </section>


    )
}
export default PageNotFound;