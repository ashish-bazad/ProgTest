import React, { useEffect, useState, useContext } from 'react';
import style from './navbar.module.css';
import { Link } from 'react-router-dom';
import AuthContext from '../AuthContext';

const Navbar = () => {
  let {isAuthenticated, isSuperuser, api_path} = useContext(AuthContext);
  const signout = `${api_path}accounts/logout/`
  const signin = `${api_path}accounts/google/login/?process=login`
  return (
    <>
      <div className={style.navbar}>
        <div className={style.navbarContainer}>
          {/* <div className={style.navbarContainerLeft}></div> */}
          <div className={style.navbarContainerMid}>
            {isAuthenticated && isSuperuser && <Link to="/teacher">Teacher</Link> }
            <Link to="/">Dashboard</Link>
            <Link to="/upcoming">Quizzes</Link>
          </div>
          <div className={style.navbarContainerRight}>
          {isAuthenticated ?
          (<a href = {signout}>Signout</a>) :
          (<a href={signin}>Signin</a>)
          }
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Navbar;