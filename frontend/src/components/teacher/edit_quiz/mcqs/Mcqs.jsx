import React, {useContext, useEffect, useState, useRef} from 'react'
import AuthContext from '../../../../utility/AuthContext'
import { useParams } from 'react-router-dom'
import JoditEditor from 'jodit-react'
import style from './mcqs.module.css'
import HTMLReactParser from 'html-react-parser'
const Mcqs = () => {
    let { quiz_id, quiz, delmcq, add_mcq_question, add_mcq_option, setQuestion_id, questions, edit_mcq_question, edit_mcq_option, get_mcq_question, get_mcq_answer } = useContext(AuthContext)

    const editor = useRef(null)
    const editor2 = useRef(null)
    const editor3 = useRef(null)
    const editor4 = useRef(null)
    const editor5 = useRef(null)
    let [mcqquestiontext, setMcqquestiontext] = useState('')
    let [marks, setMarks] = useState(0)
    let [option1, setOption1] = useState('')
    let [option2, setOption2] = useState('')
    let [option3, setOption3] = useState('')
    let [option4, setOption4] = useState('')
    let [answermcq, setanswermcq] = useState('option1')
    let handleSubmit = async (e) => {
        e.preventDefault()
        const requestData = {
            quiz: quiz_id,
            question: mcqquestiontext,
            marks: parseInt(marks),
        }
        try {
            const response = await add_mcq_question(requestData);
            setQuestion_id(response)
            const requestData2 = {
              question: response,
              option1,
              option2,
              option3,
              option4,
              answer: answermcq,
            };

            await add_mcq_option(requestData2);
      
            setMcqquestiontext('');
            setOption1('');
            setOption2('');
            setOption3('');
            setOption4('');
            setanswermcq('option1')
            setMarks(0);
            window.location.reload()
          } catch (error) {
            console.error('Error adding MCQs:', error);
          }
        }
        let handleDelMCQ = (ques_id) => {
          const responseData = {id: ques_id}
          delmcq(responseData)
          window.location.reload()
      }
      
      let [edit_question, setEdit_question] = useState(false)
      let [qsid, setqsid] = useState(null)
      let [editedQuestion, setEditedQuestion] = useState('')
      let [editedMarks, setEditedMarks] = useState(null)
      let [editedOption1, setEditedOption1] = useState('')
      let [editedOption2, setEditedOption2] = useState('')
      let [editedOption3, setEditedOption3] = useState('')
      let [editedOption4, setEditedOption4] = useState('')
      let [editedAnswer, setEditedAnswer] = useState(null)
      let [ida, setida] = useState(null)
      let [id1, setid1] = useState(null)
      let [id2, setid2] = useState(null)
      let [id3, setid3] = useState(null)
      let [id4, setid4] = useState(null)

      let handle_edit_question = async (ques_id) => {
        let data = await get_mcq_question(ques_id)
        setqsid(ques_id)
        setEditedQuestion(data.mcq.question)
        setEditedMarks(data.mcq.marks)
        setEditedOption1(data.options[0].value)
        setEditedOption2(data.options[1].value)
        setEditedOption3(data.options[2].value)
        setEditedOption4(data.options[3].value)
        setid1(data.options[0].id)
        setid2(data.options[1].id)
        setid3(data.options[2].id)
        setid4(data.options[3].id)
        let ans = await get_mcq_answer(ques_id)
        setida(ans.id)
        setEditedAnswer(ans.answer)
        setEdit_question(true)
      }
      const close_popup = () => {
        setEdit_question(false)
      }
      const stopPropagation = (e) => {
        e.stopPropagation()
      }
      const handle_edit_submit = async () => {
        const responseData = {
          id : parseInt(qsid),
          marks: parseInt(editedMarks),
          ida : parseInt(ida),
          answer: parseInt(editedAnswer),
          question: editedQuestion,
        }
        edit_mcq_question(responseData)
        const rd1 = {
          id: parseInt(id1),
          value: editedOption1,
        }
        edit_mcq_option(rd1)
        const rd2 = {
          id: parseInt(id2),
          value: editedOption2,
        }
        edit_mcq_option(rd2)
        const rd3 = {
          id: parseInt(id3),
          value: editedOption3,
        }
        edit_mcq_option(rd3)
        const rd4 = {
          id: parseInt(id4),
          value: editedOption4,
        }
        edit_mcq_option(rd4)
        setqsid(null)
        setEditedQuestion('')
        setEditedMarks(null)
        setEditedOption1('')
        setEditedOption2('')
        setEditedOption3('')
        setEditedOption4('')
        setid1(null)
        setid2(null)
        setid3(null)
        setid4(null)
        setEdit_question(false)
        window.location.reload()
      }

  return (
    <>
    {edit_question === true && (
      <div className={style.edit_question_popup_mcq_container}>
        <div className={style.edit_question_popup_mcq}>
          <h2>Edit Question</h2>
          <form style={{display:'flex', flexDirection:'column', gap:'20px'}}>
            <label>
              <h5>Question:</h5>
              <JoditEditor ref={editor}  value={editedQuestion} onChange={(newtext) => setEditedQuestion(newtext)} />
            </label>
            <label>
              <h5>Option1 ({id1}):</h5>
              <JoditEditor ref={editor2}  value={editedOption1} onChange={(newtext) => setEditedOption1(newtext)} />
            </label>
            <label>
              <h5>Option2 ({id2}):</h5>
              <JoditEditor ref={editor3}  value={editedOption2} onChange={(newtext) => setEditedOption2(newtext)} />
            </label>
            <label>
              <h5>Option3 ({id3}):</h5>
              <JoditEditor ref={editor4}  value={editedOption3} onChange={(newtext) => setEditedOption3(newtext)} />
            </label>
            <label>
              <h5>Option4 ({id4}):</h5>
              <JoditEditor ref={editor5}  value={editedOption4} onChange={(newtext) => setEditedOption4(newtext)} />
            </label>
            <label>
              <h5>Answer ID:</h5>
              <input type='number' required value = {editedAnswer} onChange={(e) => setEditedAnswer(e.target.value)} />
            </label>
            <label>
              <h5>Marks</h5>
              <input type='number' required value={editedMarks} onChange={(e) => setEditedMarks(e.target.value)} />
            </label>
          </form>
          <div style={{display:'flex',gap:'20px', alignItems:'center', justifyContent:'center', paddingLeft:'30px', paddingBottom:'30px', marginTop:'20px'}}>
          <button onClick={handle_edit_submit}>Save</button>
          <button onClick={close_popup}>Close</button></div>
        </div>
      </div>
    )}
    <div className={style.full}>
      {quiz !== null && quiz.mcqs ? 
      <div style={{width: '50vw'}}>
        <div style={{display:'flex',justifyContent: 'center'}}>
        <h2>Add MCQs</h2></div>
        <form className={style.mcqForm} onSubmit={handleSubmit}>
            <label>
                <h5>Question:</h5>
                <JoditEditor ref={editor} value={mcqquestiontext} onChange={(newtext) => setMcqquestiontext(newtext)} />
            </label>
            <label>
                <h5>Option1:</h5>
                <JoditEditor ref={editor2} value={option1} onChange={(newtext) => setOption1(newtext)} />
            </label>
            <label>
                <h5>Option2:</h5>
                <JoditEditor ref={editor3} value={option2} onChange={(newtext) => setOption2(newtext)} />
            </label>
            <label>
                <h5>Option3:</h5>
                <JoditEditor ref={editor4} value={option3} onChange={(newtext) => setOption3(newtext)} />
            </label>
            <label>
                <h5>Option4:</h5>
                <JoditEditor ref={editor5} value={option4} onChange={(newtext) => setOption4(newtext)} />
            </label>
            <div style={{display:'flex',justifyContent:'space-evenly'}}>
            <label>
              <div style={{display:'flex'}}>
                <h5>Answer:</h5>
                <input type = "text" required value = {answermcq} onChange={(e) => setanswermcq(e.target.value)} style={{marginLeft:'10px'}}/>
                </div>
            </label>
            <label>
            <div style={{display:'flex'}}>
                <h5>Marks:</h5>
                <input type="number" required value={marks} onChange={(e) => setMarks(e.target.value)} style={{marginLeft:'10px'}} /></div>
            </label>
            <div style={{    display: 'flex',
    alignItems: 'flex-end'}}>
            <button type='submit' style={{background: '#ADD8E6'}}>Add MCQ</button></div>
            </div>
        </form>
        </div>:<></>}
        <div className={style.mcqQuestionsDisplay} >
          <div style={{textAlign: 'center'}}><h2>Multiple Choice Questions</h2></div>
          {questions !== null && questions.mcqs !== undefined && questions.mcqs.map((ques, index) => (
            <div className={style.mcqQuestionTextDiv} style={{margin:'24px 0'}} key={ques.id}>
              <div style={{display:'flex'}}>
              <strong style={{width: '30px'}}>{index + 1}.</strong>
              {HTMLReactParser(ques.question)}
              </div>
              <ul>{ques.options.map(opt => <li key={opt.id}>{HTMLReactParser(opt.value)}</li>)}</ul>
              <p><strong>Marks :</strong> {ques.marks}</p>
              <div style={{display:'flex', gap:'20px'}}>
              <button onClick={() => handle_edit_question(ques.id)}>Edit</button>
              <button onClick={() => handleDelMCQ(ques.id)} style={{ background: '#000', color: '#fff' }}>Delete</button></div>
              </div>
          ))}
        </div>
        </div>
        
    </>
  )
}

export default Mcqs
