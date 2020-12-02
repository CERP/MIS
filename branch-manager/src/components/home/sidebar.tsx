import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from 'actions/user'


export const Sidebar = () => {

	const dispatch = useDispatch()

	const [open, setOpen] = useState(false)

	const handleLogout = useCallback(() => {

		if (window.confirm('Are you sure you want to logout?')) {
			dispatch(logout())
		}
	}, [dispatch])

	return (
		<div className="md:flex flex-col md:flex-row md:min-h-screen md:fixed" style={{ backgroundColor: 'var(--primary)' }}>
			<div className="flex flex-col w-full md:w-64 text-gray-700 flex-shrink-0">
				<div className={`flex-shrink-0 md:shadow-none px-8 py-2 flex flex-row md:flex-col md:mx-auto items-center justify-between ${open ? 'shadow-xl' : ''}`}>
					<Link to="/home" className="inline-block py-1 md:py-4 text-gray-500 hover:text-gray-100" >
						<img className="w-12 h-12 md:w-14 md:h-14 block rounded-xl border-2 border-white shadow-2xl" src="/favicon.ico" alt="logo" />
					</Link>
					<button onClick={() => setOpen(!open)} className="rounded-lg text-white md:hidden focus:outline-none focus:shadow-outline" >
						<svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
							{!open && <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clipRule="evenodd"></path>}
							{open && <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>}
						</svg>
					</button>
					<div className="hidden md:block text-center font-bold text-lg text-white">MIS Branch Manager</div>
				</div>
				<hr className="hidden md:block my-2" />
				<nav className={` text-white flex-grow md:block px-4 pb-4 md:pb-0 md:overflow-y-auto ease-in ${open ? 'block' : 'hidden'}`}>
					<Link to="/home"
						className={"flex items-center cursor-pointer outline-none mt-2 py-1 px-4 hover:text-gray-800"}>
						<svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
						</svg>
						<span className="mx-4 font-medium">Home</span>
					</Link>
					<Link to="/attendance-analytics"
						className={"flex items-center cursor-pointer outline-none mt-2 py-1 px-4 hover:text-gray-800"}>
						<svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
						</svg>
						<span className="mx-4 font-medium">Attendance</span>
					</Link>

					<Link to="/fee-analytics"
						className={"flex items-center cursor-pointer outline-none mt-2 py-1 px-4 hover:text-gray-800"}>
						<svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
						</svg>
						<span className="mx-4 font-medium">Fee</span>
					</Link>

					<Link to="/expense-analytics"
						className={"flex items-center cursor-pointer outline-none mt-2 py-1 px-4 hover:text-gray-800"}>
						<svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
						</svg>
						<span className="mx-4 font-medium">Expense</span>
					</Link>

					<Link to="/exam-analytics"
						className={"flex items-center cursor-pointer outline-none mt-2 py-1 px-4 hover:text-gray-800"}>
						<svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
						</svg>
						<span className="mx-4 font-medium">Exam</span>
					</Link>

					<Link to="/enrollment-stats"
						className={"flex items-center cursor-pointer outline-none mt-2 py-1 px-4 hover:text-gray-800"}>
						<svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
						</svg>
						<span className="mx-4 font-medium">Enrollment</span>
					</Link>

					<div className="md:absolute md:bottom-0 md:my-10">
						<button onClick={handleLogout} className="flex items-center cursor-pointer outline-none mt-2 py-1 px-4 hover:text-gray-800">
							<svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
							</svg>
							<span className="mx-4 font-medium">Logout</span>
						</button>
					</div>
				</nav>
			</div>
		</div>
	)
}