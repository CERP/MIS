import React, { useState } from 'react';
import { targeted_instruction } from './dummyData'
import { connect } from 'react-redux'
import PDFViewer from 'pdf-viewer-reactjs'


interface P {

    classes: RootDBState["classes"]
}

const Diagnostic: React.SFC<P> = (props: any) => {
    const [selectedClass, setSelectedClass] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')
    const [url, setUrl] = useState('')

    const classes = [
        "class 1", "class 2", "class 3", "class 4", "class 5", "class 6", "class 7", "class 8", "class 9", "class 10"
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
            debugger
            if (obj.class === selectedClass && obj.subject === e.target.value) {
                debugger
                setUrl(obj.pdf_url)
            } else {
                setUrl('')
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
            {
                url ? <PDFViewer
                    document={{
                        url: url,
                    }}
                /> : null
            }

        </div>
    </>;
}

export default connect((state: RootReducerState) => ({
    classes: state.db.classes
}))(Diagnostic)