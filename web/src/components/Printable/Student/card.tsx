import React from "react"
import './style.css'
type PropsTypes = {
    student: MISStudent
    schoolName: string
    schoolLogo?: string
    studentClass?: string
} 

const StudentIDCard = (props: PropsTypes) => {
    return(<div className="student-card">  
        <div className="card-row card-school-info">
            <img className="card-school-logo" src={props.schoolLogo} alt="School Logo"/>
            <div className="card-school-title">{props.schoolName}</div>
        </div>
        <div className="card-row" style={{padding: "2px 5px"}}>
            <div>
                <img className="card-student-profile" src="https://via.placeholder.com/100"/>
            </div>
            <div className="card-student-info">
                <div>Name: <span>{ props.student.Name }</span></div>
                <div>class: <span>{ props.studentClass }</span></div>
                <div>Roll No:<span>{ props.student.RollNumber }</span></div>
            </div>
        </div>
        <div className="card-row" style={{marginTop: 10, padding: "0px 5px"}}>
            <div className="card-column">
                <div className="card-signature">Issuing Authority</div>
            </div>
            <div className="card-column">
                <div className="card-valid-date">Valid 2019-2020</div>
            </div>
        </div>
    </div>);
}

export default StudentIDCard