import React from 'react'
import style from './tiles.module.css'
import { Link } from 'react-router-dom'
const Tiles = ({params}) => {
  return (
    <>
        <div className={style.upcomingTile}>
            <div className={style.upcomingTileContainer}>
              <Link to = {`/instructions/${params.id}`}>{params.title}</Link>
              {/* <p>{params.coding ? <>Coding</>:<></>}</p> */}
              <p>Date & Time : {params.date}, {params.start_time}</p>
              <p>Duration : {params.duration}</p>
            </div>
        </div>
    </>
  )
}

export default Tiles
