import React, { useState } from 'react';
import style from './paraquestion.module.css';

const ParaQuestion = () => {
  const [textInput1, setTextInput1] = useState('');
  const [textInput2, setTextInput2] = useState('');
  // Add more state variables for additional inputs if needed
  
  const handleTextInput1Change = (event) => {
    setTextInput1(event.target.value);
  };

  const handleTextInput2Change = (event) => {
    setTextInput2(event.target.value);
  };
  // Add more handleChange functions for additional inputs if needed

  const handleSubmit = () => {
    // Here, you can submit all input values
    const formData = {
      input1: textInput1,
      input2: textInput2,
      // Add more input fields to the formData object if needed
    };
    
    // Do something with formData, such as sending it to an API or processing it
    console.log(formData);
  };

  return (
    <div className={style.paraquestion}>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cupiditate maiores ratione autem, nisi vel ex tempora eligendi quae. Sequi corporis cum, ad soluta pariatur tenetur quisquam debitis repudiandae praesentium iusto.</p>
      <label>
        Text Input 1:
        <input
          type="text"
          value={textInput1}
          onChange={handleTextInput1Change}
        />
      </label>
      {/* Add more input fields with their corresponding labels if needed */}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default ParaQuestion;
