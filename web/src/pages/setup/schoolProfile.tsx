import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import clsx from 'clsx'

import toTitleCase from 'utils/toTitleCase'

import { Spinner } from 'components/Animation/spinner'
import { AppLayout } from 'components/Layout/appLayout'
import { EyePassword } from 'components/Password'

import UserIconSvg from 'assets/svgs/user.svg'


export const SchoolProfile = () => {

	const { settings, assets } = useSelector((state: RootDBState) => state)

	return (
		<AppLayout title={'Setup School'}>
			<div className="p-5 pb-0 md:p-10 md:pb-0 text-gray-700">
				{
					true ?
						<>
							<div className="text-2xl text-center font-bold">Create Admin Account</div>
							<AdminCreateForm />
						</>
						:
						<>
							<div className="text-xl md:text-2xl text-center font-bold">Build School Profile</div>
							<div className="md:w-3/4 mx-auto flex flex-col md:flex-row items-center mt-10 md:t-20">
								<div className="w-3/5 md:w-2/5 md:h-60 border border-r-0 rounded-xl sm:rounded-bl-none sm:rounded-br-none md:rounded-tr-none md:rounded-br-none shadow-md">
									<div className="flex flex-col items-center p-4 md:p-10 space-y-2">
										<div className="text-center">
											<div className={clsx("w-16 h-16 border border-gray-300 flex md:h-20 items-center justify-center p-1 rounded-full md:w-20", { "bg-blue-brand": !assets?.schoolLogo })}>
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
								<div className="w-4/5 md:w-2/3 h-60 md:h-96 border md:border-l-0 rounded-xl md:rounded-md bg-gray-700 shadow-md">
									<div className="p-4 md:p-10">
										<div className="text-white text-center text-sm md:text-base">Please Create your Admin profile</div>
										<div className="flex flex-col items-center justify-center p-6 md:p-16">
											<div className={"border border-gray-300 flex h-20 items-center justify-center p-1 rounded-full w-20 bg-blue-brand"}>
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

type TAdminCreateForm = {

}

const AdminCreateForm: React.FC<TAdminCreateForm> = ({ }) => {

	const [openEye, setOpenEye] = useState(false)

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

	}

	return (
		<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 mt-4 md:mt-8">
			<div className="text-white text-center text-base my-5">Please Create your Admin profile</div>
			<div className="w-24 h-24">
				<img className="rounded-full" src={UserIconSvg} alt="school-logo" />
			</div>
			<form id='admin-account' className="text-white space-y-4 md:w-4/3 px-4" onSubmit={handleSubmit}>
				<div className="">Name*</div>
				<input
					name="name"
					required
					placeholder="e.g. John Doe"
					className="tw-input w-full bg-transparent border-blue-brand ring-1" />
				<div className="">Personal Number*</div>
				<input
					name="phone"
					required
					placeholder="e.g. 03xxxxxxxx"
					className="tw-input w-full bg-transparent border-blue-brand ring-1" />
				<div className="">Password*</div>
				<div className="w-full relative">
					<input
						name="password"
						required
						type={openEye ? 'text' : 'password'}
						autoCapitalize="off"
						autoCorrect="off"
						autoComplete="off"
						placeholder="Enter password"
						className="tw-input w-full bg-transparent border-blue-brand ring-1" />
					<div
						onClick={() => setOpenEye(!openEye)}
						className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
						{
							<EyePassword open={openEye} />
						}
					</div>
				</div>
				<div className="">
					<button className={clsx("inline-flex w-full items-center tw-btn-blue py-3 font-semibold my-4", { "pointer-events-none": true })}>
						{
							false ?
								<>
									<Spinner />
									<span className={"mx-auto animate-pulse"}>Creating Account...</span>
								</>
								:
								<span className={"mx-auto"}>Create Account</span>
						}
					</button>
				</div>
				<div className="h-1 py-1 text-xs text-red-brand">{ }</div>
			</form>
		</div>
	)
}