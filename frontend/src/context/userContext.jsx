import { createContext, useEffect, useState, useContext } from "react";

const UserContext = createContext(); // User context

// Custom hook for Context 
export const useAuth = () => {
  return useContext(UserContext);
};

// Context provider
const UserContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
