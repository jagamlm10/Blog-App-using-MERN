import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/userContext";

const Logout = () => {
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();
  setCurrentUser(null);
  navigate("/login");
  return <></>;
};

export default Logout;
