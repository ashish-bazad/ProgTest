import React from 'react'
import style from './mcqs.module.css'
import Mcq from './Mcq.jsx'

const Mcqs = () => {
    const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
   
  return (
    <>
      <div className={style.mcqsContainer}>
        <div className={style.mcqs}>
            <h1>MCQs</h1>
            <Mcq options = {options}/>
            <Mcq options = {options}/>
            <Mcq options = {options}/>
            <Mcq options = {options}/>
        </div>
      </div>
    </>
  )
}

export default Mcqs
