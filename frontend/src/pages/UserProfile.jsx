import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/userContext";
import { FaEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import axios from "axios";
import Loader from "../components/Loader";

const UserProfile = () => {
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  // Function to change the avatar
  const changeAvatarHandler = async () => {
    setIsAvatarTouched(false);
    const postData = new FormData();
    postData.set("avatar", avatar);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/change-avatar`,
        postData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAvatar(response.data.avatar);
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  // Function to update user details
  const updateUserDetails = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const userData = new FormData();
    userData.set("Name", name);
    userData.set("email", email);
    userData.set("currentPassword", currentPassword);
    userData.set("newPassword", newPassword);
    userData.set("confirmNewPassword", confirmNewPassword);

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/users/edit-user`,
        userData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        navigate("/logout");
      }
    } catch (err) {
      setError(err.response.data.message);
    }
    setIsLoading(false);
  };

  // Function to fetch the user
  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/users/${currentUser.id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = await response.data;
      setName(user.name);
      setEmail(user.email);
      setAvatar(user.avatar);
    } catch (err) {
      setError(err.response.data.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="profile">
      <div className="container profile__container">
        <Link to={`/myposts/${currentUser.id}`} className="btn">
          My Posts
        </Link>
        <div className="profile__details">
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              <img
                src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`}
                alt="Avatar"
              />
            </div>
            {/* Form to update the avatar  */}
            <form className="avatar__form">
              <input
                type="file"
                name="avatar"
                id="avatar"
                accept="png jpg jpeg"
                onChange={(e) => setAvatar(e.target.files[0])}
              />
              <label htmlFor="avatar" onClick={() => setIsAvatarTouched(true)}>
                <FaEdit />
              </label>
            </form>
            {isAvatarTouched && (
              <button
                className="profile__avatar-btn"
                onClick={changeAvatarHandler}
              >
                <FaCheck />
              </button>
            )}
          </div>
          <h1>{currentUser.name}</h1>
          {/* form to update user details  */}
          <form className="form profile__form" onSubmit={updateUserDetails}>
            {error && <p className="form__error-message">{error}</p>}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <button type="submit" className="btn primary">
              Update details
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
