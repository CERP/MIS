import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export const NavbarPublic = () => {

	const [openDropdown, setOpenDropdown] = useState(false)
	const [openMenu, setOpenMenu] = useState(false)

	return (
		<div className="antialiased bg-gray-100 shadow-md sticky top-0 z-50">
			<div className="w-full text-gray-700 bg-white">
				<div className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
					<div className="flex flex-row items-center justify-between p-4">

						<Link to="/">
							<img className="image h-10 w-10" src="favicon.ico" alt="brand-logo" />
						</Link>

						<button className="rounded-lg md:hidden focus:outline-none focus:shadow-outline" onClick={() => setOpenMenu(!openMenu)} >
							<svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
								{
									openMenu ?
										<path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clipRule="evenodd"></path>
										:
										<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
								}
							</svg>
						</button>
					</div>
					<nav className={` ${openMenu ? 'flex' : 'hidden'} flex-col flex-grow hidden pb-4 md:pb-0 md:flex md:justify-end md:flex-row`}>
						<div className="relative">
							<button onClick={() => setOpenDropdown(!openDropdown)} className="flex flex-row text-gray-900 bg-gray-200 items-center w-full px-4 py-2 mt-2 text-sm font-semibold text-left bg-transparent rounded-lg  md:w-auto md:inline md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
								<span>Why Us?</span>
								<svg fill="currentColor" viewBox="0 0 20 20" className={`${openDropdown ? 'rotate-180' : 'rotate-0'} inline w-4 h-4 mt-1 ml-1 transition-transform duration-200 transform md:-mt-1`}>
									<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
								</svg>
							</button>
							<div className={`${openDropdown ? 'block' : 'hidden'} absolute right-0 md:-right-28 w-full md:w-96 mt-2 border-t`}>
								<div className="p-2 bg-white rounded-md shadow-lg">
									<div className="flex flex-row items-center justify-between text-sm">
										<a className="flex row items-start rounded-lg bg-transparent px-2 py-1 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="#">
											Problems
										</a>

										<a className="flex row items-start rounded-lg bg-transparent px-2 py-1 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="#">
											Testimonials
										</a>

										<a className="flex row items-start rounded-lg bg-transparent px-2 py-1 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="#">
											Our Customer
										</a>
									</div>
								</div>
							</div>
						</div >
						<a className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="#">Features</a>
						<a className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="#">Pricing</a>
						<a className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="#">About Us</a>
						<a className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="#">Contact Us</a>
						<Link to="/school-login" className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
							Login
						</Link>
					</nav >
				</div >
			</div >
		</div >
	)
}