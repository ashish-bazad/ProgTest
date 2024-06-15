import React, { useEffect, useState, useContext } from 'react';
import style from './navbar.module.css';
import { Link } from 'react-router-dom';
import AuthContext from '../AuthContext';

const Navbar = () => {
  let {isAuthenticated, isSuperuser} = useContext(AuthContext);
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
          (<a href = "http://127.0.0.1:8000/accounts/logout/">Signout</a>) :
          (<a href="http://127.0.0.1:8000/accounts/google/login/?process=login">Signin</a>)
          }
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Navbar;