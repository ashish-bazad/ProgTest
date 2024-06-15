import React, {useContext, useState, useEffect, useRef} from 'react'
import style from './instructions.module.css'
import { useParams } from 'react-router-dom'
import AuthContext from '../../../utility/AuthContext'
import {useNavigate} from 'react-router-dom'

const Instructions = (params) => {
    let {set_quiz_id, quiz, parseDateTime, check_attempted, getQuestions, saveResponses, questions, quiz_id, getQuiz } = useContext(AuthContext)
    let {id} = useParams()
    const shouldSetQuizId = useRef(true)
    useEffect(() => {
      if(shouldSetQuizId.current)
      {
        shouldSetQuizId.current = false
        set_quiz_id(id)
      }
    },[])
    const navigate = useNavigate()
    const startQuizFullScreen = () => {
        const now = new Date();
        const startTime = parseDateTime(quiz.date, quiz.start_time);
        const endTime = new Date(startTime.getTime() + quiz.duration * 60000);
        if(startTime > now) {
          alert("Quiz has not started yet")
          navigate("/upcoming")
        } else if(endTime < now) {
          alert("Quiz has ended")
          navigate("/upcoming")
        }
        else {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
        navigate(`/quiz/${id}`)
      }
      };
      let getDetails = async() => {
        const attempted = await check_attempted()
        if(attempted) {
            alert("You have already attempted the quiz")
            navigate("/upcoming")
        } else {
            getQuestions()
            getQuiz()
        }
    }
    const shouldGetDetails = useRef(true)
    useEffect(() => {
        if(quiz_id != null && quiz_id == id){
          if(shouldGetDetails.current)
          {
            getDetails()
            shouldGetDetails.current = false
          }
        }
    },[quiz_id])
  return (
    <>
      <div className={style.quizInstructionsContainer}>
        <h1>Instructions</h1>
        <div className={style.quizInstructions}>
            <p>⚠️Please don't get out of the full screen or change the browser window or tab. </p>
            <p>⚠️You're being monitored </p>
            <p>⚠️If you do so, strict action can be taken.</p>
            <p>⚠️You're also advised to not reload the page, else you will lose your progress.</p>
            
            <hr />
            
        </div>
        <div style={{display:'flex',justifyContent:'center',width:'100%'}}>
            <button onClick={startQuizFullScreen} style={{background: '#ADD8E6'}}>Start Quiz</button></div>
      </div>
    </>
  )
}

export default Instructions
