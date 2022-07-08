import React, { createRef, useState, useRef, Component, MutableRefObject } from 'react';
import logo from './logo.svg';
import './App.css';
import CourseList from './CourseList';
import Course from './Course';
import Class from './Class';
import { v4 as uuidv4 } from 'uuid';
import { addSyntheticLeadingComment } from 'typescript';
import type { CoursesResponse, DepartmentResponse, MeetingResponse, SchoolResponse, SectionResponse, SocResponse, UserInputCourse } from './Types';
import moment from "moment"

export default class App extends Component<{}, { courses: UserInputCourse[] , classes: Class [], searchResults: Class[]}> {

    codeRef: React.RefObject<HTMLInputElement>
    nameRef: React.RefObject<HTMLInputElement>  
    numberRef: React.RefObject<HTMLInputElement>

    constructor(props: any) {
        super(props)
        this.codeRef = createRef()
        this.nameRef = createRef()
        this.numberRef = createRef()
        this.state = {
            courses: [],
            classes: [],
            searchResults: []
        }
        this.handleAddCourse = this.handleAddCourse.bind(this)
        this.showsLabelLOL = this.showsLabelLOL.bind(this)
        this.showsSearchLabel = this.showsSearchLabel.bind(this)
    }

    async handleAddCourse(event:any) {

        event.preventDefault()
        let data: SocResponse
        let schoolData: SchoolResponse []
        let dept: DepartmentResponse []
        let courses: CoursesResponse []
        let sections: SectionResponse []
        let meetings: MeetingResponse [] = []
        let classObject: Class

        //clearing search results
        this.setState({searchResults: []})

        if ((null !== this.codeRef.current) && (null !== this.nameRef.current) && (null !== this.numberRef.current)) {
            let courseCode = Number(this.codeRef.current.value)
            let courseName = this.nameRef.current.value
            let courseNumber = Number(this.numberRef.current.value)
            
            //fetching api to see if course exists
            if(courseCode === 0 ){
                data = await this.fetchAPI(`https://api.peterportal.org/rest/v0/schedule/soc?term=2022%20Fall&department=${courseName}&courseNumber=${courseNumber}`)

                if (!(data.schools.length)) {
                    alert("Invalid Department or Course Number! Please try again!")
                    return
                }

                schoolData = data.schools
                dept = schoolData[0].departments
                courses = dept[0].courses
                sections = courses[0].sections

                let tempArray:Class [] = []
    
                for(let i = 0; i < sections.length; i++){
                    meetings = [...meetings, sections[i].meetings[0]]
                    classObject = new Class(sections[i].sectionCode, meetings[i].days, courses[0].courseTitle, meetings[i].time)
                    tempArray = [...tempArray, classObject]
                    this.setState({searchResults: [...this.state.classes, ...tempArray]})
                }
                console.log(tempArray)
    
            } else{
                data = await this.fetchAPI(`https://api.peterportal.org/rest/v0/schedule/soc?term=2022%20Fall&department=${courseName}&courseNumber=${courseNumber}&sectionCodes=${courseCode}`)

                if (!(data.schools.length)) {
                    alert("Invalid section Code!")
                }else{
                    schoolData = data.schools
                    dept = schoolData[0].departments
                    courses = dept[0].courses
                    sections = courses[0].sections

                    let tempArray:Class [] = []
        
                    for(let i = 0; i < sections.length; i++){
                        meetings = [...meetings, sections[i].meetings[0]]
                        classObject = new Class(sections[i].sectionCode, meetings[i].days, courses[0].courseTitle, meetings[i].time)
                        tempArray = [...tempArray, classObject]
                        this.setState({classes: [...this.state.classes, tempArray[i]]})
                    }
                }

                this.setState({ courses: [...this.state.courses, { id: uuidv4(), courseCode, courseName, courseNumber }] })
                this.codeRef.current.value = ""
                this.nameRef.current.value = ""
    
            }

            return (data)
        }
        return null
    }

    async fetchAPI(url: string) {
        const response = await fetch(url)
        const data = await response.json()
        return data
    }

    showsLabelLOL() {
        if (this.state.courses.length == 0) {
            return (<div>Please input a course number: </div>)
        } else {
            return (<div>You Added:</div>)
        }
    }

    showsSearchLabel() {
        if (this.state.searchResults.length == 0) {
            return (<div></div>)
        } else {
            return (<div>You looked for:</div>)
        }
    }

    render() {

        return (
            <div className="App">
                <this.showsLabelLOL />
                <CourseList courses={this.state.courses} />
                <form onSubmit={(this.handleAddCourse)}>
                    <div>
                        <label>
                            Enter Department Name: 
                            <input ref={this.nameRef} type="text"></input>
                        </label>
                    </div>
                    <div>
                        <label>
                            Enter Course Number: 
                            <input ref={this.numberRef} type="number"></input>
                        </label>
                    </div>
                    <div>
                        <label>Course Code: 
                            <input ref={this.codeRef} type="number"></input>
                        </label>
                    </div>
                    <input type='submit' value='AddCourse' />
                </form>
                <this.showsSearchLabel/>
                <ClassList classes={this.state.searchResults}/>
            </div>
        )
    }
}



function ClassPrint ({sectionCode, classTitle, days, time}:{sectionCode:any, classTitle:any, days:any, time:any}){

    return <div>{sectionCode} {classTitle} {days.map((days:string) => <a>{days}</a>)} {`${time[0].format("hh:mm")}-${time[1].format("hh:mm")}`}</div>
}

function ClassList ({classes}:{classes:any}){

     // return <div>{courses.length}</div>
     return(
        classes.map((classes:Class) => {
        return (
        <ClassPrint key={classes.courseCode} sectionCode={classes.courseCode} classTitle={classes.name} days={classes.days} time={classes.timeStartnEnd}/>
        )
     }
     ))
    
}