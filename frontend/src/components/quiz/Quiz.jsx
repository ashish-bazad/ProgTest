import React, {useContext, useState, useEffect, useRef} from 'react'
import style from './quiz.module.css'
import Fake from '../fake/Fake.jsx'
import AuthContext from '../../utility/AuthContext.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import HTMLReactParser from 'html-react-parser'
import Coding from './coding/Coding.jsx'
import Footer from '../../utility/Footer.jsx'

const Quiz = () => {
    let {set_quiz_id, submit_code_quiz, parseDateTime, quiz,add_suspicious_activity, check_attempted, getQuestions, saveResponses, questions, quiz_id, getQuiz } = useContext(AuthContext)
    let {id} = useParams()
    const shouldSetQuizId = useRef(true)
    useEffect(() => {
      if(shouldSetQuizId.current)
      {
        shouldSetQuizId.current = false
        set_quiz_id(id)
      }
    },[])
    const navigate = useNavigate();
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

    const numericalInputs = useRef({});
    let responses = {quiz: id, "mcqs":{},"numericals":{},"coding":{}};
    
    let handleSubmit = () => {
      Object.keys(questions).map(que => {
        if (que === "mcqs") {
          questions[que].map(ques => {
            let selectedOptionId = document.querySelector(`input[name=mcq-${ques.id}]:checked`)?.value;
            if(selectedOptionId === undefined) {
                selectedOptionId = -1
            }
            responses["mcqs"][ques.id] = selectedOptionId;
          })
        } else if(que === "numericals") {
          questions[que].map(ques => {
            const answerInput = numericalInputs.current[ques.id];
            responses.numericals[ques.id] = answerInput?.value
          })
        }
      })
    saveResponses(responses)
    navigate("/upcoming")
    }

    let [isFullScreen, setIsFullScreen] = useState(true);
    let [isPageVisible, setIsPageVisible] = useState(true);
    let [hiddenTimestamp, setHiddenTimestamp] = useState(null);
    let [fullTimestamp, setFullTimestamp] = useState(null);
    let [lastFullScreenDuration, setLastFullScreenDuration] = useState(0)
    let [lastHiddenDuration, setLastHiddenDuration] = useState(0)
    const full = useRef(false)
    const hidden = useRef(false)
    useEffect (() => {
      if(isFullScreen && isPageVisible)
      {
        let full_duration = lastFullScreenDuration
        let hidden_duration = lastHiddenDuration

        if(!full.current) {
          full_duration = 0
        }
        if(!hidden.current) {
          hidden_duration = 0
        }
        const fullExitTime = new Date(Date.now());
        const options = { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const formattedFullExitTime = fullExitTime.toLocaleTimeString([], options);
        const responseData = {
          quiz:parseInt(quiz_id),
          time: formattedFullExitTime,
          full: full.current,
          hidden: hidden.current,
          hidden_duration: hidden_duration,
          full_duration: full_duration,
        }
        if(full.current || hidden.current){
          add_suspicious_activity(responseData)
        }
        full.current = false
        hidden.current = false
      }
    }, [ lastHiddenDuration, lastFullScreenDuration])
    useEffect (() => {
      if(isPageVisible && hiddenTimestamp !== null) {
        const duration = Date.now() - hiddenTimestamp
        setLastHiddenDuration(duration)
      }
    }, [isPageVisible, hiddenTimestamp])
    useEffect (() => {
      if(isFullScreen && fullTimestamp !== null) {
        const duration = Date.now() - fullTimestamp
        setLastFullScreenDuration(duration)
      }
    }, [isFullScreen, fullTimestamp])
    useEffect(() => {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          setHiddenTimestamp(Date.now())
          setIsPageVisible(false)
          hidden.current = true
        } else {
          setIsPageVisible(true)
        }
      };
  
      const handleFullscreenChange = () => {
        if (!document.fullscreenElement) {
          setFullTimestamp(Date.now())
          setIsFullScreen(false)
          full.current = true
        } else {
          setIsFullScreen(true)
        }
      };
  
      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('fullscreenchange', handleFullscreenChange);
  
      return () => {
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange
        );
        document.removeEventListener(
          'fullscreenchange',
          handleFullscreenChange
        );
      };
    }, []);

    const enterFullScreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    };

    // Timer
    const [remainingTime, setRemainingTime] = useState("");
    useEffect(() => {
      // Function to update remaining time
        const updateRemainingTime = () => {
          if (quiz) {

          const startTime = parseDateTime(quiz.date, quiz.start_time)
          const endTime = new Date(startTime.getTime() + quiz.duration * 60000);
          const now = new Date();
          const difference = endTime - now;
          if (difference <= 0) {
            // If remaining time is 0 or negative, submit the quiz
            handleSubmit();
            return;
          }
  
          // Calculate hours, minutes, and seconds from milliseconds
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / 1000 / 60) % 60);
          const seconds = Math.floor((difference / 1000) % 60);
  
          // Format remaining time
          const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  
          setRemainingTime(formattedTime);
        }
      };
  
      // Update remaining time initially and then every second
      updateRemainingTime();
      const intervalId = setInterval(updateRemainingTime, 1000);
  
      // Clean up interval
      return () => clearInterval(intervalId);
    }, [quiz]);

    const shouldCheckFullScreenOnReload = useRef(true)
    useEffect(()=>{
      if(shouldCheckFullScreenOnReload.current) {
        shouldCheckFullScreenOnReload.current = false
        if(!document.fullscreenElement) {
          setIsFullScreen(false)
        } else {
          setIsFullScreen(true)
        }
      }
    },[])

    let submitQuiz = () => {
      const responseData = {
        quiz:parseInt(quiz_id),
      }
      submit_code_quiz(responseData)
      navigate("/upcoming")
    }

  return (
    <>
      {isFullScreen ? <></>:<div className={style.fullScreen}><button onClick={enterFullScreen}>Go Full Screen</button></div>}
      <div className={style.quiznavbar}>
        <div className={style.quiznavbarContainer} >
          <div className={style.quiznavbarContainerLeft}>
            <p>{remainingTime}</p>
          </div>
          <div className={style.quiznavbarContainerRight}>
          {quiz!==null && quiz.coding?<><button className={style.submitButton} onClick={submitQuiz} style={{background: '#ADD8E6'}}>Submit</button></>:<button className={style.submitButton} onClick={handleSubmit} style={{background: '#ADD8E6'}}>Submit</button>}
          </div>
        </div>
      </div>
      <Fake />
      {questions !== null && quiz!== null && quiz.coding === false && <div className={style.QuizQuestions}>
      {questions !== null && quiz!== null && quiz.coding === false &&
      Object.keys(questions).map(que => 
        <div key={que} className={style.quizQuestions}>
          {que === "mcqs" ? <h2>Multiple Choice Questions</h2> : <h2>Integer Answer Type Questions</h2>}
          {questions[que].map((ques, qno) => 
            <div key={ques['id']} className={style.quizQuestionText}>
              <div style={{display:'flex'}}>
              <strong style={{width: '30px'}}>{qno+1}.</strong>
              {HTMLReactParser(ques.question)}</div>
              {que === "mcqs" && 
              (ques.options).map((opt, index) => 
                <div key={opt.id} className={style.mcqOptions}>
                  <input
                    type='radio'
                    name={`mcq-${ques.id}`}
                    value={opt.id}
                    />
                  <label htmlFor={opt.id}>{HTMLReactParser(opt.value)}</label>
                </div>
                )}
                {que === "numericals" &&
                  <div key = {ques.id} className={style.numericalInputs}>
                    <label htmlFor={ques.id}>Answer: </label>
                    <input ref={(el) => (numericalInputs.current[ques.id] = el)} type = "number" />
                  </div>
                }
            </div>)}
        </div>)}
    </div>}
    {/* IF CODING QUESTIONS */}
    <div className={style.codingQuestionsContainer}>{quiz !== null && quiz.coding ? <><Coding /></>:<></>}</div>
    <Footer />
    </>
  )
}

export default Quiz
