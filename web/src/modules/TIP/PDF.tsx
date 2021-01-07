import React, { useMemo } from 'react';
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Download, Printer } from 'assets/icons'
import { getPDF } from 'utils/TIP'
import PDFViewer from 'pdf-viewer-reactjs'

interface P {
    targeted_instruction: RootReducerState["targeted_instruction"]
}

type PropsType = P & RouteComponentProps

const PDF: React.FC<PropsType> = ({ match, location, history, targeted_instruction }) => {

    const { class_name, subject, section_id } = match.params as Params
    const type = (location.pathname).substring(36, 22)

    const [test_id, pdf_url] = useMemo(() => getPDF(subject, class_name, targeted_instruction), [subject]);

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
                    url: decodeURIComponent(pdf_url),
                }}
            />
        </div>
        <div className="flex flex-row justify-around my-4 w-full">
            <div className="w-1/7 bg-blue-900 rounded-md flex flex-row justify-between items-center h-11">
                <button className="bg-blue-900 text-lg border-none text-white text-left pl-3 focus:outline-none"
                    onClick={() => window.print()}>Print</button>
                <img className="pr-4" src={Printer} />
            </div>
            <div className="w-1/7 bg-green-primary rounded-md flex flex-row justify-between items-center h-11">
                <button className="bg-green-primary text-lg border-none text-white text-left pl-3 focus:outline-none">Download</button>
                <img className="pr-3" src={Download} />
            </div>
        </div>
        {type === 'formative-test' &&
            <div className="flex flex-row justify-around mb-4 w-full">
                <div className="w-1/7">
                    <button
                        className="bg-orange-primary font-bold text-lg border-none rounded-md text-white text-left p-2 w-full focus:outline-none"
                        onClick={() => history.push(`${(location.pathname).substring(0, 36)}/${section_id}/${class_name}/${subject}/${test_id}/insert-grades`)}>
                        Insert Grades
                </button>
                </div>
                <div className="w-1/7">
                    <button className="bg-red-primary font-bold text-lg border-none rounded-md text-white text-left p-2 w-full focus:outline-none">Answer Sheet</button>
                </div>
            </div>
        }
    </div>
}

export default connect((state: RootReducerState) => ({
    targeted_instruction: state.targeted_instruction
}))(withRouter(PDF))