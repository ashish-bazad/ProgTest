import React, { useContext, useState, useEffect } from 'react'
import Fake from '../fake/Fake'
import Navbar from '../../utility/navbar/Navbar'
import AuthContext from '../../utility/AuthContext'
import style from './landingpage.module.css'

const Landingpage = () => {
  let {isAuthenticated, roll, add_roll} = useContext(AuthContext)
  let [roll_num, setRoll_num] = useState(0)
  let AddRollNum = () => {
    const responseData = {
      roll:roll_num,
    }
    add_roll(responseData);
    window.location.reload()
  }
  return (
    <>
        <Navbar />
        <Fake />
       

        <div className={style.container}>
        {isAuthenticated ? <>
        <div className={style.relative}>
          <h1 className={style.welcomeText}>Welcome</h1> 
        <div className={style.HomePage} >
          <div className={style.CourseDetails}>
            <h1>𝐂𝐒𝐎 𝟏𝟎𝟏</h1>
            <p>Computer Programming</p>
          </div>
          <div className={style.ProffDetails}>
            <h4>Dr. Vignesh Sivaraman</h4>
            <p>Assistant Professor</p>
          </div>
        </div>
        </div>
        {roll ? <></>:<>
        <div className={style.AddRollNumber}>
          <div className={style.RollNumberDiv}>
            <p>Your Roll Number is not set!!</p>
            <label>
              Enter Roll Number :
              <input type="number" value={roll_num} onChange={(e)=>setRoll_num(e.target.value)} required />
            </label>
            <button onClick={AddRollNum}>Add</button>
          </div>
        </div>
        </>}
        </>:<h1>PLEASE LOGIN</h1>}
        </div>
    </>
  )
}

export default Landingpage