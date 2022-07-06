import React, { useState, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import CourseList from './CourseList';
import Course from './Course';
import RedBox from 'redbox-react';
import { v4 as uuidv4 } from 'uuid';
import { addSyntheticLeadingComment } from 'typescript';

function App(this: any) {
  const [courses, setCourse] = useState<any>([])
  const toAddCourseRef:any = useRef(null)//useRef<HTMLInputElement | null>(null)
  let courseName: string
  let courseNumber: number

  //fetching from API(fetch is a PROMISE)
  // fetch('https://api.peterportal.org/rest/v0/schedule/soc?/term=2022%20Fall&department=EECS&&sectionCode=16470')
  //   .then(res => res.json())
  //   .then(data => console.log(data))

  function handleAddCourse(event:any) {
    event.preventDefault();

    if (null !== toAddCourseRef.current) {
      const courseCode: number = toAddCourseRef.current['value'];

      courseName = (document.getElementById("name") as HTMLInputElement).value
      courseNumber = Number((document.getElementById("number") as HTMLInputElement).value)

      console.log(`https://api.peterportal.org/rest/v0/schedule/soc?term=2022%20Fall&department=${courseName}&courseNumber=${courseNumber}`)

      //fetching api to see if course exists
      fetch(`https://api.peterportal.org/rest/v0/schedule/soc?term=2022%20Fall&department=${courseName}&courseNumber=${courseNumber}`)
       .then(res => res.json())
       .then((data) => { 
        
        console.log(data)
        console.log(data["schools"].length)
        if(!(data["schools"].length)){
          alert("Invalid Department or Course Number! Please try again!")
          return 
          
        }else{
          setCourse((prevCourse: any) => {
          return [...prevCourse, { id: uuidv4(), code: courseCode, dpt: courseName, num: courseNumber }]
          })
          toAddCourseRef.current.value = null
          APIFetchingQuery(courseName, courseNumber)
      }
        }
      )
      .catch(() => alert("API ERROR!"))

      let a = (document.getElementById("myForm") as HTMLFormElement)
      a.reset() //<------------------- SO SCUFFED

    }
  }

  const APIFetchingQuery = (department:string, courseNumber:number) =>  {
    console.log('https://api.peterportal.org/rest/v0/schedule/soc?term=2022%20Fall&department=' + department + '&courseNumber='+ courseNumber)
    fetch('https://api.peterportal.org/rest/v0/schedule/soc?term=2022%20Fall&department=' + department + '&courseNumber='+ courseNumber)
     .then(res => res.json())
     .then(data => console.log(data))
  }

  function showsLabelLOL() {
    if (courses.length == 0) {
      return (<div>Please input a course number: </div>)
    } else {
      return (<div>You Added:</div>)
    }
  }

  return (
    <div className="App">
      <div>{showsLabelLOL()}</div>
      <CourseList courses={courses} />
      <form id="myForm" onSubmit={(handleAddCourse)}>
        <div>
          <label>
            Enter Department Name:
            <input id="name" type="text"></input>
          </label>
        </div>
        <div>
          <label>
            Enter Course Number:
            <input id="number" type="number"></input>
          </label>
        </div>
        <div>
          <label>Course Code
            <input ref={toAddCourseRef} type="number"></input>
          </label>
        </div>
        <input type='submit' value='AddCourse' />
      </form>
    </div>
  );
}

export default App;
