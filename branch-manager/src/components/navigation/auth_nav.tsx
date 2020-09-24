import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const AuthNavigation = () => {

	const [menu, setMenu] = useState(false)

	return (
		<nav className="flex items-center justify-between flex-wrap bg-white py-4 md:px-12 shadow border-b border-red-500">
			<div className="flex justify-between md:w-auto w-full md:border-b-0 pl-6 pr-2 border-solid border-b-2 border-gray-300 pb-5 md:pb-0">
				<div className="flex items-center flex-shrink-0 text-red-500 mr-16">
					<Link to="/home" className="font-semibold text-lg tracking-tight">MIS Branch Manager</Link>
				</div>
				<div className="block md:hidden ">
					<button className="flex items-center px-3 py-2" onClick={() => setMenu(!menu)}>
						<svg className="fill-current text-red-500" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
							<title>menu</title>
							<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
						</svg>
					</button>
				</div>
			</div>

			<div className={`${menu ? '' : 'hidden'} w-full flex-grow md:flex md:items-center md:w-auto md:px-3 px-8`}>
				<div className="text-md font-bold text-red-500 md:flex-grow">
					<Link to="/analytics" className=" block mt-4 md:inline-block md:mt-0 px-4 py-2 rounded mr-2"> Analytics </Link>
				</div>
				<div className="flex ">
					<Link to="/login" className=" block text-md px-3  ml-2 py-1 text-red-500 font-bold mt-4 md:mt-0 md:rounded md:border md:border-red-500 md:hover:bg-red-400 md:hover:text-white">Logout</Link>
				</div>
			</div>

		</nav>
	)
}

export { AuthNavigation }