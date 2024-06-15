import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../../utility/navbar/Navbar';
import Fake from '../fake/Fake';
import AuthContext from '../../utility/AuthContext';
import style from './result.module.css'
import Footer from '../../utility/Footer';

const Result = () => {
    let {id} = useParams();
    let {quiz_id, set_quiz_id, results, get_result_all, compute_result} = useContext(AuthContext)

    const shouldSetQuizId = useRef(true)
    useEffect(()=> {
        if(shouldSetQuizId.current) {
            shouldSetQuizId.current = false
            set_quiz_id(id)
        }
    }, [])

    useEffect(() => {
        if(quiz_id !== null && quiz_id === id)
        {
            get_result_all()
        }
    }, [quiz_id])

    const convertToCSV = () => {
        if (results.length === 0) {
            return ''; // Return empty string if no data is available
        }
        const csvRows = [
            ['Roll Number', 'Marks']
        ];
        results.forEach(result => {
            csvRows.push([result.roll_number, result.marks]);
        });
        return csvRows.map(row => row.join(',')).join('\n');
    };

    const handleDownload = () => {
        const csvData = convertToCSV();
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'results.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

  return (
    <>
      <Navbar />
      <Fake />
      <div className={style.container}>
        <h1>Results of Quiz {quiz_id}</h1>
        <div className={style.whole}>
      <button onClick={compute_result}>Compute Result</button>
      <button onClick={get_result_all}>Refresh Results</button>
      <button onClick={handleDownload}>Download CSV</button>
      </div>

        <table style={{ width: '420px', border: '1px solid black', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead>
                <tr>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Roll Number</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Marks</th>
                </tr>
            </thead>
            <tbody>
                {results.map((result, index) => (
                    <tr key={index}>
                        <td style={{ border: '1px solid black', padding: '8px' }}><Link to = {`/result/${id}/${result.roll_number}`}>{result.roll_number}</Link></td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>{result.marks}</td>
                    </tr>
                ))}
            </tbody>
        </table>

    </div>
    <Footer />
    </>
  )
}

export default Result
