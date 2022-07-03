import React from 'react'
import Course from './Course'

export default function CourseList({courses}:{courses:any}) {


    // return <div>{courses.length}</div>
    return(courses.map((courses:any) => {
        return <Course key={courses.id} course ={courses.code}/>
}
))

}
