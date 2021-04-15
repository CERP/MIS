import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import cond from 'cond-construct'

import { AppLayout } from 'components/Layout/appLayout'
import { OnboardingStage } from 'constants/index'

import { AddStaff } from './staff'
import { CreateClass } from './class'
import { AddStudent } from './student'
import { OnboardingCompletion } from './completion'
import { createMerges } from 'actions/core'

// kind of state machine
const stageMap = {
	[OnboardingStage.ADD_STAFF]: { next: OnboardingStage.ADD_CLASS, previous: '' },
	[OnboardingStage.ADD_CLASS]: {
		next: OnboardingStage.ADD_STUDENTS,
		previous: OnboardingStage.ADD_STAFF
	},
	[OnboardingStage.ADD_STUDENTS]: {
		next: OnboardingStage.COMPLETED,
		previous: OnboardingStage.ADD_CLASS
	},
	[OnboardingStage.COMPLETED]: { next: '', previous: OnboardingStage.ADD_CLASS }
}

const getOnboardingHeadings = (stage: OnboardingStage, button?: boolean) => {
	if (stage === OnboardingStage.ADD_STAFF || (button && stage === undefined)) {
		return 'Add School Staff'
	}

	if (stage === OnboardingStage.ADD_CLASS) {
		return 'Add School Class'
	}

	if (stage === OnboardingStage.ADD_STUDENTS) {
		return 'Add Students to Class'
	}

	if (stage === OnboardingStage.COMPLETED) {
		return ''
	}

	return 'Onboarding'
}

export const SchoolOnboarding = () => {
	const dispatch = useDispatch()

	const { db } = useSelector((state: RootReducerState) => state)

	const persistentStage = db?.onboarding?.stage

	// check if it's first state, set undefined, this is because
	// we want to show user steps of onboarding
	// when user click on the "add staff" button, state will be updated
	// consequently, renderComponent() render the AddStaff component
	const initialStage = persistentStage === OnboardingStage.ADD_STAFF ? undefined : persistentStage
	// TODO: get typing from enum instead of defined types
	const [stage, setStage] = useState<MISOnboarding['stage']>(initialStage)

	const renderComponent = (): React.ReactNode | undefined => {
		return cond([
			[stage === OnboardingStage.ADD_STAFF, () => <AddStaff skipStage={skipStage} />],
			[stage === OnboardingStage.ADD_CLASS, () => <CreateClass skipStage={skipStage} />],
			[stage === OnboardingStage.ADD_STUDENTS, () => <AddStudent skipStage={skipStage} />],
			[stage === OnboardingStage.COMPLETED, () => <OnboardingCompletion />]
		])
	}

	useEffect(() => {
		// this is to make sure, for the first time
		// when admin (first user) land on onboarding page,
		// "stage" will be updated manually instead of persistentStage.
		if (persistentStage === OnboardingStage.ADD_STAFF) return

		setStage(persistentStage)
	}, [persistentStage])

	const skipStage = (stage?: MISOnboarding['stage']) => {
		const nextStage = stage || (stageMap[persistentStage].next as MISOnboarding['stage'])

		setStage(nextStage)

		dispatch(
			createMerges([
				{
					path: ['db', 'onboarding', 'stage'],
					value: nextStage
				}
			])
		)

		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'auto'
		})
	}

	// TODO: introduce better way to show color for completed steps
	const AddClassOrStudent =
		stage === OnboardingStage.ADD_CLASS ||
		stage === OnboardingStage.ADD_STUDENTS ||
		stage === OnboardingStage.COMPLETED

	const addStudent = stage === OnboardingStage.ADD_STUDENTS || stage === OnboardingStage.COMPLETED

	return (
		<AppLayout title={'Onboarding'}>
			<div className="p-5 md:p-10 md:pb-0 text-gray-700 relative">
				<div className="text-2xl font-bold mt-4 mb-8 text-center">
					{getOnboardingHeadings(stage as OnboardingStage)}
				</div>
				{renderComponent() || (
					<>
						<div className="flex flex-col md:flex-row items-center justify-center space-y-16 md:space-y-0 md:space-x-16 md:w-11/12 mx-auto md:p-10">
							<div className="flex flex-row items-center md:flex-col">
								<div className="w-10 h-10 border-2 border-teal-brand mx-auto rounded-full text-lg flex items-center bg-teal-brand">
									<span className="text-white text-center w-full">1</span>
								</div>
								<div className="mx-10">Add Faculty</div>
							</div>

							<div className="flex flex-row items-center md:flex-col">
								<div
									className={clsx(
										'w-10 h-10 border-2 border-teal-brand mx-auto rounded-full text-lg flex items-center',
										{
											'bg-teal-brand': AddClassOrStudent
										}
									)}>
									<span
										className={clsx('text-center w-full', {
											'text-white': AddClassOrStudent,
											'text-teal-brand': !AddClassOrStudent
										})}>
										2
									</span>
								</div>
								<div className="mx-10">Create Class</div>
							</div>

							<div className="flex flex-row items-center md:flex-col">
								<div
									className={clsx(
										'w-10 h-10 border-2 border-teal-brand mx-auto rounded-full text-lg flex items-center',
										{
											'bg-teal-brand': addStudent
										}
									)}>
									<span
										className={clsx('text-center w-full', {
											'text-white': addStudent,
											'text-teal-brand': !addStudent
										})}>
										3
									</span>
								</div>
								<div className="mx-10">Add Student</div>
							</div>
						</div>
						<div
							onClick={() =>
								setStage(
									stage === undefined
										? persistentStage
										: (stageMap[persistentStage].next as MISOnboarding['stage'])
								)
							}
							className="absolute inset-x-0 -bottom-48 w-4/5 mx-auto flex flex-col space-y-4 md:w-1/3">
							{stage !== OnboardingStage.COMPLETED && (
								<button className="tw-btn text-white bg-teal-brand">
									{getOnboardingHeadings(stage as OnboardingStage, true)}
								</button>
							)}
							<button
								onClick={() => skipStage()}
								className="tw-btn bg-orange-brand text-white">
								Skip
							</button>
						</div>
					</>
				)}
			</div>
		</AppLayout>
	)
}
