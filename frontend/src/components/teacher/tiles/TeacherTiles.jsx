import React from 'react'
import style from './TeacherTiles.module.css'
import { Link } from 'react-router-dom'
const TeacherTiles = ({params}) => {
  return (
    <>
      <div className={style.teacherTile}>
            <div className={style.teacherTileContainer}>
              <Link to = {`/edit_quiz/${params.id}`}>{params.title}</Link>
              {/* <p>{params.coding ? <>Coding</>:<></>}</p> */}
              <p>Date & Time : {params.date}, {params.start_time}</p>
              <p>Duration : {params.duration}</p>
            </div>
        </div>
    </>
  )
}

export default TeacherTiles
