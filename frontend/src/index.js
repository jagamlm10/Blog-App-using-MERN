import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import Authors from "./pages/Authors";
import CreatePosts from "./pages/CreatePosts";
import CategoryPosts from "./pages/CategoryPosts";
import AuthorPosts from "./pages/AuthorPosts";
import Dashboard from "./pages/Dashboard";
import EditPost from "./pages/EditPost";
import DeletePost from "./pages/DeletePost";
import Logout from "./pages/Logout";
import Layout from "./components/Layout";
import UserContextProvider from "./context/userContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <UserContextProvider>
        <Layout />
      </UserContextProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "posts/:id", element: <PostDetail /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "profile/:id", element: <UserProfile /> },
      { path: "create", element: <CreatePosts /> },
      { path: "authors", element: <Authors /> },
      { path: "posts/categories/:category", element: <CategoryPosts /> },
      { path: "posts/users/:id", element: <AuthorPosts /> },
      { path: "myposts/:id", element: <Dashboard /> },
      { path: "posts/:id/edit", element: <EditPost /> },
      { path: "posts/:id/delete", element: <DeletePost /> },
      { path: "logout", element: <Logout /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
