import React, { useState, useEffect, useContext } from 'react'
import './App.css'
import Upcoming from './components/upcoming/Upcoming'
import Landingpage from './components/landingpage/Landingpage'
import Quiz from './components/quiz/Quiz'
import { AuthProvider } from './utility/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Teacher from './components/teacher/Teacher'
import EditQuiz from './components/teacher/edit_quiz/EditQuiz'
import Instructions from './components/quiz/instructions/Instructions'
import Result from './components/result/Result'
import ResultStudent from './components/result/ResultStudent'
import TestCases from './components/teacher/edit_quiz/coding/TestCases'

function App() {

  return (
    <AuthProvider>
    <Router>
        <Routes>
            <Route exact path = '/' element = {<Landingpage />} />
            <Route exact path='/upcoming' element={<Upcoming />} />
            <Route path = '/quiz/:id' element = {<Quiz />} />
            <Route path = '/instructions/:id' element = {<Instructions />} />
            <Route exact path = '/teacher' element = {<Teacher />} />
            <Route path = '/edit_quiz/:id' element = {<EditQuiz />} />
            <Route path = '/result/:id' element = {<Result />} />
            <Route path = '/result/:id/:roll_number' element = {<ResultStudent />} />
            <Route path = '/edit_quiz/:id/coding/:question_id' element = {<TestCases />} />
        </Routes>
    </Router>
    </AuthProvider>
  )
}

export default App
