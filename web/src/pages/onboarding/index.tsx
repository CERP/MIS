import React from 'react'

import { AppLayout } from 'components/Layout/appLayout'
import { OnboardingState } from 'constants/index'
import { AddStaffForm } from './faculty'
import { CreateClass } from './class'
import { AddStudent } from './student'

export const SchoolOnboarding = () => {

	const step = "CREATE_CLASS"

	return (
		<AppLayout title={"Onboarding"}>
			<div className="p-5 pb-0 md:p-10 md:pb-0 text-gray-700 relative">
				<div className="text-2xl font-bold mt-4 mb-8 text-center">Onboarding</div>
				{
					true ?
						<AddStudent />
						:
						<>
							<div className="flex flex-col md:flex-row items-center justify-center space-y-16 md:space-y-0 md:space-x-16 md:w-11/12 mx-auto md:p-10">

								<div className="flex flex-row items-center md:flex-col">
									<div className="w-10 h-10 bg-teal-500 border-2 border-teal-500 mx-auto rounded-full text-lg flex items-center">
										<span className="text-white text-center w-full">1</span>
									</div>
									<div className="mx-10">	Add Faculty</div>
								</div>

								<div className="flex flex-row items-center md:flex-col">
									<div className="w-10 h-10 bg-white border-2 border-teal-500 mx-auto rounded-full text-lg flex items-center">
										<span className="text-teal-500 text-center w-full">2</span>
									</div>
									<div className="mx-10">Create Class</div>
								</div>


								<div className="flex flex-row items-center md:flex-col">
									<div className="w-10 h-10 bg-white border-2 border-teal-500 mx-auto rounded-full text-lg flex items-center">
										<span className="text-teal-500 text-center w-full">3</span>
									</div>
									<div className="mx-10">Add Student</div>
								</div>
							</div>
							<div className="absolute inset-x-0 -bottom-48 w-4/5 mx-auto flex flex-col space-y-4 md:w-1/3">
								<button className="tw-btn text-white bg-teal-500">Create Teacher Profile</button>
								<button className="w-3/5 mx-auto tw-btn bg-orange-brand text-white">Skip</button>
							</div>
						</>
				}
			</div>
		</AppLayout>
	)
}