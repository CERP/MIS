import React from 'react';
import PDFViewer from 'pdf-viewer-reactjs'
import './style.css'

interface P {
    label: string
    url: string
}

const Diagnostic: React.FC<P> = (props: any) => {

    return <>
        <div>
            {props.label ? <div className="pdfLabel no-print"><label className="">{props.label}</label></div> : null}
            {props.url ? <PDFViewer
                hideNavbar={true}
                document={{
                    url: props.url,
                }}
            /> : null}

        </div>
    </>;
}

export default Diagnostic