import React from 'react'
import style from './Mcq.module.css'

const Mcq = ({options}) => {
  return (
    <>
        <div className={style.mcq}>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Adipisci facilis deserunt nam cum sunt, reiciendis at ab, rem rerum nulla harum fugiat quo facere ipsam officia voluptatem aliquam numquam explicabo!</p>
            {options.map((option, index) => (
        <div key={index}>
          <label>
            <input type="radio" name="mcq_option" value={option} />
            {option}
          </label>
        </div>
      ))}
        </div>
    </>
  )
}

export default Mcq
