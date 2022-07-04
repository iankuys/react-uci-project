import React from 'react'

export default function Course({course, dpt, num}:{course:any, dpt:any, num:any}) {
    return(
        <div>
            {course} {dpt} {num}
        </div>
    )
}
