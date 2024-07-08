import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/userContext";
import Loader from "../components/Loader";
import DeletePost from "./DeletePost";
import axios from "axios";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { id } = useParams();

  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/posts/users/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const Posts = await response.data;
      setPosts(Posts);
    } catch (error) {
      console.log(error);
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
    <section className="dashboard">
      {posts.length > 0 ? (
        <div className="container dashboard__container">
          {posts.map(({ _id, title, thumbnail }) => {
            return (
              <article key={_id} className="dashboard__post">
                <div className="dashboard__post-info">
                  <div className="dashboard__post-thumbnail">
                    <img
                      src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${thumbnail}`}
                      alt=""
                    />
                  </div>
                  <h5>{title}</h5>
                </div>
                <div className="dashboard__post-actions">
                  <Link to={`/posts/${_id}`} className="btn sm">
                    View
                  </Link>
                  <Link to={`/posts/${_id}/edit`} className="btn sm primary">
                    Edit
                  </Link>
                  <DeletePost postId={_id} />
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <h2 className="center">You have no posts</h2>
      )}
    </section>
  );
};

export default Dashboard;
