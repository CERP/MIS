import React from 'react'
import { Link } from 'react-router-dom'

export const Landing = () => {
	return (
		<div className="w-full h-screen" style={{ backgroundColor: 'var(--primary)' }}>
			<div className="p-5 md:px-10 flex flex-row justify-between items-center">
				<div className="text-white font-bold text-xl">MISchool.pk</div>
				<Link to="/login" className="py-2 px-4 rounded-xl font-bold text-red-500 bg-white hover:text-white hover:shadow-4xl hover:bg-transparent shadow">Login</Link>
			</div>
			<div className="w-40 mx-auto mb-10">
				<Link to="/">
					<img src="/favicon.ico" alt="logo" className="shadow-xl rounded-3xl border-2 border-white" />
				</Link>
			</div>
			<div className="text-center text-white font-bold text-3xl">MIS Branch Manager</div>
		</div>
	)
}