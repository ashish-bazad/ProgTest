import React, {useContext, useState, useEffect, useRef} from 'react'
import JoditEditor from 'jodit-react'
import AuthContext from '../../../../utility/AuthContext'
import { Editor } from '@monaco-editor/react'
import { Link } from 'react-router-dom'
import style from './coding.module.css'

const Coding = () => {
    const editor = useRef(null)
    let {add_coding_question, quiz_id, quiz, questions, del_coding_question, get_coding_question, codingQuestion, editCoding_question} = useContext(AuthContext)
    let [question, setQuestion] = useState('')
    let [title, setTitle] = useState('')
    let [example_input, setExample_input] = useState('')
    let [example_output, setExample_output] = useState('')

    let handleSubmit = (e) => {
        e.preventDefault()
        const responseData = {
            quiz: parseInt(quiz_id),
            question: question,
            title: title,
            example_input: example_input,
            example_output: example_output,
        }
        add_coding_question(responseData)
        setQuestion('')
        setTitle('')
        window.location.reload()
    }
    let handleDelCod = (ques_id) => {
      const responseData = {id: ques_id}
      del_coding_question(responseData)
      window.location.reload()
  }

  let [edit_question, setEdit_question] = useState(false)
  let [editedTitle, setEditedTitle] = useState('')
  let [editedQuestion, setEditedQuestion] = useState('')
  let [editedExample_input, setEditedExample_input] = useState('')
  let [editedExample_output, setEditedExample_output] = useState('')
  let [qs_id, setQs_id] = useState(null)
  const edit_coding_question = async (ques_id) => {
    let data = await get_coding_question(ques_id)
    setEditedTitle(data.title)
    setEditedQuestion(data.question)
    setEditedExample_input(data.example_input)
    setEditedExample_output(data.example_output)
    setQs_id(ques_id)
    setEdit_question(true)
  }
  const closePopupEdit = () => {
    setEdit_question(false)
  }
  const stopPropagation = (e) => {
    e.stopPropagation()
  }
  const handleEditSubmit = (e) => {
    e.preventDefault()
    const responseData = {
      id: parseInt(qs_id),
      title: editedTitle,
      question: editedQuestion,
      example_input: editedExample_input,
      example_output: editedExample_output,
    }
    editCoding_question(responseData)
    setEditedQuestion('')
    setEditedTitle('')
    setEditedExample_input('')
    setEditedExample_output('')
    setEdit_question(false)
    window.location.reload()
  }
  return (
    <>
    {edit_question === true && (
      <div className={style.edit_question_popup_container}>
        <div className={style.edit_question_popup} onClick={stopPropagation}>
          <h2>Edit Question</h2>
          <form style={{display:'flex', flexDirection:'column', gap:'10px'}}>
            <label style={{display:'flex', gap:'20px'}}>
              <strong>Title:</strong>
              <input style={{width:'400px'}} type = "text" value = {editedTitle} onChange = {(e) => setEditedTitle(e.target.value)} required />
            </label>
            <label>
              <strong>Question:</strong>
              <JoditEditor ref = {editor} value = {editedQuestion} onChange={(e) => setEditedQuestion(e)} />
            </label>
            <div style={{display:'flex', gap:'20px'}}>
            <label>
              <strong>Example Input:</strong>
              <Editor
                height="200px"
                width="300px"
                language='plaintext'
                theme='vs-dark'
                value = {editedExample_input}
                onChange = {(value, ) => setEditedExample_input(value)}
                options={{minimap:{enabled:false}}} />
            </label>
            <label>
              <strong>Example Output:</strong>
              <Editor
                height="200px"
                width="300px"
                language='plaintext'
                theme='vs-dark'
                value = {editedExample_output}
                onChange = {(value, ) => setEditedExample_output(value)}
                options={{minimap:{enabled:false}}} />
            </label>
            </div>
          </form>
          <div style={{display:'flex', gap:'20px', marginTop:'20px'}}>
            <button onClick={handleEditSubmit}>Save</button>
            <button onClick={closePopupEdit}>Close</button></div>
        </div>
      </div>
    )}
    <div className={style.main}>
    <div className={style.textedit}>
    {quiz !== null && quiz.coding ?
    <>
      <h2>Add Coding Question</h2>
      <form className={style.codingQuestionForm} onSubmit={handleSubmit}>
        <label style={{display:'flex', gap:'20px'}}>
            <strong>Title:</strong>
            <input style={{width:'400px'}} type = "text" value = {title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
            <strong>Question:</strong>
            <JoditEditor ref = {editor} value = {question} onChange={(e) => setQuestion(e)} />
        </label>
        <div className={style.exinout}>
        <label>
          Example Input:
          <Editor 
            height="200px"
            width="300px"
            language='plaintext'
            theme='vs-dark'
            value = {example_input}
            onChange={(value,) => setExample_input(value)}
            options={{minimap:{enabled:false}}}
           />
        </label>
        <label>
          Example Output:
          <Editor 
            height="200px"
            width="300px"
            theme='vs-dark'
            language='plaintext'
            value = {example_output}
            onChange={(value,) => setExample_output(value)}
            options={{minimap:{enabled:false}}}
           />
        </label>
        </div>
        <div className={style.btn}>
        <button type='submit' style={{background: '#ADD8E6'}}>Add Coding Question</button></div>
      </form></> : <></>}
      </div>
      <div className={style.codingQuestionsDisplayDiv}>
      <h2>Coding Questions</h2>
      <div className={style.codingQuestionsDiv}>
      {questions !== null && questions.coding !== undefined && questions.coding.map(ques=> (
        <div key={ques.id} className={style.codingQuestionTextDiv}>
        <Link to = {`/edit_quiz/${quiz_id}/coding/${ques.id}`}>{ques.title}</Link>
        <div style={{display:'flex', gap:'20px'}}><button onClick={() => edit_coding_question(ques.id)}>Edit</button>
        <button onClick={() => handleDelCod(ques.id)} style={{ background: '#000', color: '#fff' }}>Delete</button></div>
        <div>
        </div>
        </div>
      ))}
      </div>
      </div>
      </div>
    </>
  )
}

export default Coding
