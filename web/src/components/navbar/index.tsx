import React from 'react'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import { Menu, Transition } from '@headlessui/react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import {
	ArrowLeftIcon,
	ExclamationIcon,
	LogoutIcon,
	QuestionMarkCircleIcon,
	UserCircleIcon
} from '@heroicons/react/outline'

import { createLogout } from 'actions'

interface AppHeaderProps {
	title?: string
	total?: number
}

export const AppHeader = ({ title, total = 0 }: AppHeaderProps) => {
	const dispatch = useDispatch()
	const location = useLocation()
	const history = useHistory()

	const authToken = useSelector((state: RootReducerState) => state.auth.token)
	const loggedUserId = useSelector((state: RootReducerState) => state.auth.faculty_id)
	const alertBanner = useSelector((state: RootReducerState) => state.alert_banner)

	const isUserLogged = authToken && loggedUserId

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
						<div className="flex flex-col mx-auto max-w-screen-3xl md:items-center md:justify-between md:flex-row px-2 md:px-6 lg:px-10">
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
											alt="mischool"
										/>
									</Link>
								)}

								<div className=" flex flex-col justify-center items-center">
									{title && (
										<div className="text-lg font-semibold text-white">
											{title}
											{total > 0 && <span>: {total}</span>}
										</div>
									)}
								</div>
								{alertBanner && !title && location.pathname === '/home' && (
									<Link
										to="/device-time"
										className="inline-flex items-center text-white font-semibold p-2 bg-red-brand rounded-full text-xs shadow-md">
										<ExclamationIcon className="w-5 mr-2 animate-pulse" />
										<span>{alertBanner}</span>
									</Link>
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
								<Transition
									as="div"
									show={openMenu}
									enter="transition ease-out duration-100"
									enterFrom="transform opacity-0 scale-95"
									enterTo="transform opacity-100 scale-100"
									leave="transition ease-in duration-75"
									leaveFrom="transform opacity-100 scale-100"
									leaveTo="transform opacity-0 scale-95"
									className="relative inline-block text-left">
									<Menu.Items
										static
										className="absolute z-50 origin-top-right text-gray-700 bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none right-2 w-44 -top-2 md:top-6">
										<div className="py-1">
											<Menu.Item>
												<Link
													to={`/staff/${loggedUserId}/profile`}
													className={
														'inline-flex items-center w-full px-4 py-2 text-sm leading-5 hover:bg-gray-200'
													}>
													<UserCircleIcon className="w-5" />
													<span className="ml-2">View Profile</span>
												</Link>
											</Menu.Item>
										</div>
										<div className="py-1">
											<Menu.Item>
												<Link
													to="/help"
													className={
														'inline-flex items-center w-full px-4 py-2 text-sm leading-5 hover:bg-gray-200'
													}>
													<QuestionMarkCircleIcon className="w-5" />
													<span className="ml-2">Help</span>
												</Link>
											</Menu.Item>
										</div>
										<div className="py-1">
											<Menu.Item>
												<button
													onClick={handleLogout}
													className={
														'inline-flex items-center w-full px-4 py-2 text-sm leading-5 hover:bg-gray-200'
													}>
													<LogoutIcon className="w-5" />
													<span className="ml-2">Logout</span>
												</button>
											</Menu.Item>
										</div>
									</Menu.Items>
								</Transition>
							) : (
								<Menu.Items
									as={'div'}
									static
									className={clsx(
										'flex-col flex-grow pb-4 md:pb-0 md:flex md:justify-end md:flex-row flex outline-none',
										openMenu ? 'flex' : 'hidden'
									)}>
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
										to={
											isUserLogged
												? '/home'
												: authToken
													? '/staff-login'
													: '/school-login'
										}
										className="px-4 py-2 mt-2 bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 md:bg-gray-100 hover:bg-gray-200 focus:bg-gray-100 focus:outline-none focus:shadow-outline">
										{isUserLogged
											? 'Go Home'
											: authToken
												? 'Staff Login'
												: 'Login'}
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
