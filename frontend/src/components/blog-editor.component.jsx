import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "../imgs/logo.png";
import defaultBanner from "../imgs/blog banner.png";
import AnimationWrapper from "../common/page-animation";
import { useContext, useEffect, useRef, useState } from "react";
import { storage } from "./firebaseConfig.js";
import { Toaster, toast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { EditorContext } from "../pages/editor.pages.jsx";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component.jsx";
import axios from "axios";
import { UserContext } from "../App.jsx";

const BlogEditor = () => {
  let {blog_id}=useParams();
  let navigate = useNavigate();
  let {
    userAuth: { access_token },
  } = useContext(UserContext);
  let {
    blog,
    blog: { title, banner, content, tags, des },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);
  let blogBanner = useRef();
  const [Url, setUrl] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!textEditor.isReady) {
      setTextEditor(
        new EditorJS({
          holderId: "textEditor",
          data: Array.isArray(content)?content[0]:content,
          tools: tools,
          placeholder: "Lets Create a Blogg",
        })
      );
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.currentTarget.files[0]; // Use e.currentTarget.files[0] instead of e.target.files[0]
    if (file) {
      toast.success("uploading");
      setImage(() => file); // Set the selected file
    } else {
      console.error("No file selected.");
    }
  };
  useEffect(() => {
    if (image !== null) {
      upload(); // Call the upload function when the image state changes
    }
  }, [image]);

  const upload = () => {
    setBlog({ ...blog, banner: defaultBanner });

    if (!image) {
      console.error("Image name is undefined or null");
      return;
    }
    const uuid = uuidv4(); // Generate UUID for filename
    const fileName = `${uuid}-${image.name}`;
    console.log("Image name:", fileName);

    storage
      .ref("images/" + fileName)
      .put(image)
      .on(
        "state_changed",
        (snapshot) => {
          // Progress monitoring if needed
        },
        (error) => {
          console.error("Error uploading image:", error);
        },
        () => {
          storage
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then((url) => {
              setUrl(url);
              console.log("Download URL:", url);
              // If blogBanner is properly referenced, this should update the image
              if (blogBanner.current) {
                setBlog({ ...blog, banner: url });
                toast.success("Uploaded");
              }
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
            });
        }
      );
  };

  const handleTitle = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };
  const handleTitleChange = (e) => {
    let input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    setBlog({ ...blog, title: input.value });
  };
  const handleError = (e) => {
    let img = e.target;
    img.src = defaultBanner;
  };
  const handlePublish = () => {
    if (!banner.length) {
      return toast.error("upload the blog banner");
    }
    if (!title.length) {
      return toast.error("add title to publish");
    }
    if (textEditor.isReady) {
      textEditor
        .save()
        .then((data) => {
          if (data.blocks.length) {
            setBlog({ ...blog, content: data });
            setEditorState("publish");
          } else {
            return toast.error("Write something in your blog to publish it");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleDraft = (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }
    if (!title.length) {
      return toast.error("Write Blog Tittle before Saving as Draft");
    }

    let loadingToast = toast.loading("Saving Draft....");

    e.target.classList.add("disable");

    if (textEditor.isReady) {
      textEditor.save().then((content) => {
        let blogObj = {
          title,
          banner,
          des,
          tags,
          content,
          draft: true,
        };

        axios
          .post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", {...blogObj,id:blog_id}, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          })
          .then(() => {
            e.target.classList.remove("disable");
            toast.dismiss(loadingToast);
            toast.success("Blog is Saved ");

            setTimeout(() => {
              navigate("/");
            }, 500);
          })
          .catch(({ response }) => {
            e.target.classList.remove("disable");
            toast.dismiss(loadingToast);
            return toast.error(response.data.error);
          });
      });
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link className="flex-none w-10" to="/">
          <img src={logo} />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>
        <div className="flex gap-4 ml-auto ">
          <button className="btn-dark py-2" onClick={handlePublish}>
            Publish
          </button>
          <button className="btn-light py-2 hidden" onClick={handleDraft}>
            Save draft
          </button>
        </div>
      </nav>
      <AnimationWrapper>
        <section>
          <Toaster />

          <div className="mx-auto max-w-[900px] w-full ">
            <div className="relatiive aspect-video bg-white border-4 border-grey hover:opacity-80">
              <label htmlFor="uploadBanner">
                <img
                  onError={handleError}
                  ref={blogBanner}
                  src={banner}
                  className="z-20"
                  alt="please upload your banner"
                />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png,.jpeg,.jpg"
                  hidden
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <textarea
              defaultValue={title}
              placeholder="Blog Title"
              className="text-4xl font:medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
              onKeyDown={handleTitle}
              onChange={handleTitleChange}
            ></textarea>
            <hr className="w-full opacity-10 my-5" />

            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};
export default BlogEditor;
