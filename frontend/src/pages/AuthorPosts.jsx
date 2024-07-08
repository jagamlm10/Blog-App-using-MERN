import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PostItem from "../components/PostItem";
import Loader from "../components/Loader";
import axios from "axios";

const AuthorPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams(); // This is the id of the author/user

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/posts/users/${id}`
      );
      const Posts = await response.data;
      setPosts(Posts);
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="posts">
      {posts.length > 0 ? (
        <div className="container posts__container">
          {posts.map(
            ({
              _id,
              thumbnail,
              category,
              title,
              description,
              creator,
              createdAt,
            }) => {
              return (
                <PostItem
                  key={_id}
                  postID={_id}
                  thumbnail={thumbnail}
                  category={category}
                  title={title}
                  desc={description}
                  creator={creator}
                  createdAt={createdAt}
                />
              );
            }
          )}
        </div>
      ) : (
        <h2 className="center">No posts found</h2>
      )}
    </section>
  );
};

export default AuthorPosts;
