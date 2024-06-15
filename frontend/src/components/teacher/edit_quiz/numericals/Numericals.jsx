import React, {useContext, useEffect, useState, useRef} from 'react'
import AuthContext from '../../../../utility/AuthContext'
import { useParams } from 'react-router-dom'
import JoditEditor from 'jodit-react'
import style from './numericals.module.css'
import HTMLReactParser from 'html-react-parser'
const Numericals = () => {
    let { quiz_id, quiz, questions, delnum, add_numerical_question, add_numerical_answer, set_numerical_question_id, get_numerical_question, edit_numerical_question } = useContext(AuthContext)
    const editor = useRef(null)
    let [numericalQuestion, setNumericalQuestion] = useState('')
        let [marksnum, setMarksnum] = useState(0)
        let [answerNum, setAnswerNum] = useState(0)
        const handleSubmitNumerical = async(e) => {
            e.preventDefault();
            const requestData = {
                quiz: quiz_id,
                marks: marksnum,
                question: numericalQuestion,
            }
            const response = await add_numerical_question(requestData)
            set_numerical_question_id(response)
            console.log(response)
            const requestData2 = {
                question: response,
                answer: parseInt(answerNum)
            }
            await add_numerical_answer(requestData2)
            setAnswerNum(0)
            setMarksnum(0)
            setNumericalQuestion('')
            window.location.reload()
        }
        let handleDelNum = (ques_id) => {
            const responseData = {id: ques_id}
            delnum(responseData)
            window.location.reload()
        }

        let [edit_question, set_edit_question] = useState(false)
        let [editedQuestion, setEditedQuestion] = useState('')
        let [editedAnswer, setEditedAnswer] = useState(null)
        let [editedMarks, setEditedMarks] = useState(null)
        let [ida, setida] = useState(null)
        let [qsid, setqsid] = useState(null)

        let handle_edit_numerical_question = async(qid) => {
            let data = await get_numerical_question(qid)
            setEditedQuestion(data.numerical.question)
            setEditedMarks(data.numerical.marks)
            setEditedAnswer(data.answer.answer)
            setida(data.answer.id)
            setqsid(qid)
            set_edit_question(true)
        }
        let close_popup = () => {
            set_edit_question(false)
        }
        let handle_edit_submit = () => {
            const responseData = {
                id: parseInt(qsid),
                marks: parseInt(editedMarks),
                ida: parseInt(ida),
                answer: parseInt(editedAnswer),
                question: editedQuestion,
            }
            edit_numerical_question(responseData)

            setEditedQuestion('')
            setEditedMarks(null)
            setEditedAnswer(null)
            setida(null)
            setqsid(null)
            set_edit_question(false)
            window.location.reload()
        }

  return (
    <>
        {edit_question === true && (
            <div className={style.edit_numerical_question_popup_container} >
                <div className={style.edit_numerical_question_popup}>
                    <center><h2>Edit Question</h2></center>
                    <form style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                        <label>
                            <strong>Question:</strong>
                            <JoditEditor ref = {editor} value = {editedQuestion} onChange={(e) => setEditedQuestion(e)} />
                        </label>
                        <label style={{display:'flex', gap:'20px'}}>
                            <strong>Marks:</strong>
                            <input type = "number" value = {editedMarks} onChange={(e) => setEditedMarks(e.target.value)} required />
                        </label>
                        <label style={{display:'flex', gap:'20px'}} >
                            <strong>Answer:</strong>
                            <input type = "number" value = {editedAnswer} onChange={(e)=>setEditedAnswer(e.target.value)} required />
                        </label>
                    </form>
                    <div style={{display:'flex', gap:'20px', alignItems:'center', justifyContent:'center'}}>
                    <button onClick={handle_edit_submit}>Save</button>
                    <button onClick={close_popup}>Close</button></div>
                </div>
            </div>
        )}
    <div className={style.whole}>
      {quiz !== null && quiz.numericals ? 
      <div className={style.ind}>
        <div style={{textAlign: 'center'}}>
            <h2>Add Numerical Question</h2></div>
            <form className={style.numericalsForm} onSubmit={handleSubmitNumerical}>
                <label>
                    <h5>Question:</h5>
                    <JoditEditor ref={editor} value={numericalQuestion} onChange={(newval) => setNumericalQuestion(newval)} />
                </label>
                <label>
                    <h5>Marks:</h5>
                    <input type = "number" value = {marksnum} onChange={(e) =>setMarksnum(e.target.value)} />
                </label>
                <label>
                    <h5>Answer:</h5>
                    <input type = "number" value = {answerNum} onChange={(e)=>setAnswerNum(e.target.value)} required />
                </label>
                <button type='submit' style={{background: '#ADD8E6'}}>Add Numerical Question</button>
            </form>
        </div>:<></>}
        <div className={style.displayint}>
            <div style={{textAlign:'center'}}>
        <h2>Integer Type Questions</h2></div>
        <div className={style.numericalQuestionsDiv}>
            {questions !== null && questions.numericals !== undefined && questions.numericals.map((ques, index) => (
                <div key={ques.id} className={style.numericalQuestionTextDiv}>
                    <div style={{display:'flex'}}>
                    <strong style={{width:'20px'}}>{index + 1}</strong>
                    {HTMLReactParser(ques.question)}</div>
                    <p><strong>Marks :</strong> {ques.marks}</p>
                    <div style={{display:'flex', gap:'20px'}}><button onClick={() => handle_edit_numerical_question(ques.id)}>Edit</button>
                    <button onClick={() => handleDelNum(ques.id)} style={{ background: '#000', color: '#fff' }}>Delete</button></div>
                </div>
            ))}
        </div>
        </div>
        
    </div>
   </>
  )
}

export default Numericals
