import React, { createRef, useState, useRef, Component, MutableRefObject } from 'react';
import logo from './logo.svg';
import './App.css';
import CourseList from './CourseList';
import Course from './Course';
import Class from './Class';
import { v4 as uuidv4 } from 'uuid';
import { addSyntheticLeadingComment } from 'typescript';
import type { CoursesResponse, DepartmentResponse, MeetingResponse, SchoolResponse, SectionResponse, SocResponse, UserInputCourse } from './Types';

export default class App extends Component<{}, { courses: UserInputCourse[] , classes: Class []}> {

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
            classes: []
        }
        this.handleAddCourse = this.handleAddCourse.bind(this)
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

        console.log("HI")
        console.log(this.numberRef.current)

        if ((null !== this.codeRef.current) && (null !== this.nameRef.current) && (null !== this.numberRef.current)) {
            let courseCode = Number(this.codeRef.current.value)
            let courseName = this.nameRef.current.value
            let courseNumber = Number(this.numberRef.current.value)

            console.log(`https://api.peterportal.org/rest/v0/schedule/soc?term=2022%20Fall&department=${courseName}&courseNumber=${courseNumber}`)
            
            //fetching api to see if course exists
            if(courseCode === 0 ){
                data = await this.fetchAPI(`https://api.peterportal.org/rest/v0/schedule/soc?term=2022%20Fall&department=${courseName}&courseNumber=${courseNumber}`)

                schoolData = data.schools
                dept = schoolData[0].departments
                courses = dept[0].courses
                sections = courses[0].sections
    
                for(let i = 0; i < sections.length; i++){
                    meetings = [...meetings, sections[i].meetings[0]]
                    console.log(meetings)
                }
    
            } else{
                data = await this.fetchAPI(`https://api.peterportal.org/rest/v0/schedule/soc?term=2022%20Fall&department=${courseName}&courseNumber=${courseNumber}&sectionCodes=${courseCode}`)

                if (!(data.schools.length)) {
                    alert("Invalid section Code!")
                }else{
                    schoolData = data.schools
                    dept = schoolData[0].departments
                    courses = dept[0].courses
                    sections = courses[0].sections
        
                    for(let i = 0; i < sections.length; i++){
                        meetings = [...meetings, sections[i].meetings[0]]
                    }
    
                }
            }

            if (!(data.schools.length)) {
                alert("Invalid Department or Course Number! Please try again!")
                return

            } else {
                this.setState({ courses: [...this.state.courses, { courseCode, courseName, courseNumber }] })
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

    render() {

        return (
            <div className="App">
                <div>{this.showsLabelLOL()}</div>
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
                        <label>Course Code
                            <input ref={this.codeRef} type="number"></input>
                        </label>
                    </div>
                    <input type='submit' value='AddCourse' />
                </form>
            </div>
        )
    }
}
