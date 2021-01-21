import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cond from 'cond-construct'

import { AppLayout } from 'components/Layout/appLayout'
import { ActionTypes, OnboardingState } from 'constants/index'

import { AddStaff } from './staff'
import { CreateClass } from './class'
import { AddStudent } from './student'
import { OnboardingCompletion } from './completion'
import clsx from 'clsx'
import { createMerges } from 'actions/core'

export const SchoolOnboarding = () => {

	const dispatch = useDispatch()

	const { db } = useSelector((state: RootReducerState) => state)

	const stage = db?.onboarding?.stage

	// const [stage, setStage] = useState(persistentStage)

	const renderComponent = () => {
		return cond([
			[
				stage === OnboardingState.ADD_STAFF,
				() => <AddStaff />
			],
			[
				stage === OnboardingState.ADD_CLASS,
				() => <CreateClass />
			],
			[
				stage === OnboardingState.ADD_STUDENTS,
				() => <AddStudent />
			],
			[
				stage === OnboardingState.COMPLETED,
				() => <OnboardingCompletion />
			]
		])
	}

	// useEffect(() => {
	// 	setTimeout(() => {
	// 		dispatch(createMerges([
	// 			{
	// 				path: ["db", "onboarding", "stage"],
	// 				value: 0
	// 			}
	// 		]))
	// 	}, 1000)
	// }, [])

	const skipStage = () => {
		dispatch(createMerges([
			{
				path: ["db", "onboarding", "stage"],
				value: stage + 1
			}
		]))
	}

	const AddClassOrStudent = stage === OnboardingState.ADD_CLASS
		|| stage === OnboardingState.ADD_STUDENTS
		|| stage === OnboardingState.COMPLETED

	const addStudent = stage === OnboardingState.ADD_STUDENTS || stage === OnboardingState.COMPLETED

	return (
		<AppLayout title={"Onboarding"}>
			<div className="p-5 md:p-10 md:pb-0 text-gray-700 relative">
				<div className="text-2xl font-bold mt-4 mb-8 text-center">Onboarding</div>
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

				<div className="absolute inset-x-0 -bottom-48 w-4/5 mx-auto flex flex-col space-y-4 md:w-1/3">
					{stage !== OnboardingState.COMPLETED &&
						<button className="tw-btn text-white bg-teal-500">
							{
								stage === OnboardingState.ADD_STAFF
									? 'Add School Staff'
									: stage === OnboardingState.ADD_CLASS
										? 'Add School Class'
										: stage === OnboardingState.ADD_STUDENTS
											? 'Add Students to Class'
											: ''
							}
						</button>
					}
					<button
						onClick={skipStage}
						className="tw-btn bg-orange-brand text-white">Skip</button>
				</div>
			</div>
		</AppLayout>
	)
}