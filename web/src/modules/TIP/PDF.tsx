import React, { useMemo } from 'react';
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import PDFViewer from 'pdf-viewer-reactjs'

interface P {
    targeted_instruction: RootReducerState["targeted_instruction"]
}

type PropsType = P & RouteComponentProps

const PDF: React.FC<PropsType> = ({ match, location, history, targeted_instruction }) => {

    const { class_name, subject, section_id } = match.params as Params
    const type = (location.pathname).substring(36, 22)

    const pdfUrl = useMemo(() => getPDF(subject, class_name, targeted_instruction), [subject]);

    return <div className="flex flex-wrap content-between w-full">
        <div className="text-blue-900 font-bold flex text-lg justify-center my-5 mx-3">{class_name} | {subject} | {type === 'formative-test' ? "Formative Test" : "Lesson Plans"}</div>
        <div className="rounded-lg border-black	">
            <PDFViewer
                scale={0.5}
                scaleStep={0.1}
                maxScale={1}
                minScale={0.1}
                hideNavbar={true}
                canvasCss='customCanvas'
                document={{
                    url: decodeURIComponent(pdfUrl),
                }}
            />
        </div>
        <div className="flex flex-row justify-around my-4 w-full">
            <div className="w-1/7">
                <button className="bg-blue-900 text-lg border-none rounded-md text-white text-left p-2 w-full">Print</button>
            </div>
            <div className="w-1/7">
                <button className="bg-green-primary text-lg border-none rounded-md text-white text-left p-2 w-full">Download</button>
            </div>
        </div>
        {type === 'formative-test' &&
            <div className="flex flex-row justify-around mb-4 w-full">
                <div className="w-1/7">
                    <button
                        className="bg-orange-primary font-bold text-lg border-none rounded-md text-white text-left p-2 w-full"
                        onClick={() => history.push(`${(location.pathname).substring(0, 36)}/${section_id}/${class_name}/${subject}/insert-grades`)}>
                        Insert Grades
                </button>
                </div>
                <div className="w-1/7">
                    <button className="bg-red-primary font-bold text-lg border-none rounded-md text-white text-left p-2 w-full">Answer Sheet</button>
                </div>
            </div>
        }
    </div>
}

export default connect((state: RootReducerState) => ({
    targeted_instruction: state.targeted_instruction
}))(withRouter(PDF))

const getPDF = (selectedSubject: string, selectedSection: string, targeted_instruction: RootReducerState["targeted_instruction"]) => {
    let url
    let misTest: Tests = targeted_instruction['tests']
    for (let obj of Object.values(misTest)) {
        if (obj.grade === selectedSection && obj.subject === selectedSubject) {
            url = obj.pdf_url
            break
        } else {
            url = ''
        }
    }
    return url
}