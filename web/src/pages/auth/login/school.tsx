import React, { useState } from 'react'

import { AppLayout } from 'components/Layout/appLayout'
import { Link } from 'react-router-dom'

export const SchoolLogin = () => {

	const [togglePassword, setTogglePassword] = useState(false)

	return (
		<AppLayout title={"School Login"}>
			<div className="bg-teal-50 min-h-screen">
				<div className="p-5 pb-0 md:p-10 md:pb-0 text-gray-700">
					<div className="flex flex-col items-center space-y-2">
						<div className="text-2xl font-bold">Log in to MISchool</div>
						<div className="text-sm mt-5">
							<span className="text-gray-500">Don't have an account? </span>
							<Link to="school-signup" className="text-blue-500 text-base">Sign up</Link>
						</div>
					</div>

					<div className="w-full mt-5 px-5 md:mt-10 md:px-16">
						<div className="bg-white shadow-md mx-auto md:w-1/3 rounded-md py-6 px-6 md:px-8">
							<form className="flex flex-col justify-items-start">
								<div className="my-2">Mobile Number (School Id)</div>
								<input
									name="sid"
									autoCapitalize="off"
									autoCorrect="off"
									placeholder="Enter school id"
									className="text-gray-500 w-full p-2 rounded-md ring-2 ring-offset-blue-400 focus:ring-blue-brand focus:appearance-none focus:outline-none" />

								<div className="my-2">Password</div>
								<div className="relative">
									<input
										name="password"
										type={togglePassword ? 'text' : 'password'}
										placeholder="Enter password"
										className="text-gray-500 w-full p-2 rounded-md ring-2 ring-offset-blue-400 focus:ring-blue-brand focus:appearance-none focus:outline-none" />
									<div
										onClick={() => setTogglePassword(!togglePassword)}
										className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
										{
											togglePassword ?
												<svg className="h-6" fill="none" xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 640 512">
													<path fill="currentColor"
														d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z">
													</path>
												</svg>
												:
												<svg className="h-6" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
													<path fill="currentColor"
														d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z">
													</path>
												</svg>
										}
									</div>
								</div>
								<button className="mt-8 px-5 md:px-8 py-3 bg-blue-brand rounded-md text-white cursor-pointer hover:bg-blue-400">Login into your School</button>
								<Link to="/school/reset-password" className="mt-2 text-sm text-gray-500 text-center hover:text-blue-brand">Forgot your school passsword?</Link>
							</form>

						</div>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
