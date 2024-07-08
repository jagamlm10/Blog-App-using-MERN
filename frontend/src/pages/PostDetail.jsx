import { useEffect, useState } from "react";
import { useAuth } from "../context/userContext";
import PostAuthor from "../components/PostAuthor";
import { Link, useNavigate, useParams } from "react-router-dom";
import DeletePost from "./DeletePost";
import Loader from "../components/Loader";
import axios from "axios";

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams(); // This one is the id of the post
  const { currentUser } = useAuth();

  const fetchPost = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/posts/${id}`
      );
      const post = response?.data;
      setPost(post);
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchPost();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="post-detail">
      {error && <p>{error}</p>}
      {post && (
        <div className="container post-detail__container">
          <div className="post-detail__header">
            <PostAuthor creator={post.creator} createdAt={post.createdAt} />
            {currentUser?.id == post?.creator && (
              <div className="post-detail__buttons">
                <Link to={`/posts/${post?._id}/edit`} className="btn sm primary">
                  Edit
                </Link>
                <DeletePost postId={id} />
              </div>
            )}
          </div>
          <h1>{post?.title}</h1>
          <div className="post-detail__thumbnail">
            <img
              src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post?.thumbnail}`}
              alt=""
            />
          </div>
          <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
        </div>
      )}
    </section>
  );
};

export default PostDetail;
