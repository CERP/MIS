import React from 'react';
import { connect } from 'react-redux'
import Switch from "react-switch";
import './style.css'

interface P {
    questions: any
}

const handleChange = (checked: any) => {
    debugger

}

const StudentGrades: React.FC<P> = (props: any) => {

    return <div className="questions-container">
        {props.questions && props.questions.map((question: any) => {
            return <div key={question.key} className="form">
                <div className="row">
                    <div>{(question.key)}</div>
                    <Switch
                        onChange={handleChange}
                        checked={question.value}
                        id="normal-switch"
                    />
                </div>
            </div>
        })}
    </div>
}

export default connect((state: RootReducerState) => ({

}))(StudentGrades)