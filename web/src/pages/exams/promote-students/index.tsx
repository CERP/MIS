import React, { Fragment, useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowNarrowRightIcon, TrashIcon } from '@heroicons/react/outline'
import { Transition } from '@headlessui/react'
import { RouteComponentProps, useHistory } from 'react-router'
import { CheckIcon, ReplyIcon } from '@heroicons/react/solid'
import toast from 'react-hot-toast'

import { AppLayout } from 'components/Layout/appLayout'
import { blankClass } from 'constants/form-defaults'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import { isValidStudent } from 'utils'
import { useComponentVisible } from 'hooks/useComponentVisible'
import { TModal } from 'components/Modal'
import { createEditClass, promoteStudents } from 'actions'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

type AugmentedClass = MISClass & {
	fromSection?: Partial<ModifiedSection>
	toSection?: Partial<ModifiedSection>
	promoted?: boolean
}

type PromotionDataType = {
	[id: string]: AugmentedClass
}

type PromotionMap = {
	[student_id: string]: {
		current: string
		next: string
	}
}

type State = {
	promotionData: PromotionDataType
	displayWarning: boolean
	groupedStudents: {
		[section_id: string]: MISStudent[]
	}
	augmentedSections: { [id: string]: ModifiedSection }
	orderIncorrect: boolean
}

type ModifiedSection = AugmentedSection & {
	sectionPromoted: boolean
}

const MIS_TEMP_SECTION_ID = 'mis_temp'

export const PromoteStudents: React.FC<RouteComponentProps> = ({ history }) => {
	const classes = useSelector((state: RootReducerState) => state.db.classes)
	const students = useSelector((state: RootReducerState) => state.db.students)
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)
	const dispatch = useDispatch()

	// This function returns students grouped by their section_ID
	const calculateGroupedStudents = () => {
		let groupedStudents: { [id: string]: Array<MISStudent> } = Object.values(
			students ?? {}
		).reduce((agg, curr) => {
			if (!curr.section_id || isValidStudent(curr, { active: false })) {
				return agg
			}
			if (agg[curr.section_id]) {
				return { ...agg, [curr.section_id]: [...agg[curr.section_id], curr] }
			}

			return { ...agg, [curr.section_id]: [curr] }
		}, {} as { [id: string]: Array<MISStudent> })
		return groupedStudents
	}

	// This is used when we undo promotion for a section
	// We simply replace the students in our state with these by using the section key
	const orignalGroupedStudents = calculateGroupedStudents()

	// These are sorted classes in Descending order, i.e Class 10 to Pre-School
	// Special Classes like A and O Levels are filtered out
	const sortedClasses = useMemo(() => {
		return Object.values(classes)
			.filter(a => checkSpecialClass(a))
			.sort((a, b) => b.classYear - a.classYear)
	}, [classes])

	const checkClassOrders = () => {
		const classesArray = Object.values(classes).sort((a, b) => b.classYear - a.classYear)
		let orderIncorrect = false
		for (let i = 0; i < classesArray.length - 1; i++) {
			// The following check excludes mis_temp class from being counted among the classes for which
			// order is being checked
			if (Object.keys(classesArray[i].sections ?? {})[0] === MIS_TEMP_SECTION_ID) {
				continue
			}
			if (classesArray[i].classYear - classesArray[i + 1].classYear !== 1) {
				orderIncorrect = true
			}
		}
		return orderIncorrect
	}

	const initialState: State = {
		displayWarning: true,
		promotionData: {},
		groupedStudents: calculateGroupedStudents(),
		augmentedSections: getSectionsFromClasses(classes).reduce((agg, curr) => {
			if (!sectionHasStudents(curr.id, Object.keys(orignalGroupedStudents))) {
				return { ...agg, [curr.id]: { ...curr, sectionPromoted: true } }
			}
			return { ...agg, [curr.id]: { ...curr, sectionPromoted: false } }
		}, {}),
		orderIncorrect: checkClassOrders()
	}

	const [state, setState] = useState<State>(initialState)

	//This methods takes the sorted and filtered classes, maps the key of a class against the object of the next class
	const calculatePromotionData = (promotableClasses: MISClass[]) => {
		let mapping: PromotionDataType

		for (let i = 0; i < promotableClasses.length; i++) {
			const sections = getSectionsFromClasses({
				[promotableClasses[i].id]: promotableClasses[i]
			}).filter(section =>
				sectionHasStudents(section?.id, Object.keys(orignalGroupedStudents))
			)

			// let's say we have default section

			// class sections ids
			const sectionIds = sections.map(section => section.id)

			const totalStudents = [...Object.values(students ?? {})].filter(
				s => isValidStudent(s, { active: s.Active }) && sectionIds.includes(s.section_id)
			).length

			if (totalStudents <= 0) {
				continue
			}
			const fromSectionId = sections[0].id

			if (i === 0) {
				if (
					Object.keys(promotableClasses[i].sections ?? {}).includes(MIS_TEMP_SECTION_ID)
				) {
					continue
				}

				const tempSection: MISClass['sections'] = {
					[MIS_TEMP_SECTION_ID]: { name: 'TEMPORARY' }
				}

				mapping = {
					...mapping,
					[promotableClasses[i].id]: {
						...blankClass(),
						name: 'Temporary',
						classYear: promotableClasses[i].classYear + 1,
						sections: {
							mis_temp: { name: 'TEMPORARY' }
						},

						fromSection: {
							...promotableClasses[i].sections[fromSectionId],
							id: fromSectionId
						},
						toSection: { ...tempSection, id: MIS_TEMP_SECTION_ID },
						promoted: false
					}
				}
			} else {
				if (Object.keys(promotableClasses[i].sections).includes(MIS_TEMP_SECTION_ID)) {
					continue
				}

				const toSectionId = Object.keys(promotableClasses[i - 1].sections)[0]

				mapping = {
					...mapping,
					[promotableClasses[i].id]: {
						...promotableClasses[i - 1],
						fromSection: {
							...promotableClasses[i].sections[fromSectionId],
							id: fromSectionId
						},
						toSection: {
							...promotableClasses[i - 1].sections[toSectionId],
							id: toSectionId
						},
						promoted: false
					}
				}
			}
		}

		setState({ ...state, promotionData: mapping })
	}

	useEffect(() => {
		calculatePromotionData(sortedClasses)
	}, [sortedClasses])

	// This hook is fired Everytime there is a change in augmentedSections
	// This is needed because of the nature of how state works in React
	useEffect(() => {
		if (Object.values(state.promotionData ?? {}).length > 0) checkClassPromoted()
	}, [state.augmentedSections])

	// This Function checks if all sections of a class have been promoted and then sets the promoted field
	// in true or false depending on the result
	const checkClassPromoted = () => {
		let promotionData = state.promotionData

		Object.keys(promotionData).forEach(class_key => {
			let noOfPromotedSections = 0

			Object.keys(classes[class_key].sections).forEach(section_key => {
				let noOfSections = Object.keys(classes[class_key].sections).length

				if (state.augmentedSections[section_key].sectionPromoted) {
					noOfPromotedSections = noOfPromotedSections + 1
				}

				if (noOfPromotedSections === noOfSections) {
					promotionData = {
						...promotionData,
						[class_key]: { ...promotionData[class_key], promoted: true }
					}
				} else {
					promotionData = {
						...promotionData,
						[class_key]: { ...promotionData[class_key], promoted: false }
					}
				}
			})

			noOfPromotedSections = 0
		})

		setState({ ...state, promotionData: promotionData })
	}

	//Promotes students of the selected Section
	const promoteSectionStudents = (
		fromSectionId: string,
		toSectionId: string,
		students: MISStudent[]
	) => {
		const studentsToPromote = students

		//This check if necessary if there are no students in a given section
		if (!studentsToPromote) {
			setState({
				...state,
				augmentedSections: {
					...state.augmentedSections,
					[fromSectionId]: {
						...state.augmentedSections[fromSectionId],
						sectionPromoted: true
					}
				}
			})
		}

		setState({
			...state,
			augmentedSections: {
				...state.augmentedSections,
				[fromSectionId]: {
					...state.augmentedSections[fromSectionId],
					sectionPromoted: true
				}
			},
			groupedStudents: { ...state.groupedStudents, [fromSectionId]: students }
		})
	}

	const checkEveryClassPromoted = () => {
		return Object.values(state.promotionData).every(entry => entry.promoted)
	}

	// This method is called by our 'Atomic Button'. It calculates a mapping between student ids and the ids of their
	// current and previous section by using our local state and then dispatches action to promote them all
	const promoteAllStudents = () => {
		const student_section_map: PromotionMap = Object.entries(
			state.groupedStudents ?? {}
		).reduce((agg, [sectionKey, groupedStudents]) => {
			const studentMap = (groupedStudents ?? []).reduce((agg, curr) => {
				return { ...agg, [curr.id]: { current: sectionKey, next: curr.section_id } }
			}, {})
			return { ...agg, ...studentMap }
		}, {})

		if (
			!Object.keys(state.augmentedSections).includes(MIS_TEMP_SECTION_ID) &&
			Object.values(state.promotionData)[0].toSection.id === MIS_TEMP_SECTION_ID
		) {
			const TempSection: MISClass['sections'] = {
				[MIS_TEMP_SECTION_ID]: { name: 'TEMPORARY' }
			}

			const tempClass: MISClass = {
				...blankClass(),
				sections: TempSection,
				name: 'Temporary',
				classYear: 9999
			}

			dispatch(createEditClass(tempClass))

			dispatch(
				promoteStudents(
					student_section_map,
					getSectionsFromClasses({ ...classes, [tempClass.id]: { ...tempClass } })
				)
			)
		} else {
			dispatch(promoteStudents(student_section_map, getSectionsFromClasses(classes)))
		}

		toast.success('Students Promoted')

		setTimeout(() => {
			history.goBack()
		}, 1500)
	}

	const undoSectionPromotion = (fromSectionId: string) => {
		setState({
			...state,
			augmentedSections: {
				...state.augmentedSections,
				[fromSectionId]: {
					...state.augmentedSections[fromSectionId],
					sectionPromoted: false
				}
			},
			groupedStudents: {
				...state.groupedStudents,
				[fromSectionId]: orignalGroupedStudents[fromSectionId]
			}
		})
	}

	const onToChange = (e: string, sectionKey: string) => {
		setState({
			...state,
			promotionData: {
				...state.promotionData,
				[sectionKey]: {
					...state.promotionData[sectionKey],
					toSection: state.augmentedSections[e]
				}
			}
		})
	}

	const onFromChange = (e: string, sectionKey: string) => {
		setState({
			...state,
			promotionData: {
				...state.promotionData,
				[sectionKey]: {
					...state.promotionData[sectionKey],
					fromSection: state.augmentedSections[e]
				}
			}
		})
	}

	return (
		<AppLayout title="Promote Students" showHeaderTitle>
			{!state.promotionData ? (
				<NoClassesToPromoteBanner />
			) : state.orderIncorrect ? (
				<ClassOrderErrorBanner />
			) : (
				<div className="p-5 md:p-10 md:pt-5 md:pb-0 text-gray-700 relative">
					{state.displayWarning ? (
						<PromotionWarning
							onPress={() => setState({ ...state, displayWarning: false })}
						/>
					) : (
						<div className="space-y-4">
							{Object.entries(state.promotionData ?? {}).map(
								([classId, val]: [classId: string, val: AugmentedClass], index) => {
									return (
										<div key={classId + index} className="lg:mx-auto  lg:w-4/5">
											<PromotionCard
												undoSectionPromotion={undoSectionPromotion}
												promotionData={state.promotionData}
												groupedStudents={state.groupedStudents}
												augmentedSections={state.augmentedSections}
												classKey={classId}
												currentClass={val}
												classes={classes}
												promoteSection={promoteSectionStudents}
												onToChange={(e: string) => onToChange(e, classId)}
												onFromChange={(e: string) =>
													onFromChange(e, classId)
												}
											/>
										</div>
									)
								}
							)}

							<div className="flex justify-center">
								<button
									onClick={() =>
										checkEveryClassPromoted()
											? setIsComponentVisible(true)
											: toast.error('All sections are not promoted yet')
									}
									className={clsx(
										'tw-btn-red md:w-2/5 w-full mx-auto mb-4 md:text-lg',
										!checkEveryClassPromoted()
											? 'bg-gray-brand text-gray-500 cursor-not-allowed hover:bg-gray-brand'
											: 'transform  hover:scale-105 transition-transform '
									)}>
									Save Promotions
								</button>
							</div>
						</div>
					)}
				</div>
			)}

			{isComponentVisible && (
				<TModal>
					<div ref={ref} className="bg-white pb-3">
						<p className="text-center p-3 md:p-4 lg:p-5 rounded-md text-sm md:text-base lg:text-xl font-bold">
							Are you sure you want to promote these students? This action is
							irreversable.
						</p>
						<div className="w-full flex justify-around items-center mt-3">
							<button
								className="w-5/12 p-2 md:p-2 lg:p-3 border-none bg-blue-brand text-white rounded-lg outline-none font-bold text-sm md:text-base lg:text-xl"
								onClick={() => setIsComponentVisible(false)}>
								No
							</button>
							<button
								className="w-5/12 p-2 md:p-2 lg:p-3 border-none bg-red-brand text-white rounded-lg outline-none font-bold text-sm md:text-base lg:text-xl"
								onClick={() => {
									promoteAllStudents()
									setIsComponentVisible(false)
								}}>
								Yes
							</button>
						</div>
					</div>
				</TModal>
			)}
		</AppLayout>
	)
}

type PromotionCardProps = {
	classKey: string
	onFromChange: (id: string) => void
	onToChange: (id: string) => void
	promoteSection: (fromSectionId: string, toSectionId: string, students: MISStudent[]) => void
	augmentedSections: {
		[id: string]: ModifiedSection
	}
	currentClass: AugmentedClass
	classes: {
		[id: string]: MISClass
	}
	groupedStudents: { [id: string]: MISStudent[] }
	promotionData: PromotionDataType
	undoSectionPromotion: (sectionKey: string) => void
}

const PromotionCard = ({
	classKey,
	currentClass,
	undoSectionPromotion,
	classes,
	onFromChange,
	onToChange,
	augmentedSections,
	promoteSection,
	groupedStudents,
	promotionData
}: PromotionCardProps) => {
	const [visible, setVisible] = useState(false)
	const [cardGroupedStudents, setCardGroupedStudents] = useState<{ [id: string]: MISStudent[] }>(
		{}
	)

	//This hook is necessary because we are setting the student section id to the default toSectionID
	useEffect(() => {
		setCardGroupedStudents({
			...groupedStudents,
			[currentClass.fromSection.id]: (groupedStudents[currentClass.fromSection.id] ?? []).map(
				student => {
					return { ...student, section_id: currentClass.toSection.id }
				}
			)
		})
	}, [groupedStudents, currentClass.toSection, currentClass.fromSection])

	const removeStudentFromPromotion = (sectionId: string, studentId: string) => {
		setCardGroupedStudents({
			...cardGroupedStudents,
			[sectionId]: cardGroupedStudents[sectionId].filter(student => student.id !== studentId)
		})
	}

	const changeStudentSection = (newSectionKey: string, studentKey: string) => {
		const newSection = cardGroupedStudents[currentClass.fromSection.id].reduce(
			(agg, student) => {
				if (student.id === studentKey) {
					return [...agg, { ...student, section_id: newSectionKey }]
				}
				return [...agg, student]
			},
			[] as MISStudent[]
		)

		setCardGroupedStudents({
			...cardGroupedStudents,
			[currentClass.fromSection.id]: newSection
		})
	}

	return (
		<>
			<div
				key={classKey + currentClass.id}
				className="flex flex-row justify-between p-2 bg-gray-50 shadow-md border-gray-200 border rounded-md font-medium text-gray-600 lg:text-lg lg:py-6 lg:px-10  ">
				<div key={classKey} className="flex flex-col w-2/5 lg:w-2/6">
					<h1>{classes[classKey].name}</h1>
					<select
						className="w-full rounded shadow tw-select text-teal-brand"
						onChange={e => onFromChange(e.target.value)}>
						{Object.entries(classes[classKey].sections)
							.filter(([secId, sec]) =>
								sectionHasStudents(secId, Object.keys(groupedStudents))
							)
							.map(([key, section]) => {
								return (
									<option value={key}>
										{augmentedSections[key].namespaced_name}
									</option>
								)
							})}
					</select>
				</div>
				{augmentedSections[currentClass.fromSection.id].sectionPromoted ? (
					<div className="flex flex-1 items-center justify-center flex-col">
						<div className="bg-green-brand items-center justify-center h-8 w-8 lg:h-12 lg:w-12 flex rounded-full">
							<ReplyIcon
								onClick={() => {
									if (checkPermissionToUndo(promotionData, currentClass.id)) {
										undoSectionPromotion(currentClass.fromSection.id)
									}
								}}
								color="white"
								className="h-7 lg:h-10 cursor-pointer"
							/>
						</div>
						<div
							onClick={() => {
								if (checkPermissionToUndo(promotionData, currentClass.id)) {
									undoSectionPromotion(currentClass.fromSection.id)
								}
							}}
							className="font-light cursor-pointer underline text-red-brand mt-2 md:text-base text-sm">
							Undo
						</div>
					</div>
				) : (
					<div
						key={currentClass.id + classKey}
						className="flex flex-1  text-black font-normal text-sm justify-center items-center flex-col w-2/6 lg:px-0 px-3">
						Move To
						<button
							onClick={() => {
								if (checkPermissionToPromote(promotionData, currentClass.id)) {
									setVisible(isVisible => !isVisible)
								}
							}}
							className="tw-btn-blue rounded-full w-full py-1  lg:w-1/2 text-center">
							<ArrowNarrowRightIcon className="lg:h-12 md:h-10 h-6 mx-auto text-white" />
						</button>
					</div>
				)}
				<div key={currentClass.id} className="flex items-end flex-col w-2/5 lg:w-2/6">
					<h1>{currentClass.name}</h1>
					<select
						className="w-full rounded shadow tw-select text-teal-brand"
						onChange={e => {
							setVisible(false)
							onToChange(e.target.value)
						}}>
						{Object.entries(currentClass.sections).map(([key, section]) => (
							<option value={key}>
								{key === MIS_TEMP_SECTION_ID
									? section.name
									: augmentedSections[key].namespaced_name}
							</option>
						))}
					</select>
				</div>
			</div>
			<PromotableStudents
				classKey={currentClass.id}
				changeStudentSection={changeStudentSection}
				fromSectionName={augmentedSections[currentClass.fromSection.id].namespaced_name}
				fromSectionKey={currentClass.fromSection.id}
				toSectionKey={currentClass.toSection.id}
				groupedStudents={cardGroupedStudents}
				onClickCallback={(
					fromSectionId: string,
					toSectionId: string,
					students: MISStudent[]
				) => {
					promoteSection(fromSectionId, toSectionId, students)
					setVisible(false)
				}}
				removeStudentFromPromotion={removeStudentFromPromotion}
				visible={visible}
				augmentedSections={augmentedSections}
			/>
		</>
	)
}

type PromotableStudentProps = {
	classKey: string
	fromSectionName: string
	fromSectionKey: string
	toSectionKey: string
	groupedStudents: State['groupedStudents']
	onClickCallback: (fromSectionKey: string, toSectionId: string, students: MISStudent[]) => void
	removeStudentFromPromotion: (sectionId: string, studentId: string) => void
	visible: boolean
	changeStudentSection: (newSectionKey: string, studentId: string) => void
	augmentedSections: {
		[id: string]: ModifiedSection
	}
}

type PromotableStudentsState = {
	students: MISStudent[]
}
const PromotableStudents = ({
	classKey,
	fromSectionName,
	fromSectionKey,
	toSectionKey,
	changeStudentSection,
	groupedStudents,
	onClickCallback,
	removeStudentFromPromotion,
	visible,
	augmentedSections
}: PromotableStudentProps) => {
	const [state, setState] = useState<PromotableStudentsState>({
		students: []
	})

	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)

	useEffect(() => {
		setState({ ...state, students: groupedStudents[fromSectionKey] })
	}, [fromSectionKey, toSectionKey, groupedStudents])

	return (
		<Transition
			as={Fragment}
			show={visible}
			enter="transform transition duration-[400ms]"
			enterFrom="opacity-0 rotate-[-120deg] scale-50"
			enterTo="opacity-100 rotate-0 scale-100"
			leave="transform duration-200 transition ease-in-out"
			leaveFrom="opacity-100 rotate-0 scale-100 "
			leaveTo="opacity-0 scale-95 ">
			<div className="flex-1 flex-col flex mb-4  py-4 text-xs md:text-lg">
				<div className="hidden text-lg flex-row md:flex justify-between px-10 py-2 bg-gray-700 text-white rounded-md font-medium">
					<h1>Name</h1>
					<h1>Promoted Section</h1>
					<h1>Remove Promotion</h1>
				</div>
				{(state.students || []).map(student => {
					return (
						<div className="md:bg-gray-200 bg-gray-50  flex-col md:flex-row mb-3 items-center flex justify-between px-5 md:px-10 py-3 md:py-7 rounded-md border-gray-200 border shadow-md md:shadow-none md:rounded-sm font-medium">
							<div className="flex text-sm md:text-base self-start md:self-center md:w-1/3">
								<h1>{student.Name}</h1>
							</div>
							<div className="flex flex-1 self-start items-center w-full">
								<div className="flex md:flex-1 items-center w-3/4">
									<select
										defaultValue={toSectionKey}
										className="w-full rounded shadow tw-select text-teal-brand"
										onChange={e =>
											changeStudentSection(e.target.value, student.id)
										}>
										{Object.entries(augmentedSections)
											.filter(([secKey, sec]) => sec.class_id === classKey)
											.map(([key, section]) => (
												<option value={key}>
													{section.namespaced_name}
												</option>
											))}
										{toSectionKey === MIS_TEMP_SECTION_ID && (
											<option value={MIS_TEMP_SECTION_ID}>TEMPORARY</option>
										)}
									</select>
								</div>
								<button className="flex md:flex-1 w-1/3 justify-end items-end  flex-row">
									<TrashIcon
										onClick={() =>
											removeStudentFromPromotion(fromSectionKey, student.id)
										}
										color="red"
										className="cursor-pointer h-6 w-6"
									/>
								</button>
							</div>
						</div>
					)
				})}
				<button
					className="tw-btn w-full bg-green-brand md:w-2/5 text-white mx-auto"
					onClick={() => {
						setIsComponentVisible(true)
					}}>
					Confirm
				</button>
				{isComponentVisible && (
					<TModal>
						<div ref={ref} className="bg-white pb-3 relative">
							<div className="flex flex-1 justify-center pt-4">
								<CheckIcon className="text-white h-16 bg-green-brand rounded-full" />
							</div>
							<p className="text-center p-3 md:p-4 lg:p-5 rounded-md text-sm md:text-base lg:text-xl font-bold">
								Confirm Promoting students of
							</p>
							<p className="text-center p-2  lg:p-3 rounded-md text-base md:text-3xl text-blue-brand font-bold">
								{fromSectionName}
							</p>
							<div className="w-full flex justify-around items-center mt-3">
								<button
									className="tw-btn-blue w-5/12"
									onClick={() => setIsComponentVisible(false)}>
									Go Back
								</button>
								<button
									className="tw-btn bg-green-brand w-5/12 text-white"
									onClick={() => {
										onClickCallback(
											fromSectionKey,
											toSectionKey,
											state.students
										)
										setIsComponentVisible(false)
									}}>
									Promote
								</button>
							</div>
						</div>
					</TModal>
				)}
			</div>
		</Transition>
	)
}

type PromotionWarningProps = {
	onPress: () => void
}

const PromotionWarning = ({ onPress }: PromotionWarningProps) => {
	return (
		<div className="flex-1 flex justify-center flex-col items-center ">
			<p className="w-32 h-32 rounded-full items-center justify-center flex text-6xl bg-blue-brand text-center text-white mt-10">
				!
			</p>
			<p className="font-bold mt-8 mb-4">You are going to </p>
			<p className="font-semibold text-3xl text-blue-brand">Open Promotions</p>
			<p className="font-normal my-4 text-lg text-center">
				You can promote a class only once per academic year
			</p>
			<button onClick={() => onPress()} className=" tw-btn-blue font-semibold">
				Ok, I understand
			</button>
		</div>
	)
}

const ClassOrderErrorBanner = () => {
	return (
		<div className="w-full px-10 py-16 m-auto flex items-center justify-center">
			<div className="bg-white shadow-md overflow-hidden sm:rounded-lg pb-8">
				<div className="border-t border-gray-200 text-center pt-8">
					<h1 className="lg:text-3xl text-xl mb-5 font-bold text-red-brand">
						One or more Classes Order is Incorrect
					</h1>
					<p className="lg:text-2xl text-base pb-8 px-12 font-medium">
						Please correct the order/year of your classes or contact support for more
						details
					</p>
					<div className="space-x-4">
						<Link to="/home">
							<button className="tw-btn-blue py-2 rounded-md">Go Home</button>
						</Link>
						<Link to="/contact-us">
							<button className="tw-btn-red py-2 rounded-md">Contact Us</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

const NoClassesToPromoteBanner = () => {
	return (
		<div className="w-full px-10 py-16 m-auto flex items-center justify-center">
			<div className="bg-white shadow-md overflow-hidden sm:rounded-lg pb-8">
				<div className="border-t border-gray-200 text-center pt-8">
					<h1 className="lg:text-3xl text-xl mb-5 font-bold text-red-brand">
						No Classses to Promote
					</h1>
					<p className="lg:text-2xl text-base pb-8 px-12 font-medium">
						There are no classes to promote, or the classes exist and you do not have
						students in them.
						<br />
						If you think this is an error, please contact us
					</p>
					<div className="space-x-4">
						<Link to="/home">
							<button className="tw-btn-blue py-2 rounded-md">Go Home</button>
						</Link>
						<Link to="/contact-us">
							<button className="tw-btn-red py-2 rounded-md">Contact Us</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

// Checks if class is A or O Levels
function checkSpecialClass(a: MISClass): boolean {
	return !(
		'alevel' === a.name.replace(/[^A-Z0-9]+/gi, '').toLowerCase() ||
		'olevel' === a.name.replace(/[^A-Z0-9]+/gi, '').toLowerCase()
	)
}

// Checks if the senior class is promoted so junior can be promoted
// Basically ensures the order in which the classes are to be promoted
function checkPermissionToPromote(promotionData: PromotionDataType, id: string) {
	let data = Object.values(promotionData)
	let index = data.findIndex(val => val.id === id)

	if (index === 0) return true

	index = index - 1

	if (!data[index].promoted) {
		toast.error('Promote higher classes first')
		return false
	}

	return true
}

// The inverse of the above method
// Ensures the order in which we can undo a class promotion
function checkPermissionToUndo(promotionData: PromotionDataType, id: string) {
	let data = Object.values(promotionData)
	let index = data.findIndex(val => val.id === id)

	if (index === data.length - 1) return true

	index = index + 1

	if (data[index].promoted) {
		toast.error('Undo lower classes first')
		return false
	}

	return true
}

const sectionHasStudents = (sectionId: string, allSectionIds: string[]): boolean => {
	return allSectionIds.includes(sectionId)
}
