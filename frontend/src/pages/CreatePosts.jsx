import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/userContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const POST_CATEGORIES = [
  "Uncategorized",
  "Agriculture",
  "Business",
  "Education",
  "Art",
  "Investment",
  "Entertainment",
  "Weather",
];

const format = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockqoute",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockqoute"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

const CreatePosts = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const createPost = async (e) => {
    e.preventDefault();

    const postData = new FormData();
    postData.set("title", title);
    postData.set("category", category);
    postData.set("description", description);
    postData.set("thumbnail", thumbnail);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/posts`,
        postData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status == 201) {
        navigate("/");
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <section className="create-post">
      <div className="container">
        <h2>Create Post</h2>
        {error && <p className="form__error-message">{error}</p>}
        <form
          action=""
          className="form create-post__form"
          onSubmit={createPost}
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {POST_CATEGORIES.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <ReactQuill
            modules={modules}
            formats={format}
            value={description}
            onChange={setDescription}
          />
          <input
            type="file"
            onChange={(e) => setThumbnail(e.target.files[0])}
            accept="png, jpg, jpeg"
          />
          <button type="submit" className="btn primary">
            Create
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreatePosts;
