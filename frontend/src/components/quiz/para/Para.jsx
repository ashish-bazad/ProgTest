import React from 'react'
import style from './para.module.css'
import ParaQuestion from './ParaQuestion'

const Para = () => {
  return (
    <>
      <div className={style.paraContainer}>
        <div className={style.para}>
          <h1>Paragraphs</h1>
          <ParaQuestion />
          <ParaQuestion />
          <ParaQuestion />
        </div>
      </div>
    </>
  )
}

export default Para
