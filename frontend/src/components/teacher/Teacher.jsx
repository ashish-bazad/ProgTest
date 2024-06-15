import React, { useContext, useEffect, useState, useRef } from 'react';
import Fake from '../fake/Fake';
import Navbar from '../../utility/navbar/Navbar';
import AuthContext from '../../utility/AuthContext';
import style from './teacher.module.css';
import TeacherTiles from './tiles/TeacherTiles.jsx';
import { Link } from 'react-router-dom';

const Teacher = () => {
  const { add_quiz, allQuiz, getAllQuiz, delquiz } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [mcqs, setMcqs] = useState('0');
  const [coding, setCoding] = useState('0');
  const [numericals, setNumericals] = useState('0');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('0');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!date.match(dateRegex)) {
      alert('Please enter date in yyyy-mm-dd format. Beware of spaces');
      return;
    }
    // Validate time format
    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!startTime.match(timeRegex)) {
      alert('Please enter time in hh:mm:ss format. Beware of spaces');
      return;
    }
    // Validate MCQs input
    if (mcqs !== '0' && mcqs !== '1') {
      alert('MCQs input must be 0 or 1. Beware of spaces');
      return;
    }
    if(coding === '1' && (mcqs !=='0' || numericals !=='0')) {
      alert("If the quiz type is Coding, only coding can be selected");
      return;
    }
    // Construct requestData object
    const requestData = {
      title: title,
      mcqs: parseInt(mcqs),
      coding: parseInt(coding),
      numericals: parseInt(numericals),
      date: date,
      start_time: startTime,
      duration: parseInt(duration)
    };
    // Call add_quiz function with the requestData
    add_quiz(requestData);
    // Clear form fields after submission
    setTitle('');
    setMcqs('0');
    setCoding('0');
    setNumericals('0');
    setDate('');
    setStartTime('');
    setDuration('0');
    window.location.reload()
  };
  const shouldGetAllQuiz = useRef(true)
  useEffect(() => {
    if(shouldGetAllQuiz.current)
    {
      getAllQuiz()
      shouldGetAllQuiz.current = false
    }
  }, [])
  let handleDelQuiz = (params) => {
    let requestData = {id: params.id}
    delquiz(requestData)
    window.location.reload()
  }
  return (
    <>
      <Navbar />
      <Fake />
      <div className={style.container}>
      <div className={style.teacherFormContainer}>
        <h2>Add Quiz</h2>
        <form className={style.teacherForm} onSubmit={handleSubmit}>
          <label>
            Title:
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            MCQs:
            <input type="text" value={mcqs} onChange={(e) => setMcqs(e.target.value)} required />
          </label>
          <label>
            Coding:
            <input type="text" value={coding} onChange={(e) => setCoding(e.target.value)} required />
          </label>
          <label>
            Numericals:
            <input type="text" value={numericals} onChange={(e) => setNumericals(e.target.value)} required />
          </label>
          <label>
            Date (yyyy-mm-dd):
            <input type="text" value={date} onChange={(e) => setDate(e.target.value)} required />
          </label>
          <label>
            Start Time (hh:mm):
            <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
          </label>
          <label>
            Duration (in minutes):
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />
          </label>
          <div className={style.bsbm}>
          <button type="submit" style={{background: '#ADD8E6'}}>Submit</button>
          </div>
        </form>
      </div>
      <div className={style.teacherAllQuizTiles}>
        <h2>All Quizzes</h2>
        {allQuiz !== null &&  allQuiz.length > 0 ? (allQuiz.slice().reverse().map(quiz => (
          <div key={quiz.id} className={style.quizTiles}>
            <TeacherTiles params={quiz} />
            <div className={style.quizTilesButtons}><button id={quiz.id} onClick={() => handleDelQuiz(quiz)} style={{ background: '#000', color: '#fff' }}>Delete</button>
            <Link to = {`/result/${quiz.id}`} style={{textDecoration:'none'}}>Result</Link></div>
          </div>
        ))):(<p>No quizzes</p>)}
      </div>
      </div>
    </>
  );
};

export default Teacher;
