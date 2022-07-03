import React, {useState, useRef}  from 'react';
import logo from './logo.svg';
import './App.css';
import CourseList from './CourseList';
import Course from './Course';
import RedBox from 'redbox-react'; 
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [courses, setCourse] = useState<any>([])
  const toAddCourseRef:any = useRef(null)

  function handleAddCourse(){
    if (null !== toAddCourseRef.current){
      const courseCode:number = toAddCourseRef.current['value'];

      setCourse((prevCourse:any) => {
        return [...prevCourse, {id: uuidv4(), code: courseCode}]})
      console.log("setting course")
      toAddCourseRef.current.value = null
    }
  }

  function showsLabelLOL(){
    if(courses.length == 0) {
      return(<div>Please input a course number: </div>)
    }else{
      return(<div>You Added:</div>)
    }
  }
  
  return (
    <div className="App">
        <div>{showsLabelLOL()}</div>
        <CourseList courses = {courses}/>
        <input ref={toAddCourseRef} type="number"></input>
        <button onClick={(handleAddCourse)}>Add course</button>
    </div>
  );
}

export default App;
