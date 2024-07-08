import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/userContext";
import Loader from "../components/Loader";
import axios from "axios";

const DeletePost = ({ postId: id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const location = useLocation();

  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const removePost = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status == 200) {
        if (location.pathname == `/myposts/${currentUser.id}`) {
          navigate(0);
        } else {
          navigate("/");
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Link className="btn sm danger" onClick={removePost}>
      Delete
    </Link>
  );
};

export default DeletePost;
