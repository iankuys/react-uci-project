export interface SocResponse{
    schools: SchoolResponse[]
}

export interface SchoolResponse{
    departments: DepartmentResponse[]
}

export interface DepartmentResponse{
    deptCode: string
    courses: CoursesResponse[]
}

export interface CoursesResponse{
    deptCode: string
    courseNumber: number
    courseTitle: string
    sections: SectionResponse[]
}

export interface SectionResponse{
    sectionCode: number
    sectionType: string
    units: number
    meetings: MeetingResponse[]
}

export interface MeetingResponse{
    days: string
    time: string
}

export interface UserInputCourse{
    courseCode: number
    courseName: string
    courseNumber: number
}