import React from "react"
import "./../print.css"

type studentMarksMap = {
    id: string
    name: string
    roll: string
    marks: { obtained: number, total: number}
    grade: string
    exams: ExamsMap[]
}

type ExamsMap = MISExam & {
    obtained_marks: {
        score: number 
        remarks: string
        grade: string
    }
}

type PropsTypes = {
    students: studentMarksMap[]
    examSubjectsMarks: Set<string>
    chunkSize: number
    sectionName: string
    examName: string
    schoolName: string
}

export const ClassResultSheet = (props: PropsTypes) => {

    return (
        <div className="print-table print-only">
            <table>
                <caption>
                    <div>{ props.schoolName ? props.schoolName.toUpperCase() : "" }</div>
                    <div>Class: {props.sectionName} | Exam: { props.examName } - 2019</div>
                    <div></div>
                </caption>
                <thead>
                    <tr>
                        <th className="result-sheet">Name</th>
                        {
                            Array.from(props.examSubjectsMarks)
								.map((subject, index) => <th className="result-sheet" style={{width: `${70/props.examSubjectsMarks.size}%`}} key={index}> {subject} </th>)
                        }
                        <th className="result-sheet row-marks">Obt./total</th>
                        <th className="result-sheet row-grade">Grade</th>
                    </tr>
                </thead>
                <tbody>
                   {
                        // content would be rendered here
                   }
                </tbody>
            </table>
        </div>
    )
}