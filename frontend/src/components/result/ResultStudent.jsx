import React, { useContext, useEffect, useRef, useState } from 'react'
import Navbar from '../../utility/navbar/Navbar'
import Fake from '../fake/Fake'
import { useParams } from 'react-router-dom'
import AuthContext from '../../utility/AuthContext'
import style from './resultStudent.module.css'
import HTMLReactParser from 'html-react-parser'
import { Editor } from '@monaco-editor/react'
import Footer from '../../utility/Footer'

const ResultStudent = () => {
    let {roll_number, id} = useParams();
    let [selectedOption, setSelectedOption] = useState(null)
    let [testCases, setTestCases] = useState(null)
    let [nquestions, setnquestions] = useState(null)
    let {suspicious_activity, get_suspicious_activity, set_quiz_id, quiz_id, questions, getQuestions, get_coding_question, codingQuestion, get_result_test_cases, getQuiz, quiz, get_questions_with_answers } = useContext(AuthContext)
    const should_get_suspicious_activity = useRef(true)
    useEffect(() => {
      if(should_get_suspicious_activity.current) {
        should_get_suspicious_activity.current = false
        set_quiz_id(id)
        get_suspicious_activity(id, roll_number)
      }
    },[])
    const shouldSetSelectedOption = useRef(true)
    useEffect(() => {
      const fun = async() => {
        let data = await get_result_test_cases(questions.coding[0].id)
        setTestCases(data)
      }
      if(questions !== null && quiz !== null && parseInt(quiz_id) === parseInt(quiz.id) && quiz.coding)
      {
        if(shouldSetSelectedOption.current)
        {
          shouldSetSelectedOption.current = false
          setSelectedOption(questions.coding[0].id)
          get_coding_question(questions.coding[0].id)
          fun()
        }
      }
    }, [questions])
    useEffect(()=>{
      let fun = async () => {
        let data = await get_questions_with_answers(quiz.id)
        setnquestions(data)
      }
      if(quiz !== null && quiz.coding === false) {
        fun()
      }
    },[quiz])
    const handleSelectionChange = async (e) => {
      setSelectedOption(e.target.value)
      get_coding_question(e.target.value)
      let data = await get_result_test_cases(e.target.value)
      setTestCases(data)
    }

    useEffect(() => {
      if(quiz_id !== null && quiz_id === id) {
        getQuestions()
        getQuiz()
      }
    }, [quiz_id])

    const convertToCSV = () => {
      if (suspicious_activity.length === 0) {
          return ''; // Return empty string if no data is available
      }
      const csvRows = [
          ['Timestamp', 'Full Screen', 'Full Screen Duration', 'Hidden', 'Hidden Duration']
      ];
      suspicious_activity.forEach(sa => {
          csvRows.push([sa.time, sa.full, sa.full_duration, sa.hidden, sa.hidden_duration]);
      });
      return csvRows.map(row => row.join(',')).join('\n');
  };
  const handleDownload = () => {
    const csvData = convertToCSV();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suspicious_activity_${roll_number}_quiz_${id}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};

  return (
    <>
      <Navbar />
      <Fake />
      <div className={style.container} >
      <h2>Suspicious Activity of {roll_number}</h2>
      <button onClick={handleDownload}>Download CSV</button>
      <table style={{ width: '41%', border: '1px solid black', borderCollapse: 'collapse', textAlign: 'center',marginTop:'25px' }}>
        <thead>
          <tr>
          <th style={{ border: '1px solid black', padding: '8px' }}>Timestamp</th> 
            <th style={{ border: '1px solid black', padding: '8px' }}>Full Screen</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Full Screen Duration</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Hidden</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Hidden Duration</th>
          </tr>
        </thead>
        <tbody>
          {suspicious_activity !== null && suspicious_activity.map((activity, index) => (
            <tr key = {index}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{activity.time}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{activity.full ? 'Yes':'No'}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{activity.full_duration}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{activity.hidden ? 'Yes':'No'}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{activity.hidden_duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className={style.resultBodyContainer}>
        <div className={style.resultbody}>
          <h2>Responses of {roll_number}</h2>
        {quiz !== null && parseInt(quiz.id) === parseInt(quiz_id) && quiz.coding && questions!== null && selectedOption !== null &&
        <div className={style.codingQuestionSelector}>
          <h4>Question:</h4>
        <select name = "question" id = "code" value = {selectedOption} onChange={handleSelectionChange}>
          {questions.coding.map(que =>
          <option key = {que.id} value = {que.id}>{HTMLReactParser(que.title)}</option>
            )}
        </select>
        </div>
        }
        {quiz !== null && parseInt(quiz.id) === parseInt(quiz_id) && quiz.coding && codingQuestion !== null && <div className={style.QuestionsResultDiv}>
          <h5>{HTMLReactParser(codingQuestion.title)}</h5>
          {HTMLReactParser(codingQuestion.question)}
        </div>}
        {quiz !== null && parseInt(quiz.id) === parseInt(quiz_id) && quiz.coding && <h3>Test Cases</h3>}
        <div className={style.testCasesDiv}>
        {testCases !== null && testCases.map(tc => 
          <div className={style.codingTestCasesDiv} key={tc.id}>
            <h4>ID : {tc.id}</h4>
            <div className={style.testCaseDiv}>
            <div className={style.testCaseEditordiv}>
            <strong>Input</strong>
            <Editor
              height="200px"
              width="300px"
              theme='vs-dark'
              language='plaintext'
              value = {tc.input}
              options={{ readOnly: true, minimap:{enabled:false} }}
            />
            </div>
            <div className={style.testCaseEditordiv}>
            <strong>Expected Output</strong>
            <Editor
              height="200px"
              width="300px"
              theme='vs-dark'
              language='plaintext'
              value = {tc.expected_output}
              options={{ readOnly: true, minimap:{enabled:false} }}
            />
            </div>
            <div className={style.testCaseEditordiv}>
            <strong>Output</strong>
            <Editor
              height="200px"
              width="300px"
              theme='vs-dark'
              language='plaintext'
              value = {tc.result.output}
              options={{ readOnly: true, minimap:{enabled:false} }}
            />
            </div>
            </div>
            <p><strong>Score :</strong> {tc.result.score}</p>
            <p><strong>Marks : </strong>{tc.marks}</p>
          </div>
        )}
        </div>

        {quiz !== null && parseInt(quiz.id) === parseInt(quiz_id) && quiz.mcqs && (<>
          <h2>Multiple Choice Questions</h2>
          {nquestions !== null && nquestions.mcqs.map((que, index) =>
          <div className={style.QuestionsResultDiv} key = {que.id}>
            <div style={{display:'flex', gap:'5px'}}>
            <strong>{index + 1}.</strong>
            {HTMLReactParser(que.question)}
            </div>
            <ul style={{margin:'0'}}>
              {que.options.map(op => <li key={op.id}><div style={{display:'flex', gap:'5px'}}><strong>[ID : {op.id}]</strong>{HTMLReactParser(op.value)}</div></li>)}
            </ul>
            <div style={{display:'flex', flexDirection:'column'}}>
            <p style={{margin:'0'}}><strong>Answer :</strong> {que.answer}</p>
            <p style={{margin:'0'}}><strong>Response :</strong> {que.response === -1 ? "Unattempted":que.response}</p>
            <p style={{margin:'0'}}><strong>Marks :</strong> {que.marks}</p>
            </div>
          </div>)}
          </>
        )}

        {quiz !== null && parseInt(quiz.id) === parseInt(quiz_id) && quiz.numericals && (<>
        <h2>Integer Type Questions</h2>
        {nquestions !== null && nquestions.numericals.map((que, index) =>
        <div className={style.QuestionsResultDiv} key = {que.id}>
          <div style={{display:'flex', gap:'5px'}}>
            <strong>{index + 1}.</strong>
            {HTMLReactParser(que.question)}
            </div>
            <div style={{display:'flex', flexDirection:'column'}}>
            <p style={{margin:'0'}}><strong>Answer :</strong> {que.answer}</p>
            <p style={{margin:'0'}}><strong>Response :</strong> {que.response === -1 ? "Unattempted":que.response}</p>
            <p style={{margin:'0'}}><strong>Marks :</strong> {que.marks}</p>
            </div>
        </div>
      )}
        </>)}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ResultStudent
