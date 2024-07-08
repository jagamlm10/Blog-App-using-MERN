import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const PostAuthor = ({ createdAt, creator }) => {
  const [author, setAuthor] = useState({});
  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/users/${creator}`
      );
      // console.log(response.data);
      setAuthor(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Link to={`/posts/users/${author._id}`} className="post__author">
      <div className="post__author-avatar">
        <img
          src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${author.avatar}`}
          alt=""
        />
      </div>
      <div className="post__author-details">
        <h5>By : {author.name}</h5>
        <small><ReactTimeAgo date={new Date(createdAt)} locale="en-US"/></small>
      </div>
    </Link>
  );
};

export default PostAuthor;
