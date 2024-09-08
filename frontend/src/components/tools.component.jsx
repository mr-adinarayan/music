import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import InlineCode from "@editorjs/inline-code";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import Quote from "@editorjs/quote";

const imageUrl=(e)=>{
    let link=new Promise((resolve,reject)=>{
        try{
            resolve(e)
        }
        catch(err){
            reject(err)
        }
    })
    return link.then(url=>{
        return{
            success:1,
            file:{url}
        }
    })
}

export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class:ImageTool,
    config:{
        uploader:{
            uploadByUrl:imageUrl,
        }
    }
  },
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading ......",
      levels: [1, 2, 3, 4, 5, 6],
      defaultLevel: 2,
    },
  },
  inline: InlineCode,
  marker: Marker,
  quote: { class: Quote, inlineToolbar: true },
};
