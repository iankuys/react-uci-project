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
import { Button, Box, Tabs, Tab, TextField, Grid } from '@mui/material';
import { TabPanel } from '@mui/lab'
import Split from 'react-split';


export default class App extends Component<{}, { courses: UserInputCourse[], classes: Class[], searchResults: Class[] }> {

    codeRef: React.RefObject<HTMLInputElement>
    nameRef: React.RefObject<HTMLInputElement>
    numberRef: React.RefObject<HTMLInputElement>
    nv: HTMLDivElement | null | undefined;

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
        this.handleSearchCourse = this.handleSearchCourse.bind(this)
        this.showsLabelLOL = this.showsLabelLOL.bind(this)
        this.showsSearchLabel = this.showsSearchLabel.bind(this)
    }

    async handleAddCourse(event: any) {

        event.preventDefault()
        let data: SocResponse
        let meetings: MeetingResponse[] = []
        let classObject: Class

        if ((null !== this.codeRef.current)) {
            let courseCode = Number(this.codeRef.current.value)

            data = await this.fetchAPI(`https://api.peterportal.org/rest/v0/schedule/soc?term=2022%20Fall&sectionCodes=${courseCode}`)

            if (!(data.schools.length)) {
                alert("Invalid section Code!")
            } else {

                let tempArray: Class[] = []

                for (let i = 0; i < data.schools[0].departments[0].courses[0].sections.length; i++) {
                    meetings = [...meetings, data.schools[0].departments[0].courses[0].sections[i].meetings[0]]
                    classObject = new Class(data.schools[0].departments[0].courses[0].sections[i].sectionCode, meetings[i].days, data.schools[0].departments[0].courses[0].courseTitle, meetings[i].time)
                    tempArray = [...tempArray, classObject]
                    this.setState({ classes: [...this.state.classes, tempArray[i]] })
                }
            }
            this.codeRef.current.value = ""

            return (1)
        }
        return null
    }

    async handleSearchCourse(event: any) {

        event.preventDefault()
        let data: SocResponse
        let meetings: MeetingResponse[] = []
        let classObject: Class

        this.setState({ searchResults: [] })

        if ((null !== this.nameRef.current) && (null !== this.numberRef.current)) {
            let courseName = this.nameRef.current.value
            let courseNumber = Number(this.numberRef.current.value)

            data = await this.fetchAPI(`https://api.peterportal.org/rest/v0/schedule/soc?term=2022%20Fall&department=${courseName}&courseNumber=${courseNumber}`)

            if (!(data.schools.length)) {
                alert("Invalid Department or Course Number! Please try again!")
                return
            }

            let tempArray: Class[] = []

            for (let i = 0; i < data.schools[0].departments[0].courses[0].sections.length; i++) {
                meetings = [...meetings, data.schools[0].departments[0].courses[0].sections[i].meetings[0]]
                classObject = new Class(data.schools[0].departments[0].courses[0].sections[i].sectionCode, meetings[i].days, data.schools[0].departments[0].courses[0].courseTitle, meetings[i].time)
                tempArray = [...tempArray, classObject]
                this.setState({ searchResults: [...this.state.classes, ...tempArray] })
            }
            console.log(tempArray)

            return 1
        }
        return null
    }

    componentDidMount() {
        console.log(this.nv!)
        this.resizing()
    }

    componentWillUnmount() {
    }

    resizing() {
        // Query the element
        console.log("HI from resizing")
        const resizer = document.getElementById('dragMe') as HTMLElement;
        const leftSide = resizer!.previousElementSibling as HTMLElement;
        const rightSide = resizer!.nextElementSibling as HTMLElement;

        // The current position of mouse
        let x = 0;
        let y = 0;
        let leftWidth = 0;

        // Handle the mousedown event
        // that's triggered when user drags the resizer
        const mouseDownHandler = function (e: any) {
            // Get the current mouse position
            x = e.clientX;
            y = e.clientY;
            leftWidth = leftSide!.getBoundingClientRect().width;

            // Attach the listeners to `document`
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        };

        const mouseMoveHandler = function (e: any) {
            // How far the mouse has been moved
            const dx = e.clientX - x;
            const dy = e.clientY - y;

            const newLeftWidth = ((leftWidth + dx) * 100) / resizer!.parentElement!.getBoundingClientRect().width;
            leftSide.style.width = `${newLeftWidth}%`;

            resizer.style.cursor = 'col-resize';
            document.body.style.cursor = 'col-resize';

            leftSide.style.userSelect = 'none';
            leftSide.style.pointerEvents = 'none';

            rightSide.style.userSelect = 'none';
            rightSide.style.pointerEvents = 'none';
        };

        const mouseUpHandler = function () {
            resizer.style.removeProperty('cursor');
            document.body.style.removeProperty('cursor');

            leftSide.style.removeProperty('user-select');
            leftSide.style.removeProperty('pointer-events');

            rightSide.style.removeProperty('user-select');
            rightSide.style.removeProperty('pointer-events');

            // Remove the handlers of `mousemove` and `mouseup`
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

        // Attach the handler
        resizer.addEventListener('mousedown', mouseDownHandler);

    }

    async fetchAPI(url: string) {
        const response = await fetch(url)
        const data = await response.json()
        return data
    }

    showsLabelLOL() {
        if (this.state.classes.length == 0) {
            return (<div></div>)
        } else {
            return (<div>You Added:</div>)
        }
    }

    showsSearchLabel() {
        if (this.state.searchResults.length == 0) {
            return (<></>)
        } else {
            return (<>
                <tr>
                    <th>Section Code</th>
                    <th>Class Title</th>
                    <th>Days</th>
                    <th>Time</th>
                </tr>
            </>)
        }
    }

    render() {

        return (
            <>
                <div className="container">
                    <div className="container__left">
                        <this.showsLabelLOL />
                        <ClassList classes={this.state.classes} />
                        <form onSubmit={(this.handleSearchCourse)}>
                            <div>
                                <label>
                                    Enter Department Name:
                                </label>
                                <TextField id="outlined-basic" label="Required" variant="outlined" inputRef={this.nameRef} />
                            </div>
                            <div>
                                <label>
                                    Enter Course Number:
                                </label>
                                <TextField id="outlined-basic" label="Required" variant="outlined" inputRef={this.numberRef} />
                            </div>
                            <Button type='submit' variant="contained">Search Course</Button>
                        </form>

                        <form onSubmit={(this.handleAddCourse)}>
                            <div>
                                <div>To add a course:</div>
                                <label>
                                    Course Code:
                                </label>
                                <TextField id="outlined-basic" label="Required" variant="outlined" inputRef={this.codeRef} />
                            </div>
                            <Button type='submit' variant="contained">Add Course</Button>
                        </form>
                        <div className="search-table"><table><this.showsSearchLabel /><ClassList classes={this.state.searchResults} /></table></div>
                    </div>
                    <div ref={elem => this.nv = elem} aria-nv-el className='resizer' id='dragMe'></div>
                    <div className="container__right"></div>
                </div>
            </>
        )
    }
}



function ClassPrint({ sectionCode, classTitle, days, time }: { sectionCode: any, classTitle: any, days: any, time: any }) {

    return (<><tr>
        <td>{sectionCode}</td>
        <td>{classTitle}</td>
        <td>{days.map((days: string) => <a>{days}</a>)}</td>
        <td>{`${time[0].format("hh:mm")}-${time[1].format("hh:mm")}`}</td>
    </tr>
    </>)
}

function ClassList({ classes }: { classes: any }) {

    // return <div>{courses.length}</div>
    return (
        classes.map((classes: Class) => {
            return (
                <><ClassPrint key={classes.courseCode} sectionCode={classes.courseCode} classTitle={classes.name} days={classes.days} time={classes.timeStartnEnd} /></>
            )
        }
        ))

}