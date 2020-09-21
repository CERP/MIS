import React, { useState } from 'react';
import { targeted_instruction } from './dummyData'
import { connect } from 'react-redux'
import PDFViewer from 'pdf-viewer-reactjs'
import './style.css'

interface P {

    classes: RootDBState["classes"]
}

const Diagnostic: React.SFC<P> = (props: any) => {
    const [selectedClass, setSelectedClass] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')
    const [url, setUrl] = useState('')
    const [label, setLabel] = useState('')

    const classes = [
        "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"
    ]
    const subjects = [
        "Mathematics", "English", "Urdu", "Pak Study", "Science", "Islamiat"
    ]

    const getSelectedClass = (e: any) => {
        setSelectedClass(e.target.value)
    }

    const getSelectedSubject = (e: any) => {
        setSelectedSubject(e.target.value)
        for (let [id, obj] of Object.entries(targeted_instruction['tests'])) {
            if (obj.class === selectedClass && obj.subject === e.target.value) {
                setUrl(obj.pdf_url)
                setLabel(obj.label)
                break;
            } else {
                setUrl('')
                setLabel('')
            }
        }
    }


    return <>
        <div className="section section-container">
            <div className="row" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <select className="no-print" style={{ width: "49%" }} onClick={getSelectedClass}>
                    <option value="">Select Class</option>
                    {
                        classes.map((c) => <option key={c} value={c}>{c}</option>)
                    }
                </select>
                <select className="no-print" style={{ width: "49%" }} onClick={getSelectedSubject}>
                    <option value="">Select Subject</option>
                    {
                        subjects.map((sub) => <option key={sub} value={sub}>{sub}</option>)
                    }
                </select>
            </div>
            {label ? <div className="pdfLabel no-print"><label className="">{label}</label></div> : null}
            {url ? <PDFViewer
                document={{
                    url: url,
                }}
            /> : null}

        </div>
    </>;
}

export default connect((state: RootReducerState) => ({
}))(Diagnostic)