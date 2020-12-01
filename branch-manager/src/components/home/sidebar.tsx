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
				<div className="flex-shrink-0 px-8 py-2 flex flex-row md:mx-auto items-center justify-between">
					<Link to="/home" className="inline-block py-1 md:py-4 text-gray-500 hover:text-gray-100" >
						<img className="w-12 h-12 md:w-14 md:h-14 block rounded-xl border-2 border-white shadow-2xl" src="/favicon.ico" alt="logo" />
					</Link>
					<button onClick={() => setOpen(!open)} className="rounded-lg text-white md:hidden focus:outline-none focus:shadow-outline" >
						<svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
							{!open && <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clipRule="evenodd"></path>}
							{open && <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>}
						</svg>
					</button>
				</div>
				<div className="hidden md:block text-center font-bold text-lg text-white">MIS Branch Manager</div>
				<nav className={` text-white flex-grow md:block px-4 pb-4 md:pb-0 md:overflow-y-auto ease-in ${open ? 'block' : 'hidden'}`}>
					<Link to="/home" className="block border-white border-b-2 px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" >Home</Link>
					<Link to="/student-analytics" className="block border-white border-b-2 px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" >Order Requests</Link>
					<button onClick={handleLogout} className="md:hidden w-full block border-white border-b-2 px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">Logout</button>

					<div className="hidden md:block absolute bottom-0 my-10">
						<div className="flex items-center cursor-pointer outline-none py-2 px-8 text-white" onClick={handleLogout}>
							<svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
							</svg>
							<span className="mx-4 font-medium">Logout</span>
						</div>
					</div>

				</nav>
			</div>
		</div>
	)
}