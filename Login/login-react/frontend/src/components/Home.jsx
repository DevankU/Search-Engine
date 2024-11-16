import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; 

const Home = () => {
  const [fadeOut, setFadeOut] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true); 
      setTimeout(() => {
        window.location.href = 'http://127.0.0.1:5000/'; 
      }, 1000); 
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`home-container ${fadeOut ? 'fade-out' : ''}`}>
      <h1>Login Success</h1>
      <p className="redirect-message">Page will redirect in a few seconds...</p>
      <Link to='/login' className="btn btn-light my-5">Logout</Link>
    </div>
  );
};

export default Home;