import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import cond from 'cond-construct'

import { AppLayout } from 'components/Layout/appLayout'
import { ActionTypes, OnboardingStage } from 'constants/index'

import { AddStaff } from './staff'
import { CreateClass } from './class'
import { AddStudent } from './student'
import { OnboardingCompletion } from './completion'
import { createMerges } from 'actions/core'

const stageMap = {
	[OnboardingStage.ADD_STAFF]: { next: OnboardingStage.ADD_CLASS, previous: "" },
	[OnboardingStage.ADD_CLASS]: { next: OnboardingStage.ADD_STUDENTS, previous: OnboardingStage.ADD_STAFF },
	[OnboardingStage.ADD_STUDENTS]: { next: OnboardingStage.COMPLETED, previous: OnboardingStage.ADD_CLASS },
	[OnboardingStage.COMPLETED]: { next: "", previous: OnboardingStage.ADD_CLASS },
}

export const SchoolOnboarding = () => {

	const dispatch = useDispatch()

	const { db } = useSelector((state: RootReducerState) => state)

	const persistentStage = db?.onboarding?.stage

	const [stage, setStage] = useState<MISOnboarding["stage"]>(persistentStage === OnboardingStage.ADD_STAFF ? undefined : persistentStage)

	const renderComponent = (): React.ReactNode | undefined => {
		return cond([
			[
				stage === OnboardingStage.ADD_STAFF,
				() => <AddStaff skipStage={skipStage} />
			],
			[
				stage === OnboardingStage.ADD_CLASS,
				() => <CreateClass skipStage={skipStage} />
			],
			[
				stage === OnboardingStage.ADD_STUDENTS,
				() => <AddStudent skipStage={skipStage} />
			],
			[
				stage === OnboardingStage.COMPLETED,
				() => <OnboardingCompletion />
			]
		])
	}

	useEffect(() => {

		// this is to make sure, for the first time
		// when admin (first user) land on onboarding page,
		// "stage" will be updated manually.
		if (persistentStage === OnboardingStage.ADD_STAFF)
			return

		setStage(persistentStage)

	}, [persistentStage])

	// useEffect(() => {

	// 	setTimeout(() => {
	// 		dispatch(createMerges([
	// 			{
	// 				path: ["db", "onboarding", "stage"],
	// 				value: OnboardingStage.ADD_STAFF
	// 			}
	// 		]))
	// 	}, 1000)
	// }, [])

	const skipStage = () => {

		const nextStage = stageMap[persistentStage].next as MISOnboarding["stage"]

		setStage(nextStage)

		dispatch(createMerges([
			{
				path: ["db", "onboarding", "stage"],
				value: nextStage
			}
		]))

		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'auto'
		})
	}

	const AddClassOrStudent = stage === OnboardingStage.ADD_CLASS
		|| stage === OnboardingStage.ADD_STUDENTS
		|| stage === OnboardingStage.COMPLETED

	const addStudent = stage === OnboardingStage.ADD_STUDENTS || stage === OnboardingStage.COMPLETED

	return (
		<AppLayout title={"Onboarding"}>
			<div className="p-5 md:p-10 md:pb-0 text-gray-700 relative">
				<div className="text-2xl font-bold mt-4 mb-8 text-center">
					{
						stage === OnboardingStage.ADD_STAFF
							? 'Add School Staff'
							: stage === OnboardingStage.ADD_CLASS
								? 'Add School Class'
								: stage === OnboardingStage.ADD_STUDENTS
									? 'Add Students to Class'
									:
									stage === OnboardingStage.COMPLETED
										? ''
										: 'Onboarding'
					}
				</div>
				{
					renderComponent() || <>

						<div className="flex flex-col md:flex-row items-center justify-center space-y-16 md:space-y-0 md:space-x-16 md:w-11/12 mx-auto md:p-10">
							<div className="flex flex-row items-center md:flex-col">
								<div className="w-10 h-10 border-2 border-teal-500 mx-auto rounded-full text-lg flex items-center bg-teal-500">
									<span className="text-white text-center w-full">1</span>
								</div>
								<div className="mx-10">Add Faculty</div>
							</div>

							<div className="flex flex-row items-center md:flex-col">
								<div className={clsx("w-10 h-10 border-2 border-teal-500 mx-auto rounded-full text-lg flex items-center", {
									'bg-teal-500': AddClassOrStudent
								})}>
									<span className={clsx("text-center w-full", {
										'text-white': AddClassOrStudent,
										'text-teal-500': !AddClassOrStudent
									})}>2</span>
								</div>
								<div className="mx-10">Create Class</div>
							</div>


							<div className="flex flex-row items-center md:flex-col">
								<div className={clsx("w-10 h-10 border-2 border-teal-500 mx-auto rounded-full text-lg flex items-center", {
									'bg-teal-500': addStudent
								})}>
									<span className={clsx("text-center w-full", {
										'text-white': addStudent,
										'text-teal-500': !addStudent
									})}>3</span>
								</div>
								<div className="mx-10">Add Student</div>
							</div>
						</div>
						<div
							onClick={() => setStage(stage === undefined ? persistentStage : stageMap[persistentStage].next as MISOnboarding["stage"])}
							className="absolute inset-x-0 -bottom-48 w-4/5 mx-auto flex flex-col space-y-4 md:w-1/3">
							{stage !== OnboardingStage.COMPLETED &&
								<button className="tw-btn text-white bg-teal-500">
									{
										stage === OnboardingStage.ADD_STAFF || stage === undefined
											? 'Add School Staff'
											: stage === OnboardingStage.ADD_CLASS
												? 'Add School Class'
												: stage === OnboardingStage.ADD_STUDENTS
													? 'Add Students to Class'
													: ''
									}
								</button>
							}
							<button
								onClick={skipStage}
								className="tw-btn bg-orange-brand text-white">Skip</button>
						</div>
					</>
				}
			</div>
		</AppLayout>
	)
}