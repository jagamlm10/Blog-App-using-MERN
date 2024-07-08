import React, { useState, useEffect } from "react";
import PostItem from "./PostItem";
import Loader from "./Loader";
import axios from "axios";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/posts`
      );
      const posts = await response?.data;
      setPosts(posts);
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="posts">
      {posts.length > 0 ? (
        <div className="container posts__container">
          {posts.map(
            ({
              _id : id,
              thumbnail,
              category,
              title,
              description,
              creator,
              createdAt,
            }) => {
              return (
                <PostItem
                  key={id}
                  postID={id}
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

export default Posts;
