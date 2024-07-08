import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password1: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setUserData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  // Async function to register the user
  const registerUser = async (e) => {
    // Prevents default submission of the form. Very important.
    e.preventDefault();
    setError(""); // Initally set it to ''. Although it is not necessary
    try {
      // Make post request at the register endpoint of the server.
      // The userData is being passed as the payloa here.
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/register`,
        userData
      );
      // Axios response object contains a key data that contains the messaage from the server.
      const newUser = await response.data;
      console.log(newUser);
      if (!newUser) {
        setError("Couldn't register. Please try again");
      }

      // Navigate user to the login page.
      navigate("/login");
    } catch (error) {
      console.log(error);
      // I have console.logged the error so that you can understand why we setError in such a way.
      setError(error.response.data.message);
    }
  };

  return (
    <section className="register">
      <div className="container">
        <h2>Sign Up</h2>
        <form className="form register__form" onSubmit={registerUser}>
          {error && <p className="form__error-message">{error}</p>}
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={userData.name}
            onChange={changeInputHandler}
            autoFocus
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
          />
          <input
            type="password"
            placeholder="Password"
            name="password1"
            value={userData.password1}
            onChange={changeInputHandler}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={userData.password2}
            onChange={changeInputHandler}
          />
          <button type="submit" className="btn primary">
            Register
          </button>
        </form>
        <small>
          Already have an account? <Link to={"/login"}>sign in</Link>
        </small>
      </div>
    </section>
  );
};

export default Register;
