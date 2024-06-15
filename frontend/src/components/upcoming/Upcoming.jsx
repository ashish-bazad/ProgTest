import React, {useContext, useState, useEffect, useRef} from 'react'
import Fake from '../fake/Fake'
import style from './upcoming.module.css'
import Tiles from './Tiles'
import Navbar from '../../utility/navbar/Navbar'
import AuthContext from '../../utility/AuthContext'

const Upcoming = () => {
  let { allQuiz, getAllQuiz, parseDateTime } = useContext(AuthContext)
  const shouldGetAllQuiz = useRef(true)
  useEffect(() => {
    if(shouldGetAllQuiz.current)
    {
      shouldGetAllQuiz.current = false
      getAllQuiz();
    }
  },[])


  // Function to compare two dates for sorting
  const compareDates = (a, b) => {
    return a.getTime() - b.getTime();
  };

  // Filter upcoming and past quizzes and sort them
  const now = new Date();
  let [upcomingQuizzes, setUpcomingQuizzes] = useState([])
  let [pastQuizzes, setPastQuizzes] = useState([])
  let [runningQuizzes, setRunningQuizzes] = useState([])
  useEffect(() => {
    if (allQuiz !== null) {
      const now = new Date();
      const runningQuizzes = allQuiz.filter(quiz => {
        const startTime = parseDateTime(quiz.date, quiz.start_time);
        const endTime = new Date(startTime.getTime() + quiz.duration * 60000); // Convert duration to milliseconds
        return startTime <= now && now <= endTime;
      }).sort((a, b) => compareDates(parseDateTime(a.date, a.start_time), parseDateTime(b.date, b.start_time)));
  
      const upcomingQuizzes = allQuiz.filter(quiz => {
        const startTime = parseDateTime(quiz.date, quiz.start_time);
        return startTime > now;
      }).sort((a, b) => compareDates(parseDateTime(a.date, a.start_time), parseDateTime(b.date, b.start_time)));
  
      const pastQuizzes = allQuiz.filter(quiz => {
        const startTime = parseDateTime(quiz.date, quiz.start_time);
        const endTime = new Date(startTime.getTime() + quiz.duration * 60000);
        return endTime < now;
      }).sort((a, b) => compareDates(parseDateTime(b.date, b.start_time), parseDateTime(a.date, a.start_time)));
  
      setRunningQuizzes(runningQuizzes);
      setUpcomingQuizzes(upcomingQuizzes);
      setPastQuizzes(pastQuizzes);
    }
  }, [allQuiz]);

  return (
    <>
    <Navbar />
    <Fake />
    <div className={style.upcomingContainer}>
    <div className={style.quizzesHead}><p>Quizzes</p>
    </div>
    {runningQuizzes.length > 0 && (
    <div className={style.quizzesTilesRunningContainer}>
      <p className={style.quizzesTilesHeading}>Running</p>
      <div className={style.quizzesTilesRunning}>
        {runningQuizzes.map(quiz => (
          <Tiles key={quiz.id} params={quiz} />
        ))}
      </div>
    </div>)}
    <div className={style.quizzesTiles}>
      <div className={style.quizzesTilesLeft}>
        <p className={style.quizzesTilesHeading}>Upcoming</p>
        <div className={style.quizzesTilesUpcoming}>
        {upcomingQuizzes.length > 0 ? (
    upcomingQuizzes.map(quiz => (
      <Tiles key={quiz.id} params={quiz} />
    ))
  ) : (
    <p>No Upcoming Quizzes</p>
  )}
        </div>
      </div>
      <div className={style.quizzesTilesRight}>
        <p className={style.quizzesTilesHeading}>Past</p>
        <div className={style.quizzesTilesPast}>
          {pastQuizzes.length > 0 ? (pastQuizzes.map(quiz => (
                <Tiles key={quiz.id} params = {quiz} />
            ))) : (
              <p>No Past Quizzes</p>
            )}
        </div>
      </div>
    </div>
    </div>
    </>
  )
}

export default Upcoming
