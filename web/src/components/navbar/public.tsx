import React from 'react'
import { Menu } from '@headlessui/react'
import { Link } from 'react-router-dom'

export const NavbarPublic = () => {

	return (
		<div className="antialiased bg-gray-100 shadow-md sticky top-0 z-50">
			<div className="w-full text-gray-700 bg-white">
				<Menu>
					{({ open: openMenu }) => (
						<div className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
							<div className="flex flex-row items-center justify-between p-4">

								<Link to="/">
									<img className="image h-10 w-10" src="/favicon.ico" alt="brand-logo" />
								</Link>
								<Menu.Button className="md:hidden focus:outline-none focus:shadow-outline text-red-brand rounded-full shadow-sm p-2 border border-gray-200">
									<svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
										{
											openMenu ?
												<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
												:
												<path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
										}
									</svg>
								</Menu.Button>

							</div>
							<nav className={`${openMenu ? 'flex' : 'hidden'} flex-col flex-grow pb-4 md:pb-0 md:flex md:justify-end md:flex-row flex`}>
								<div className="relative">
									<Menu>
										{({ open }) => (
											<>
												<Menu.Button
													className={`${open ? 'bg-gray-200' : ''} hidden md:flex flex-row text-gray-900 bg-gray-100 items-center w-full px-4 py-2 mt-2 text-left bg-transparent rounded-lg  md:w-auto md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:outline-none focus:shadow-outline`}>
													<span>Why Us?</span>
													<svg fill="currentColor" viewBox="0 0 20 20" className={`${open ? 'rotate-180' : 'rotate-0'} inline w-4 h-4 mt-1 ml-1 transition-transform duration-200 transform md:-mt-1`}>
														<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
													</svg>
												</Menu.Button>
												<div className={`${open ? 'block' : 'hidden'} absolute right-0 md:-right-28 w-full md:w-96 mt-3`}>
													<div className="p-2 bg-teal-400 rounded-md shadow-lg relative">
														<div className="flex flex-row items-center justify-center text-xs divide-x-2 divide-gray-100 space-x-2">
															<a className="flex row items-start bg-transparent px-2 py-1 text-white focus:outline-none focus:shadow-outline" href="#problems">
																Problems</a>

															<a className="flex row items-start bg-transparent px-2 py-1 text-white focus:outline-none focus:shadow-outline" href="#testimonials">
																Testimonials </a>

															<a className="flex row items-start bg-transparent px-2 py-1 text-white focus:outline-none focus:shadow-outline" href="#customers">
																Our Customer</a>
														</div>
														<div className="absolute md:-top-2.5 md:right-40 arrow-up"></div>
													</div>
												</div>
											</>
										)}
									</Menu>
								</div >
								<Link className="px-4 py-2 mt-2 bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:shadow-outline" to="/features">Features</Link>
								<Link className="px-4 py-2 mt-2 bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:shadow-outline" to="/pricing">Pricing</Link>
								<Link className="px-4 py-2 mt-2 bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:shadow-outline" to="/about-us">About Us</Link>
								<Link className="px-4 py-2 mt-2 bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:shadow-outline" to="/contact-us">Contact Us</Link>
								<Link to="/school-login" className="px-4 py-2 mt-2 bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:shadow-outline">
									Login
						</Link>
							</nav >
						</div >
					)}</Menu>
			</div >
		</div >
	)
}