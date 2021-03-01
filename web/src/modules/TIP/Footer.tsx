import React from 'react';

interface P {
    type: string
    setSub: (sub: string) => void
}

const Footer: React.FC<P> = ({ type, setSub }) => {

    return <div className="flex flex-wrap bg-blue-900 h-16 flex-row justify-around w-full bottom-0 fixed items-center">
        <button className={`${type === "English" ? "bg-green-tip-brand text-white h-10" : "bg-white h-10 text-blue-900"} border-none rounded-lg px-2 text-xl outline-none`} onClick={() => setSub("English")}>English</button>
        <button className={`${type === "Urdu" ? "bg-green-tip-brand text-white h-10" : "bg-white h-10 text-blue-900"} border-none rounded-lg px-5 text-xl outline-none`} onClick={() => setSub("Urdu")}>Urdu</button>
        <button className={`${type === "Maths" ? "bg-green-tip-brand text-white h-10" : "bg-white h-10 text-blue-900"} border-none rounded-lg px-3 text-xl outline-none`} onClick={() => setSub("Maths")}>Maths</button>
    </div >
}

export default Footer