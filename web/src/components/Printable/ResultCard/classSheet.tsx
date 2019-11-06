import React from "react"
import "./../print.css"
import "./style.css"

interface studentMap {
    [id: string] : {
        name: string
        subjects: {
            [subject_name: string]: number
        }
        marks: {
            obtained: number
            total: number
        }
        grade: string
    }
}

type PropsTypes = {
    students: studentMap[]
    chunkSize: number
    schoolName: string
}

export const ClassResultSheet = (props: PropsTypes) => {

    return (
        <div className="print-only">
            <table>
                <caption>
                    <div>{ props.schoolName ? props.schoolName.toUpperCase() : "" }</div>
                    <div>Class Result Sheet</div>
                </caption>
                <thead>
                    <tr>
                        <th className="row-rollno">Roll No.</th>
                        <th className="row-name">Name</th>
                        <th className="row-marks">Obt./total</th>
                        <th className="row-grade">Grade</th>
                    </tr>
                </thead>
                <tbody>
                   {

                   }
                </tbody>
            </table>
        </div>
    )
}