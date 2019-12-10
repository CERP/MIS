import React from "react"

interface AugmentedMISStudent {
    name: string
    dob: string
    rollNo: string
    avatar?: string
}

type PropsTypes = {
    students: AugmentedMISStudent
    class: string
    schoolName: string
    schoolLogo: string
}

const StudentIDCard = (props: PropsTypes) => {
    return(<div className="student-card">  
        <div className="row school-info">
            <img className="school-logo" src="https://via.placeholder.com/64"/>
            <div className="school-title">Lahore Grammar School for Boys</div>
        </div>
        <div className="row" style={{padding: "0px 5px"}}>
            <div>
                <img className="student-profile" src="https://via.placeholder.com/100"/>
            </div>
            <div className="student-info">
                <div>Name: <span>Mudassar Ali</span></div>
                <div>className: <span>10th B</span></div>
                <div>Roll No:<span>1450</span></div>
            </div>
        </div>
        <div className="row" style={{marginTop: 10, padding: "0px 5px"}}>
            <div className="column">
                <div className="signature">Issuing Authority</div>
            </div>
            <div className="column">
                <div className="valid-date">Valid 2019-2020</div>
            </div>
        </div>
    </div>);
}

export default StudentIDCard