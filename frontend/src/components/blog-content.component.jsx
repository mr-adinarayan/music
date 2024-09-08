const List=({style,items})=>{
return (
    <ol className={`pl-5 ${style=="ordered" ? " list-decimal":"list-disc" }`}>
        {
            items.map((listitems,i)=>{
                return <li key={i} className="my-4" dangerouslySetInnerHTML={{__html:listitems}}></li>
            })
        }
    </ol>
)
}

const Quote=({quote,caption})=>{
    return(
<div className="bg-purple/10 p-3 pl-5 border-l-4 border-purple">
    <p className="text-xl leading-10  md:text-2xl">
        {quote}
        {caption.length ? <p className="w-full text-purple text-base">{caption}</p> : ""}
    </p>
</div>

    )
}
const Img=({url,caption})=>{
    return(
        <div><img src={url} alt="img" />
        {caption.length ?
        <p className="w-full text-center my-3 md:mb-12 text-base text-dark-grey">
            {caption}
        </p>
        :
        ""}
        </div>
    )
}

const BlogContent=({block})=>{
    let {type,data}=block;
    if (type=="paragraph") {
        return <p dangerouslySetInnerHTML={{__html:data.text}}></p>
    }if(type=="header"){
        if (data.level==6) {
            return<h6 className="text-xl font-bold" dangerouslySetInnerHTML={{__html:data.text}}></h6>
        }else if (data.level==5) {
            return<h5 className="text-2xl font-bold" dangerouslySetInnerHTML={{__html:data.text}}></h5>
        }else if (data.level==4) {
            return<h4 className="text-3xl font-bold" dangerouslySetInnerHTML={{__html:data.text}}></h4>
        }else if (data.level==3) {
            return<h3 className="text-4xl font-bold" dangerouslySetInnerHTML={{__html:data.text}}></h3>
        }else if (data.level==2) {
            return<h2 className="text-5xl font-bold" dangerouslySetInnerHTML={{__html:data.text}}></h2>
        }else {
            return<h1 className="text-6xl font-bold" dangerouslySetInnerHTML={{__html:data.text}}></h1>
        }
    }
    if(type=="image"){
        return <Img url={data.file.url} caption={data.caption}/>
    }
    if (type=="quote") {
        return <Quote quote={data.text} caption={data.caption}/>
    }
    if (type=="list") {
        return <List style={data.style} items={data.items}/>
    }
}
export default BlogContent;