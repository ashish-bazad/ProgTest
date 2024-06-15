import { createContext, useState, useEffect, useRef } from 'react';
const AuthContext = createContext();
export default AuthContext;

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

export const AuthProvider = ({children}) => {
    let csrfToken = getCookie('csrftoken')
    let [isAuthenticated, setIsAuthenticated] = useState(false)
    const shouldCheckAuthentication = useRef(true)
    const api_path = 'https://csotesting.azurewebsites.net/'
    // const api_path = `${api_path}'
    let checkAuthentication = async () => {
        try {
            const response = await fetch(`${api_path}check-authentication/`, {
              credentials:'include',
            });
            if (response.ok) {
                const data = await response.json();
                setIsAuthenticated(data.authenticated);
            } else {
                throw new Error('Failed to check authentication status');
            }
        } catch (error) {
            console.error('Error checking authentication status:', error);
        }
    }
    useEffect(() => {
        if(shouldCheckAuthentication.current)
        {
            checkAuthentication();
            shouldCheckAuthentication.current = false
        }
    },[])
    let add_quiz = async (requestData) => {
        const response = await fetch(`${api_path}api/createQuiz/`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken,
            },
            credentials:'include',
            body: JSON.stringify(requestData)
        })
    }
    let edit_quiz = async(requestData) => {
        const response = await fetch(`${api_path}api/editQuiz/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials:'include',
            body: JSON.stringify(requestData)
        })
    }
    let [question_id, setQuestion_id] = useState(null)
    let add_mcq_question = async (requestData) => {
        console.log(requestData)
        const response = await fetch(`${api_path}api/addMCQquestion/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify(requestData)
        })
        if(response.status === 201){
            let data = await response.json()
            return data [0]
        }
    }
    let add_mcq_option = async (requestData) => {
        const response = await fetch(`${api_path}api/addMCQoption/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify(requestData)
        })
    }
    let [numerical_question_id, set_numerical_question_id] = useState(null)
    let add_numerical_question = async (requestData) => {
        const response = await fetch(`${api_path}api/addNumericalQuestion/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify(requestData)
        })
        if(response.status === 201)
        {
            let data = await response.json()
            set_numerical_question_id(data[0])
            return data[0]
        }
    }

    let add_numerical_answer = async (requestData) => {
        const response = await fetch(`${api_path}api/addNumericalAnswer/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify(requestData)
        })
    }

    let [allQuiz, setAllQuiz] = useState(null)
    let getAllQuiz = async () => {
        const response = await fetch(`${api_path}api/get_quizes/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
        })
        if (response.status === 200) {
            let data = await response.json()
            setAllQuiz(data)
        } else {
            console.log("Some Error occurred in getting quizzes")
        }
    }

    let [quiz_id, set_quiz_id] = useState(null)
    let [questions, set_questions] = useState(null)
    let getQuestions = async () => {
        const response = await fetch(`${api_path}api/get_questions/?quiz=${quiz_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
        })
        if(response.status === 200) {
            let data = await response.json()
            set_questions(data)
        } else {
            console.log("Error in getting questions")
        }
    }

    let saveResponses = async (requestData) => {
        const response = await fetch(`${api_path}api/save_responses/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify(requestData)
        })
    }
    let [quiz, setQuiz] = useState(null)
    let getQuiz = async () => {
        const response = await fetch(`${api_path}api/get_quiz/?quiz=${quiz_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
        })
        if(response.status === 200)
        {
            const data = await response.json()
            setQuiz(data)
        }
        else
        {
            console.log("Error in getting quiz data")
        }
    }
    let delnum = async(requestData) => {
        const response = await fetch(`${api_path}api/delnum/`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials:'include',
            body: JSON.stringify(requestData),
        })
    }
    let delmcq = async(requestData) => {
        const response = await fetch(`${api_path}api/delmcq/`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials:'include',
            body: JSON.stringify(requestData),
        })
    }
    let delquiz = async(requestData) => {
        const response = await fetch(`${api_path}api/delquiz/`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials:'include',
            body: JSON.stringify(requestData),
        })
    }
    let check_attempted = async() => {
        const response = await fetch(`${api_path}api/check_attempted/?id=${quiz_id}`, {
            method:'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials:'include',
        })
        if(response.status === 200){
            let data = await response.json()
            return data[0]
        }
    }
    let add_coding_question = async(responseData) => {
        const response = await fetch(`${api_path}api/add_coding_question/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials:'include',
            body: JSON.stringify(responseData)
        })
    }
    let editCoding_question = async(responseData) => {
        const response = await fetch(`${api_path}api/edit_coding_question/`, {
            method:'POST',
            headers: {
                'Content-Type':'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
            body: JSON.stringify(responseData)
        })
    }
    let del_coding_question = async(responseData) => {
        const response = await fetch(`${api_path}api/del_coding_question/`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials:'include',
            body: JSON.stringify(responseData)
        })
    }
    let [numcoding, setNumcoding] = useState(0)
    let numCod = async() => {
        const response = await fetch(`${api_path}api/numCod/?quiz=${quiz_id}`, {
            method:'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials:'include',
        })
        let data = await response.json()
        setNumcoding(data[0])
    }
    let compute_result = async () => {
        const response = await fetch(`${api_path}api/compute_result/?quiz=${quiz_id}`, {
            method:'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials:'include',
        })
    }
    let run_code = async (responseData) => {
        const response = await fetch(`${api_path}api/run_code/`, {
          method:'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          credentials:'include',
          body: JSON.stringify(responseData)
        })
        let data = await response.json()
        return data
      }
    let save_code = async (responseData) => {
        const response = await fetch(`${api_path}api/save_code/`, {
          method:'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          credentials:'include',
          body: JSON.stringify(responseData)
        })
        let data = await response.json()
        return data
    }
    let run_saved_code = async(responseData) => {
        const response = await fetch(`${api_path}api/run_saved_code/`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
            body: JSON.stringify(responseData)
        })
        let data = await response.json()
        return data
    }
    let submit_code_quiz = async(responseData) => {
        const response = await fetch(`${api_path}api/submit_code_quiz/`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
            body: JSON.stringify(responseData)
        })
    }
    let [isSuperuser, setIsSuperuser] = useState(false)
    let check_superuser = async () => {
        const response = await fetch(`${api_path}api/check_superuser/`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
        })
        if(response.ok)
        {
            const data = await response.json()
            setIsSuperuser(data.superuser)
        }
    }
    useEffect(()=> {
        if(isAuthenticated)
        {
            check_superuser()
        }
    },[isAuthenticated])
    let add_suspicious_activity = async (responseData) => {
        const response = await fetch(`${api_path}api/add_suspicious_activity/`, {
            method:'POST',
            headers: {
                'Content-Type':'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
            body: JSON.stringify(responseData)
        })
    }

    let [roll, setRoll] = useState(false)
    let check_roll = async () => {
        const response = await fetch(`${api_path}api/check_roll_number/`, {
            method:"GET",
            headers: {
                'Content-Type':'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
        })
        let data = await response.json()
        setRoll(data.roll)
    }
    let add_roll = async(responseData) => {
        const resposne = await fetch(`${api_path}api/add_roll_number/`, {
            method:"POST",
            headers: {
                'Content-Type':'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
            body: JSON.stringify(responseData),
        })
    }
    const shouldCheckRoll = useRef(true)
    useEffect(() => {
        if(shouldCheckRoll.current)
        {
            check_roll();
            shouldCheckRoll.current = false
        }
    },[isAuthenticated])
    const [results, setResults] = useState([]);
    let get_result_all = async() => {
        const response = await fetch(`${api_path}api/get_result_all/?quiz=${quiz_id}`, {
            method:"GET",
            headers:{
                'Content-Type':'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
        })
        const data = await response.json()
        const resultsArray = Object.entries(data).map(([key, value]) => ({ roll_number: key, marks: value }));
        setResults(resultsArray);
    }

    let [testCases, setTestCases] = useState(null)
    let get_test_cases = async (responseData) => {
        const response = await fetch(`${api_path}api/get_test_cases/?question_id=${responseData}`, {
            method:"GET",
            headers: {
                'Content-Type':'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
        })
        if(response.ok){
            let data = await response.json()
            setTestCases(data)
        }
    }
    let [codingQuestion, setCodingQuestion] = useState(null)
    let get_coding_question = async(responseData) => {
        const response = await fetch(`${api_path}api/get_coding_question/?id=${responseData}`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
        })
        if(response.ok) {
            let data = await response.json()
            setCodingQuestion(data)
            return data
        }
    }
    let add_test_case = async(responseData) => {
        const response = await fetch(`${api_path}api/add_test_case/`, {
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
            body: JSON.stringify(responseData),
        })
    }
    let delete_test_case = async(responseData) => {
        const response = await fetch(`${api_path}api/delete_test_case/`, {
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
            body: JSON.stringify(responseData),
        })
    }
    let [suspicious_activity, setSuspicious_activity] = useState(null)
    let get_suspicious_activity = async (qid, rollnumber) => {
        const response = await fetch(`${api_path}api/get_suspicious_activity/?id=${qid}&roll=${rollnumber}`, {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
        })
        if(response.ok) {
            let data = await response.json()
            setSuspicious_activity(data)
        }
    }
    const parseDateTime = (dateString, timeString) => {
        if (!dateString || !timeString) return null;
        const [year, month, day] = dateString.split('-').map(Number);
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes, seconds);
      };
    
    const get_saved_code = async (id, qid) => {
        const response = await fetch(`${api_path}api/get_saved_code/?quiz=${id}&question=${qid}`, {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
        })
        let data = await response.json()
        return data
    }
    const get_test_case = async (test_case_id) => {
        const response = await fetch(`${api_path}api/get_test_case/?id=${test_case_id}`, {
            method:'GET',
            headers: {
                'Content-Type':'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
        })
        let data = await response.json()
        return data
    }
    const edit_test_case = async (responseData) => {
        const response = await fetch(`${api_path}api/edit_test_case/`, {
            method:'POST',
            headers: {
                'Content-Type':'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
            body: JSON.stringify(responseData),
        })
    }

    const edit_mcq_question = async (responseData) => {
        const response = await fetch(`${api_path}api/edit_mcq_question/`, {
            method:'POST',
            headers: {
                'Content-Type':'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
            body: JSON.stringify(responseData)
        })
    }
    const edit_numerical_question = async (responseData) => {
        const response = await fetch(`${api_path}api/edit_numerical_question/`, {
            method:'POST',
            headers: {
                'Content-Type':'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
            body: JSON.stringify(responseData)
        })
    }
    const edit_mcq_option = async(responseData) => {
        const response = await fetch(`${api_path}api/edit_mcq_option/`, {
            method:'POST',
            headers: {
                'Content-Type':'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
            body: JSON.stringify(responseData),
        })
    }
    const get_mcq_question = async(qid) => {
        const response = await fetch(`${api_path}api/get_mcq_question/?id=${qid}`, {
            method:'GET',
            headers: {
                'Content-Type':'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
        })
        let data = await response.json()
        return data
    }
    const get_numerical_question = async(qid) => {
        const response = await fetch(`${api_path}api/get_numerical_question/?id=${qid}`, {
            method:'GET',
            headers: {
                'Content-Type':'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
        })
        let data = await response.json()
        return data
    }
    const get_mcq_answer = async(qid) => {
        const response = await fetch(`${api_path}api/get_mcq_answer/?id=${qid}`, {
            method:'GET',
            headers: {
                'Content-Type':'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
        })
        let data = await response.json()
        return data
    }
    const get_result_test_cases = async(id) => {
        const response = await fetch(`${api_path}api/get_result_test_cases/?id=${id}`, {
            method:'GET',
            headers: {
                'Content-Type':'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
        })
        let data = await response.json()
        return data
    }
    const get_questions_with_answers = async(id) => {
        const response = await fetch(`${api_path}api/get_questions_with_answers/?id=${id}`, {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'X-CSRFToken':csrfToken,
            },
            credentials:'include',
        })
        let data = await response.json()
        return data
    }

    let contextData = {
        add_quiz,
        edit_quiz,
        add_mcq_question,
        add_mcq_option,
        add_numerical_question,
        add_numerical_answer,
        allQuiz,
        getAllQuiz,
        quiz_id,
        set_quiz_id,
        getQuestions,
        questions,
        saveResponses,
        getQuiz,
        quiz,
        question_id,
        numerical_question_id,
        setQuestion_id,
        set_numerical_question_id,
        delmcq,
        delnum,
        delquiz,
        check_attempted,
        add_coding_question,
        del_coding_question,
        numCod,
        numcoding,
        isAuthenticated,
        compute_result,
        run_code,
        save_code,
        run_saved_code,
        submit_code_quiz,
        isSuperuser,
        add_suspicious_activity,
        roll,
        add_roll,
        get_result_all,
        testCases,
        get_test_cases,
        codingQuestion,
        get_coding_question,
        add_test_case,
        delete_test_case,
        suspicious_activity,
        get_suspicious_activity,
        results,
        parseDateTime,
        get_saved_code,
        editCoding_question,
        edit_test_case,
        get_test_case,
        edit_mcq_question,
        edit_mcq_option,
        get_mcq_question,
        get_mcq_answer,
        edit_numerical_question,
        get_numerical_question,
        get_result_test_cases,
        get_questions_with_answers,
        api_path,
    }
    return (
        <AuthContext.Provider value = {contextData}>
            {children}
        </AuthContext.Provider>
    )
}