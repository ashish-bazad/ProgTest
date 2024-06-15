import React, {useContext, useState, useEffect, useRef} from 'react'
import { Link, useParams } from 'react-router-dom';
import Navbar from '../../../utility/navbar/Navbar';
import Fake from '../../fake/Fake';
import AuthContext from '../../../utility/AuthContext';
import Mcqs from './mcqs/Mcqs';
import Numericals from './numericals/Numericals';
import Coding from './coding/Coding';
import style from './editQuiz.module.css'
import Footer from '../../../utility/Footer';

const EditQuiz = (params) => {
    let { set_quiz_id, getQuestions, quiz_id, quiz, getQuiz, edit_quiz, } = useContext(AuthContext)
    let {id} = useParams()
    const shouldSetQuizId = useRef(true)
    useEffect(() => {
        if(shouldSetQuizId.current)
        {
            shouldSetQuizId.current = false
            set_quiz_id(id)
        }
    },[])
    const shouldGetQuestions = useRef(true)
    useEffect(() => {
        if(quiz_id != null && quiz_id === id){
            if(shouldGetQuestions.current)
            {
                getQuestions()
                getQuiz()
                shouldGetQuestions.current = false
            }
        }
    },[quiz_id])


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
            id: parseInt(quiz_id),
            title: title,
            mcqs: parseInt(mcqs),
            coding: parseInt(coding),
            numericals: parseInt(numericals),
            date: date,
            start_time: startTime,
            duration: parseInt(duration)
        };
        // Call add_quiz function with the requestData
        edit_quiz(requestData);
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
    let [edit_details, setEdit_details] = useState(false)
    const handleEditDetails = () => {
        setTitle(quiz.title)
        if(quiz.mcqs) {
            setMcqs(1)
        }
        if(quiz.coding) {
            setCoding(1)
        }
        if(quiz.numericals) {
            setNumericals(1)
        }
        setDate(quiz.date)
        var stTime = quiz.start_time.slice(0,-3)
        setStartTime(stTime)
        setDuration(quiz.duration)
        setEdit_details(true)
    }
    const stopPropagation = (e) => {
        e.stopPropagation()
    }
    const close_popup = () => {
        setEdit_details(false)
    }

  return (
    <>
    <Navbar />
    <Fake />
    <div className={style.container} >
    <h2>Quiz Details</h2>
    {quiz !== null && <div className={style.info}>
        <div className={style.teacherForm} style={{gap:'0px'}}>
        <p className={style.p}><strong>Quiz ID :</strong> {quiz.id}</p>
        <p className={style.p}><strong>Title :</strong> {quiz.title}</p>
        <p className={style.p}><strong>Date :</strong> {quiz.date}</p>
        <p className={style.p}><strong>Start Time :</strong> {quiz.start_time}</p>
        <p className={style.p}><strong>Duration :</strong> {quiz.duration} minutes</p>
        <button onClick={handleEditDetails}>Edit Details</button></div>
    </div>}
    {edit_details === true && (
        <div className={style.edit_details_popup_container} onClick={close_popup}>
            <div className={style.edit_details_popup} onClick={stopPropagation}>
                <h2>Edit Details</h2>
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
        </div>
    )}
    {quiz !== null && quiz.mcqs && <><Mcqs /></>}
    {quiz !== null && quiz.numericals && <><Numericals /></>}
    {quiz !== null && quiz.coding && <><Coding /></>}
    </div>
    <Footer />
    </>
  )
}

export default EditQuiz
