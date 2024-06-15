import React, { useContext, useEffect, useRef, useState } from 'react'
import Navbar from '../../../../utility/navbar/Navbar'
import Fake from '../../../fake/Fake'
import { useParams } from 'react-router-dom'
import AuthContext from '../../../../utility/AuthContext'
import HTMLReactParser from 'html-react-parser'
import { Editor } from '@monaco-editor/react'
import style from './testCases.module.css'
import Footer from '../../../../utility/Footer'

const TestCases = () => {
    let {id, question_id} = useParams()
    let {testCases, get_test_cases, codingQuestion, get_coding_question, add_test_case, delete_test_case, get_test_case, edit_test_case} = useContext(AuthContext)
    const shouldGetTestCases = useRef(true)
    useEffect(()=>{
        if(shouldGetTestCases.current) {
            shouldGetTestCases.current = false
            get_test_cases(question_id)
            get_coding_question(question_id)
        }
    },[])
    let [tinput, setTinput] = useState('')
    let [toutput, setToutput] = useState('')
    let [marks, setMarks] = useState(0)
    let addTestCase = (e) => {
        e.preventDefault()
        const responseData = {
            question : question_id,
            input: tinput,
            expected_output: toutput,
            marks: parseInt(marks),
        }
        add_test_case(responseData)
        window.location.reload()
    }
    let handle_delete_test_case = (tid) => {
        const responseData = {
            id: tid,
        }
        delete_test_case(responseData)
        window.location.reload()
    }

    let [editTestCase, setEditTestCase] = useState(false)
    let [tcID, settcID] = useState(null)
    let [editedInput, setEditedInput] = useState('')
    let [editedOutput, setEditedOutput] = useState('')
    let [editedMarks, setEditedMarks] = useState(null)
    const handle_edit_test_case = async (test_case_id) => {
        let data = await get_test_case(test_case_id)
        setEditedInput(data.input)
        setEditedOutput(data.expected_output)
        setEditedMarks(data.marks)
        settcID(test_case_id)
        setEditTestCase(true)
    }
    const closePopup = () => {
        setEditTestCase(false)
    }
    const stopPropagation = (e)=> {
        e.stopPropagation()
    }
    const submit_edit_test_case = (e) => {
        e.preventDefault()
        const responseData = {
            id: parseInt(tcID),
            input: editedInput,
            expected_output: editedOutput,
            marks: editedMarks,
        }
        edit_test_case(responseData)
        settcID(null)
        setEditedInput('')
        setEditedOutput('')
        setEditedMarks(null)
        setEditTestCase(false)
        window.location.reload()
    }
  return (
    <>
      <Navbar />
      <Fake />
      {editTestCase === true && (
        <div className={style.edit_test_case_popup_container} onClick={closePopup}>
            <div className={style.edit_test_case_popup} onClick={stopPropagation}>
                <h2>Edit Test Case</h2>
                <form style={{display:'flex', gap:'20px', flexDirection:'column'}}>
                    <div style={{display:'flex', gap:'20px'}}>
                <label>
                    <h5>Input:</h5>
                    <Editor width="300px" height="200px" theme='vs-dark' language='plaintext' value={editedInput} onChange={(value,) => setEditedInput(value)} />
                </label>
                <label>
                    <h5>Expected Output:</h5>
                    <Editor width="300px" height="200px" theme='vs-dark' language='plaintext' value={editedOutput} onChange={(value,) => setEditedOutput(value)} />
                </label>
                </div>
                <label style={{display:'flex', gap:'20px'}}>
                    <strong>Marks:</strong>
                    <input type='number' value={editedMarks} onChange={(e) => setEditedMarks(e.target.value)} />
                </label>
                </form>
                <div style={{display:'flex', gap:'20px'}}>
                <button onClick={submit_edit_test_case}>Save</button>
                <button onClick={closePopup}>Close</button></div>
            </div>
        </div>
      )}
      <div className={style.container}>
      {codingQuestion !== null && <>
      <div className={style.questionContainer}>
      <h2>{codingQuestion.title}</h2>
      {HTMLReactParser(codingQuestion.question)}</div>
     
    
    <div className={style.addwhole}>

    <div className={style.both}>
    <div className={style.whole}>
        <div className={style.each}>
      <h5>Example Input</h5>
      <Editor 
      width='300px'
      height='200px'
      theme='vs-dark'
      language='plaintext'
      value = {codingQuestion.example_input}
      options={{readOnly:true, minimap:{enabled:false}}}
      />
      </div>
      <div className={style.each}>
      <h5>Example Output</h5>
      <Editor 
      width='300px'
      height='200px'
      theme='vs-dark'
      language='plaintext'
      value = {codingQuestion.example_output}
      options={{readOnly:true, minimap:{enabled:false}}}
      />
      </div>
      </div>
      <div className={style.addtestcase}>
      <h3>Add Test Case</h3>
      <form onSubmit={addTestCase}>
        <div className={style.testcaseinout}>
        <label>
            <h5>Input:</h5>
            <Editor width="300px" height="200px" theme='vs-dark' language='plaintext' value={tinput} onChange={(value,) => setTinput(value)} options={{minimap:{enabled:false}}} />
        </label>
        <label>
            <h5>Expected Output:</h5>
            <Editor width="300px" height="200px" theme='vs-dark' language='plaintext' value={toutput} onChange={(value,) => setToutput(value)} options={{minimap:{enabled:false}}} />
        </label>
        </div>

            <div className={style.marks}>
            Marks:
            <input type='number' value={marks} onChange={(e) => setMarks(e.target.value)} />
        <button type='submit' style={{background: '#ADD8E6'}}>Add Test Case</button>
        </div>
      </form>
      </div>
      </div>

    <div className={style.overall}>
      <h3>Added Test Cases</h3>
      {testCases !== null && testCases.map(tcase =>
      <div key={tcase.id} className={style.tot}>
        <h4>
            Test Case ID: {tcase.id}
        </h4>
        <div className={style.testCasesDisplayDiv}>
        <label>
            <h5>Input:</h5>
            <Editor width="300px" height="200px" theme='vs-dark' language='plaintext' value={tcase.input} options={{readOnly:true, minimap:{enabled:false}}} />
        </label>
        <label>
            <h5>Expected Output:</h5>
            <Editor width="300px" height="200px" theme='vs-dark' language='plaintext' value={tcase.expected_output} options={{readOnly:true, minimap:{enabled:false}}} />
        </label>
        </div>
        <label>
            <strong>Marks:</strong> {tcase.marks}
        </label>
        <div className={style.testCasesButtons}>
        <button onClick={() => handle_edit_test_case(tcase.id)}>Edit</button>
        <button onClick={() => handle_delete_test_case(tcase.id)} style={{ background: '#000', color: '#fff' }}>Delete</button>
        </div>
      </div>)
      }
      </div>
      </div>
      </>}
      </div>
      <Footer />
    </>
  )
}

export default TestCases
