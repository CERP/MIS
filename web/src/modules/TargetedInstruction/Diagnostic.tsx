import React, { useState } from 'react'; import { connect } from 'react-redux'
import PDFViewer from 'pdf-viewer-reactjs'
import './style.css'

interface P {
    classes: RootDBState["classes"]
    targeted_instruction: RootDBState["targeted_instruction"]
}

const Diagnostic: React.FC<P> = (props: any) => {
    const [selectedClass, setSelectedClass] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')
    const [type, setType] = useState('test')
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
        getPDF(selectedSubject, e.target.value)
    }

    const getSelectedSubject = (e: any) => {
        setSelectedSubject(e.target.value)
        getPDF(e.target.value, selectedClass)
    }

    const getPDF = (selectedSubject: any, selectedClass: any) => {
        for (let [id, obj] of Object.entries(props.targeted_instruction['tests'])) {
            //@ts-ignore
            if (obj.type === 'Diagnostic' && obj.class === selectedClass && obj.subject === selectedSubject) {
                //@ts-ignore
                setUrl(obj.pdf_url)
                //@ts-ignore
                setLabel(obj.label)
                break;
            } else {
                setUrl('')
                setLabel('')
            }
        }
    }


    return <>
        <div className="section form">
            <div className="row">
                <label className="no-print">Test Type</label>
                <select className="no-print" onClick={getSelectedClass}>
                    <option value="">Select Test Type</option>
                    <option value="Diagnostic">Diagnostic</option>
                    <option value="Monthly">Monthly</option>
                </select>
            </div>
            <div className="row">
                <label className="no-print">Class/Section</label>
                <select className="no-print" onClick={getSelectedClass}>
                    <option value="">Select Class</option>
                    {
                        classes.map((c) => <option key={c} value={c}>{c}</option>)
                    }
                </select>
            </div>
            <div className="row">
                <label className="no-print">Test Subject</label>
                <select className="no-print" onClick={getSelectedSubject}>
                    <option value="">Select Subject</option>
                    {
                        subjects.map((sub) => <option key={sub} value={sub}>{sub}</option>)
                    }
                </select>
            </div>
            {label ? <div className="pdfLabel no-print"><label className="">{label}</label></div> : null}
            {url ? <PDFViewer
                hideNavbar={true}
                document={{
                    url: url,
                }}
            /> : null}

        </div>
    </>;
}

export default connect((state: RootReducerState) => ({
    targeted_instruction: state.db.targeted_instruction
}))(Diagnostic)