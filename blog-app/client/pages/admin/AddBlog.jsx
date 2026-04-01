import React, { useState, useRef, useContext, useEffect } from "react";
import { toast } from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import "quill/dist/quill.snow.css";

const AddBlog = () => {
  const { axios, fetchBlogs, navigate } = useContext(AppContext);
  const [isAdding, setIsAdding] = useState(false);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Lifestyle");
  const [isPublished, setIsPublished] = useState(true);
  const [description, setDescription] = useState("");

  const fileInputRef = useRef(null);

  // Initialize Quill editor after mount
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      import("quill").then((QuillModule) => {
        const Quill = QuillModule.default;
        quillRef.current = new Quill(editorRef.current, {
          theme: "snow",
          placeholder: "Write blog content here...",
        });
        quillRef.current.on("text-change", () => {
          setDescription(quillRef.current.root.innerHTML);
        });
      });
    }
  }, []);

  const generateDraft = async (e) => {
    e.preventDefault();
    if (!title) {
      toast.error("Please enter a blog title to generate content.");
      return;
    }
    try {
      setIsGeneratingDraft(true);
      toast("Drafting content...");
      const response = await axios.post("/api/blog/generate-ai-content", {
        prompt: title,
      });
      if (response.data.success) {
        toast.success("Draft created!");
        if (quillRef.current) {
          quillRef.current.root.innerHTML = response.data.content;
          setDescription(response.data.content);
        }
      } else {
        toast.error(response.data.message || "Failed to generate draft");
      }
    } catch (error) {
      console.error("Draft Error:", error);
      toast.error("An error occurred drafting content");
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please select a thumbnail image.");
      return;
    }
    try {
      setIsAdding(true);
      const blogData = {
        title,
        subtitle: subTitle,
        description: quillRef.current
          ? quillRef.current.root.innerHTML
          : description,
        category,
        isPublished,
      };

      const formData = new FormData();
      formData.append("blog", JSON.stringify(blogData));
      formData.append("image", image);

      const { data } = await axios.post("/api/blog/add", formData);
      if (data.success) {
        toast.success(data.message);
        await fetchBlogs(); // refresh the global blog list
        if (quillRef.current) quillRef.current.root.innerHTML = "";
        setTitle("");
        setSubTitle("");
        setDescription("");
        setImage(null);
        setCategory("Lifestyle");
        setIsPublished(true);
        navigate("/"); // go to home page so user sees their new post
      } else {
        toast.error(data.message || "Error adding blog");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding blog");
    } finally {
      setIsAdding(false);
    }
  };

  const uploadIconUrl =
    "https://www.lifewire.com/thmb/TRGYpWa4KzxUt1Fkgr3FqjOd6VQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/cloud-upload-a30f385a928e44e199a62210d578375a.jpg";

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col gap-4 p-5 sm:p-10"
    >
      <div>Upload thumbnail</div>
      <div
        onClick={() => fileInputRef.current.click()}
        className="cursor-pointer w-fit"
      >
        <img
          className="max-h-[10vh] max-w-[10vh] object-cover"
          src={image ? URL.createObjectURL(image) : uploadIconUrl}
          alt="upload"
        />
      </div>
      {/* Hidden file input */}
      <input
        onChange={onImageChange}
        type="file"
        id="image"
        hidden
        ref={fileInputRef}
      />

      <div>Blog title</div>
      <input
        name="title"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className="search max-w-[60vh] border p-2"
        placeholder="Type here"
        required
      />

      <div>Blog Subtitle</div>
      <input
        name="subTitle"
        onChange={(e) => setSubTitle(e.target.value)}
        value={subTitle}
        className="search max-w-[60vh] border p-2"
        placeholder="Optional subtitle"
      />

      <div className="flex justify-between items-center max-w-[60vh]">
        <div>Blog Description</div>
        <button
          onClick={generateDraft}
          disabled={isGeneratingDraft}
          className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 disabled:opacity-50 transition-colors"
          type="button"
        >
          {isGeneratingDraft ? "Drafting..." : "Auto-Draft Content"}
        </button>
      </div>
      {/* Quill editor container */}
      <div ref={editorRef} className="max-w-[60vh] min-h-[200px] border" />

      <div>Blog Category</div>
      <select
        name="category"
        onChange={(e) => setCategory(e.target.value)}
        value={category}
        className="border p-2 max-w-[60vh]"
      >
        <option value="Lifestyle">Lifestyle</option>
        <option value="Technology">Technology</option>
        <option value="Startup">Startup</option>
        <option value="Finance">Finance</option>
        <option value="Creative">Creative</option>
      </select>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublished"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
        />
        <label htmlFor="isPublished">
          Published (uncheck to save as draft)
        </label>
      </div>

      <button
        disabled={isAdding}
        type="submit"
        className="bg-black text-white w-32 py-3 mt-4"
      >
        {isAdding ? "Adding..." : "ADD Blog"}
      </button>
    </form>
  );
};
export default AddBlog;
