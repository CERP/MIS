import React from 'react';
import PDFViewer from 'pdf-viewer-reactjs'
import './style.css'

interface P {
    label: string
    url: string
}

const Diagnostic: React.FC<P> = ({ label, url }) => {
    return <div>
        {label && <div className="pdf-label text-center no-print bold"><label>{label}</label></div>}
        {url && <PDFViewer
            hideNavbar={true}
            document={{
                url: decodeURIComponent(url),
            }}
            //@ts-ignore
            showThumbnail={{ scale: 2 }}
        />}
    </div>
}

export default Diagnostic;