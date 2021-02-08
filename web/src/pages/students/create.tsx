import React from 'react'
import { AppLayout } from 'components/Layout/appLayout'

import UserIconSvg from 'assets/svgs/user.svg'

export const CreateOrUpdateStudent = () => {
	return (
		<AppLayout title={`${true ? "New Student" : "Update Student"}`}>
			<div className="p-5 md:p-10 md:pb-0 text-gray-700 relative">
				<div className="text-2xl font-bold mt-4 mb-8 text-center">{true ? "Add new Student" : 'Update Student'}</div>
				<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 pb-6 my-4 md:mt-8">
					<div className="text-white text-center text-base my-5">Personal Information</div>
					<div className="flex flex-row items-baseline justify-between w-3/5">
						<div className="bg-white p-1 rounded-full text-teal-500">
							<svg className="w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						</div>
						<div className="w-24 h-24">
							<img className="rounded-full" src={UserIconSvg} alt="student" />
						</div>
						<label className="bg-white p-1 rounded-full text-teal-500">
							<input type="file" className="hidden" accept="image/*" />
							<svg className="w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
							</svg>
						</label>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}