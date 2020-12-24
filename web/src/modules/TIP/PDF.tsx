import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom'
import PDFViewer from 'pdf-viewer-reactjs'

interface P {
}

type PropsType = P & RouteComponentProps

const PDF: React.FC<PropsType> = (props) => {

    return <div className="flex flex-wrap content-between">
        <div className="text-blue-900 text-bold flex justify-center w-full my-5">Grade 2 | Math | FormativeTest</div>
        <div className="rounded-lg border-black	">
            <PDFViewer
                hideNavbar={true}
                document={{
                    url: decodeURIComponent("https://storage.googleapis.com/targeted-instructions/TI%20V0%20Test_English.pdf"),
                }}
            />
        </div>
        <div className="flex flex-row justify-around m-3 w-full">
            <div className="w-5/12">
                <button className="bg-blue-800 text-bold text-lg border-none rounded-md text-white text-left p-2 w-full">Print</button>
            </div>
            <div className="w-6/12">
                <button className="bg-blue-400 text-bold text-lg border-none rounded-md text-white text-left p-2 w-full">Download</button>
            </div>
        </div>
        <div className="flex flex-row justify-around m-3 w-full mx-5">
            <div className="w-full">
                <button className="bg-yellow-400 text-bold text-lg border-none rounded-md text-white p-2 w-full" onClick={() => props.history.push(`${(props.location.pathname).substring(0, 37)}insert-grades`)}>Insert Grades</button>
            </div>
        </div>
    </div>
}

export default withRouter(PDF)
