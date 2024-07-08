import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import axios from "axios";

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAuthors = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/users`
      );
      const Authors = response.data;
      // console.log(response.data);
      setAuthors(Authors);
    } catch (error) {
      console.log(error.response.data.message);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="authors">
      {authors.length > 0 ? (
        <div className="conatainer authors__container">
          {authors.map(({ _id, avatar, name, posts }) => {
            return (
              <Link to={`/posts/users/${_id}`} key={_id} className="author">
                <div className="author__avatar">
                  <img
                    src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`}
                    alt={`${name}`}
                  />
                </div>
                <div className="author__info">
                  <h4>{name}</h4>
                  <p>posts : {posts}</p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <h2 className="center">No authors found</h2>
      )}
    </section>
  );
};

export default Authors;
