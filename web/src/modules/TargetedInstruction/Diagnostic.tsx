import React from 'react';
import PDFViewer from 'pdf-viewer-reactjs'
import './style.css'

interface P {
    label: string
    url: string
}

const Diagnostic: React.FC<P> = ({ label, url }) => {

    return <>
        <div>
            {label ? <div className="pdf-label no-print"><label className="">{label}</label></div> : null}
            {url ? <PDFViewer
                hideNavbar={true}
                document={{
                    url: url,
                }}
            /> : null}

        </div>
    </>;
}

export default Diagnostic