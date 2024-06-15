import React, { useContext, useEffect, useRef, useState } from 'react'
import style from './coding.module.css'
import AuthContext from '../../../utility/AuthContext'
import HTMLReactParser from 'html-react-parser'
import { Editor } from '@monaco-editor/react'
import { useNavigate } from 'react-router-dom'

const Coding = () => {
  let {quiz_id, questions, run_code, save_code, run_saved_code, get_saved_code} = useContext(AuthContext)
  let [selectedOption, setSelectedOption] = useState(null)
  const [responseMessage, setResponseMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const shouldSetSelectedOption = useRef(true)
  let [res, setRes] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if(questions !== null)
    {
      if(shouldSetSelectedOption.current)
      {
        shouldSetSelectedOption.current = false
        setSelectedOption(questions.coding[0].id)
      }
    }
  }, [questions])
  let [einput, setEinput] = useState('')
  let [eoutput, setEoutput] = useState('')
  let [code_output, set_code_output] = useState('')

  useEffect(() => {
    if(selectedOption !== null) {
      questions.coding.map(ques => { if (parseInt(ques.id) === parseInt(selectedOption)) {
        setEinput(ques.example_input)
        setEoutput(ques.example_output)
      }})
    }
  }, [selectedOption])

  const handleSelectionChange = (e) => {
    setSelectedOption(e.target.value)
  }

  let [answerCode, setAnswerCode] = useState('')

  const saveCode = async () => {
    setShowPopup(true)
    const responseData = {
      quiz:parseInt(quiz_id),
      coding:{[parseInt(selectedOption)]: answerCode}
    }
    const data = await save_code(responseData)
    setResponseMessage(data.message)
    setTimeout(() => {
      setShowPopup(false);
      setResponseMessage("")
    }, 3000);
  }

  let runCode = async () => {
    set_code_output("Running...")
    setResponseMessage("Compiling...")
    setShowPopup(true)
    const responseData = {
      code:answerCode,
      question: selectedOption
    }
    let data = await run_code(responseData)
    set_code_output(data.output)
    setResponseMessage(data.message)
    setRes(data.result)
    setTimeout(() => {
      setShowPopup(false);
      setResponseMessage("")
    }, 3000);
  }

  let runSaved = async () => {
    set_code_output("Running...")
    setResponseMessage("Compiling...")
    setShowPopup(true)
    const responseData = {
      quiz:parseInt(quiz_id),
      question: parseInt(selectedOption),
    }
    let data = await run_saved_code(responseData)
    set_code_output(data.output)
    setResponseMessage(data.message)
    setRes(data.result)
    setTimeout(() => {
      setShowPopup(false);
      setResponseMessage("")
    }, 3000);

  }

  let getSaved = async () => {
    setAnswerCode("Getting Code...")
    setShowPopup(true)
    let data = await get_saved_code(quiz_id, parseInt(selectedOption))
    setAnswerCode(data.code)
    setResponseMessage(data.message)
    setTimeout(() => {
      setShowPopup(false);
      setResponseMessage("")
    }, 3000);
  }
  return (
    <div className={style.codingQuestions}>
      {showPopup && (
        <div className={style.popup}>
          <p>{responseMessage}</p>
        </div>
      )}
      <div className={style.codingDiv}>
      <div className={style.codingLeft}>
        <h4>Problem Statements</h4>
        {questions!== null && questions.coding.map(que =>
      <div key={que.id} className={style.codingQuestionText}>
        <h5>{HTMLReactParser(que.title)}</h5>
        {HTMLReactParser(que.question)}
      </div>)}</div>
      <div className={style.codingRight}>
        <h4>Test Cases </h4>
      {questions!== null && selectedOption !== null &&
      <>
        <div className={style.QuestionSelector}><h5>Question:</h5>
        <select className={style.codingSelector} name = "question" id = "code" value = {selectedOption} onChange={handleSelectionChange}>
          {questions.coding.map(que =>
          <option key = {que.id} value = {que.id}>{HTMLReactParser(que.title)}</option>
            )}
        </select>
        </div>
        <Editor
        height="300px"
        theme='vs-dark'
        width='99%'
        language='cpp'
        value={answerCode}
        onChange={(value,) => setAnswerCode(value)}
        options={{minimap:{enabled:false}}}
        />
        <div className={style.codingSelect}>
        <div onClick={saveCode}>Save Code</div>
        <div onClick={runCode}>Run Code</div>
        <div onClick={runSaved}>Run Saved Code</div>
        <div onClick={getSaved}>Get Saved Code</div>
      </div>
      <div className={style.codeTestCases}>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}><h5>Example Input</h5>
        <Editor
        height="100px"
        width="200px"
        theme='vs-dark'
        language='plaintext'
        value = {einput}
        options={{ readOnly: true, minimap:{enabled:false} }}
        /></div>
        <div><h5>Example Output</h5>
        <Editor
        height="100px"
        width="200px"
        theme='vs-dark'
        language='plaintext'
        value = {eoutput}
        options={{ readOnly: true, minimap:{enabled:false} }}
        /></div>
        <div >
          <div style={{textAlign:'center'}}>
          <h5>Your Output</h5></div>
        <Editor
        width= '540px'
        height='300px'
        theme='vs-dark'
        language='plaintext'
        value = {code_output}
        options={{ readOnly: true, minimap:{enabled:false} }}
        />
        </div>
      </div>
      </>}
      <p><strong id='resultid'>Result :</strong> {res ? <>Matching</>:<>Not Matching</>}</p>
      </div>
      </div>
    </div>
  )
}

export default Coding
