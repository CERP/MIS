import React from 'react'
import { useSelector } from 'react-redux'
import clsx from 'clsx'

import toTitleCase from 'utils/toTitleCase'

import { AppLayout } from 'components/Layout/appLayout'
import { AdminCreateForm } from './createAdmin'



export const SchoolProfile = () => {

	const { settings, assets } = useSelector((state: RootDBState) => state)

	return (
		<AppLayout title={'Setup School'}>
			<div className="p-5 pb-0 md:p-10 md:pb-0 text-gray-700">
				<div className="text-2xl text-center font-bold mt-4 mb-8">{false ? "Create Admin Account" : "Build School Profile"}</div>

				{
					false ?
						<>
							<AdminCreateForm />
						</>
						:
						<>
							<div className="text-xl md:text-2xl text-center font-bold"></div>
							<div className="md:w-3/4 mx-auto flex flex-col md:flex-row items-center mt-10 md:t-20">
								<div className="bg-white border h-48 md:h-72 md:w-2/5 rounded-2xl  shadow-md w-11/12  rounded-b-none border-b-0 md:rounded-bl-2xl md:rounded-r-none md:border-r-0">
									<div className="flex flex-col items-center p-4 md:p-10 space-y-2">
										<div className="text-center my-2">
											<div className={clsx("flex h-20 items-center justify-center p-1 rounded-full w-20", { "bg-blue-brand": !assets?.schoolLogo })}>
												{
													assets?.schoolLogo ?
														<img className="rounded-full" src={assets?.schoolLogo || '/favicon.ico'} alt="school-logo" />
														:
														<div className="text-white text-2xl">+</div>
												}
											</div>
											<div className="text-sm">Add Logo</div>
										</div>
										<div className="font-semibold text-lg text-center">Welcome to {toTitleCase(settings?.schoolName)}</div>
									</div>
								</div>
								<div className="bg-gray-700 border h-72 md:border-l-0 md:h-96 md:w-2/3 rounded-2xl shadow-md w-full">
									<div className="p-4 md:p-10">
										<div className="text-white text-center text-sm md:text-base">Please Create your Admin profile</div>
										<div className="flex flex-col items-center justify-center p-6 md:p-16 mt-10">
											<div className={"flex h-20 items-center justify-center p-1 rounded-full w-20 bg-blue-brand"}>
												<div className="text-white text-2xl">+</div>
											</div>
											<div className="text-sm text-white mt-4">Add Profile</div>
										</div>
									</div>
								</div>
							</div>
						</>
				}
			</div>
		</AppLayout>
	)
}