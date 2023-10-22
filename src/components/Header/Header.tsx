import React, { useEffect, useState } from "react";
import {Button} from "react-bootstrap";
import "./Header.css";
import useAuth from '../../hooks/useAuth';


const Header: React.FC = () => {
  const {logout,user} = useAuth()
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const logoutStyle = { padding:"20px" };
  const emailStyle = {paddingTop: "10px",marginRight: "20px"}


  useEffect(() => {
    const userProfileString = localStorage.getItem("email");
    if (userProfileString) {
      try {
        const userProfile = (userProfileString);
        setUserEmail(userProfile);
      } catch (error) {
        console.error("Error parsing user profile data from local storage", error);
      }
    }
  }, []);
  const handleSubmit =  () => {    
    logout()

  };
  return (
    <div className="header">
      <div className="d-flex justify-content-end" style={logoutStyle}>      
      {userEmail && <p style={emailStyle}>{userEmail}</p>}
      <Button variant="outline-light" onClick={handleSubmit}>Logout</Button>
      </div>
    </div>
  );
}
export default Header;
