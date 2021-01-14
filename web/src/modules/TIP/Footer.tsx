import React from 'react';

interface P {
    setSub: (sub: string) => void
}

const Footer: React.FC<P> = ({ setSub }) => {

    return <div className="flex flex-wrap bg-blue-900 h-16 flex-row justify-around w-full bottom-0 fixed items-center">
        <button className="bg-white h-10 border-none rounded-lg px-2 text-xl text-blue-900 outline-none" onClick={() => setSub("English")}>English</button>
        <button className="bg-white h-10 border-none rounded-lg px-5 text-xl text-blue-900 outline-none" onClick={() => setSub("Urdu")}>Urdu</button>
        <button className="bg-white h-10 border-none rounded-lg px-3 text-xl text-blue-900 outline-none" onClick={() => setSub("Maths")}>Maths</button>
    </div >
}

export default Footer