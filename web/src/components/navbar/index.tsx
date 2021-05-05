import React from 'react'
import clsx from 'clsx'
import { Menu, Transition } from '@headlessui/react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeftIcon } from '@heroicons/react/outline'

import { createLogout } from 'actions'

interface AppHeaderProps {
	title?: string
}

export const AppHeader = ({ title }: AppHeaderProps) => {
	const dispatch = useDispatch()
	const location = useLocation()
	const history = useHistory()

	const { auth } = useSelector((state: RootReducerState) => state)

	const isUserLogged = auth?.token && auth?.faculty_id

	const handleLogout = () => {
		dispatch(createLogout())
	}

	return (
		<div
			className={clsx('antialiased sticky top-0 z-50 print:hidden', {
				'': !isUserLogged,
				'bg-teal-brand': isUserLogged
			})}>
			<div
				className={clsx('w-full text-gray-700', {
					'border-b bg-white': !isUserLogged,
					'bg-teal-brand': isUserLogged
				})}>
				<Menu>
					{({ open: openMenu }: { open: boolean }) => (
						<div className="flex flex-col mx-auto max-w-screen-3xl md:items-center md:justify-between md:flex-row md:px-6 lg:px-16">
							<div
								className={clsx('flex flex-row items-center justify-between p-3', {
									'w-full': isUserLogged
								})}>
								{isUserLogged &&
									location.pathname !== '/home' &&
									location.pathname !== '/' ? (
									<div
										className="p-2 bg-white border border-gray-200 rounded-full shadow-sm cursor-pointer focus:shadow-outline text-red-brand"
										onClick={() => history.goBack()}>
										<ArrowLeftIcon className="w-6" />
									</div>
								) : (
									<Link to={isUserLogged ? '/home' : '/'}>
										<img
											className="w-10 h-10 image"
											src="/favicon.ico"
											alt="brand-logo"
										/>
									</Link>
								)}

								{title && (
									<div className="text-lg font-semibold text-white">{title}</div>
								)}

								<Menu.Button
									className={clsx(
										'focus:outline-none focus:shadow-outline text-red-brand rounded-full shadow-md p-2 border border-gray-200 bg-white',
										{
											'md:hidden': !isUserLogged
										}
									)}>
									<svg
										fill="currentColor"
										viewBox="0 0 20 20"
										className="w-6 h-6">
										{openMenu ? (
											<path
												fillRule="evenodd"
												d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
												clipRule="evenodd"></path>
										) : (
											<path
												fillRule="evenodd"
												d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
												clipRule="evenodd"
											/>
										)}
									</svg>
								</Menu.Button>
							</div>
							{isUserLogged ? (
								<div className="relative inline-block text-left">
									<Transition
										show={openMenu}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95">
										<Menu.Items
											static
											className="absolute z-50 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none right-2 w-44 -top-2 md:top-6">
											<div className="py-1">
												<Menu.Item>
													<Link
														to={`/staff/${auth?.faculty_id}/profile`}
														className={
															'text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left'
														}>
														View Profile
													</Link>
												</Menu.Item>
											</div>
											<div className="py-1">
												<Menu.Item>
													<button
														onClick={handleLogout}
														className="flex justify-between w-full px-4 py-2 text-sm leading-5 text-left text-gray-700">
														Logout
													</button>
												</Menu.Item>
											</div>
										</Menu.Items>
									</Transition>
								</div>
							) : (
								<Menu.Items
									as={'div'}
									static
									className={clsx(
										'flex-col flex-grow pb-4 md:pb-0 md:flex md:justify-end md:flex-row flex',
										openMenu ? 'flex' : 'hidden'
									)}>
									<div className="relative">
										<Menu>
											{({ open }: { open: boolean }) => (
												<>
													<Menu.Button
														className={clsx(
															'hidden md:flex flex-row text-gray-900 bg-gray-100 items-center w-full px-4 py-2 mt-2 text-left bg-transparent rounded-lg  md:w-auto md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:outline-none focus:shadow-outline',
															{
																'bg-gray-200': open
															}
														)}>
														<span>Why Us?</span>
														<svg
															fill="currentColor"
															viewBox="0 0 20 20"
															className={clsx(
																'inline w-4 h-4 mt-1 ml-1 transition-transform duration-200 transform md:-mt-1',
																open ? 'rotate-180' : 'rotate-0'
															)}>
															<path
																fillRule="evenodd"
																d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
																clipRule="evenodd"
															/>
														</svg>
													</Menu.Button>
													<div
														className={clsx(
															'absolute right-0 md:-right-28 w-full md:w-96 mt-3',
															open ? 'block' : 'hidden'
														)}>
														<div className="relative p-2 bg-teal-400 rounded-md shadow-lg">
															<div className="flex flex-row items-center justify-center space-x-2 text-xs divide-x-2 divide-gray-100">
																<a
																	className="flex items-start px-2 py-1 text-white bg-transparent row focus:outline-none focus:shadow-outline"
																	href="#problems">
																	Problems
																</a>

																<a
																	className="flex items-start px-2 py-1 text-white bg-transparent row focus:outline-none focus:shadow-outline"
																	href="#testimonials">
																	Testimonials
																</a>

																<a
																	className="flex items-start px-2 py-1 text-white bg-transparent row focus:outline-none focus:shadow-outline"
																	href="#customers">
																	Our Customer
																</a>
															</div>
															<div className="absolute md:-top-2.5 md:right-40 arrow-up"></div>
														</div>
													</div>
												</>
											)}
										</Menu>
									</div>
									<Link
										className="px-4 py-2 mt-2 bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:shadow-outline"
										to="/pricing">
										Pricing
									</Link>
									<Link
										className="px-4 py-2 mt-2 bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:shadow-outline"
										to="/about-us">
										About Us
									</Link>
									<Link
										className="px-4 py-2 mt-2 bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:shadow-outline"
										to="/contact-us">
										Contact Us
									</Link>
									<Link
										to="/school-login"
										className="px-4 py-2 mt-2 bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:shadow-outline">
										Login
									</Link>
								</Menu.Items>
							)}
						</div>
					)}
				</Menu>
			</div>
		</div>
	)
}
