import React from 'react';

interface P {
}

const Footer: React.FC<P> = () => {

    return <div className="flex flex-wrap bg-blue-900 h-16 flex-row justify-around w-full bottom-0 fixed items-center">
        <button className="bg-white h-10 border-none rounded-lg px-2 text-xl text-blue-900 outline-none">English</button>
        <button className="bg-white h-10 border-none rounded-lg px-5 text-xl text-blue-900 outline-none">Urdu</button>
        <button className="bg-white h-10 border-none rounded-lg px-3 text-xl text-blue-900 outline-none">Maths</button>
    </div >
}

export default Footer