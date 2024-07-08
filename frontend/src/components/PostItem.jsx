import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";

const PostItem = ({
  postID,
  thumbnail,
  category,
  title,
  desc,
  creator,
  createdAt,
}) => {
  const shortDesc = desc.length > 40 ? desc.substr(0, 40) + "...." : desc;
  const postTitle = title.length > 30 ? title.substr(0, 30) + "...." : title;

  return (
    <article className="post">
      <div className="post__thumbnail">
        <img
          src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${thumbnail}`}
          alt={title}
        />
      </div>
      <div className="post__content">
        <Link to={`/posts/${postID}`}>
          <h3>{postTitle}</h3>
        </Link>
        <p dangerouslySetInnerHTML={{__html : shortDesc}}/>
        <div className="post__footer">
          <PostAuthor createdAt={createdAt} creator={creator} />
          <Link to={`/posts/categories/${category}`} className="btn category">
            {category}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostItem;
