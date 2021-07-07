import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowNarrowRightIcon, TrashIcon } from '@heroicons/react/outline'
import { Transition } from '@headlessui/react'
import { useHistory } from 'react-router'
import { CheckIcon, ReplyIcon } from '@heroicons/react/solid'
import toast from 'react-hot-toast'

import { AppLayout } from 'components/Layout/appLayout'
import { blankClass } from 'constants/form-defaults'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import { isValidStudent } from 'utils'
import { useComponentVisible } from 'hooks/useComponentVisible'
import { TModal } from 'components/Modal'
import { createEditClass, promoteStudents } from 'actions'

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
	// localState: Array<MISClass>
	promotionData: PromotionDataType
	displayWarning: boolean
	groupedStudents: {
		[section_id: string]: MISStudent[]
	}
	augmentedSections: { [id: string]: ModifiedSection }
}

type ModifiedSection = AugmentedSection & {
	sectionPromoted: boolean
}

export const PromoteStudents = () => {
	const classes = useSelector((state: RootReducerState) => state.db.classes)
	const students = useSelector((state: RootReducerState) => state.db.students)
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)
	const dispatch = useDispatch()
	const history = useHistory()

	const calculateGroupedStudents = () => {
		let groupedStudents: { [id: string]: Array<MISStudent> } = [
			...Object.values(students ?? {})
		]
			.filter(s => isValidStudent(s) && s.Active)
			.reduce((agg, curr) => {
				if (!curr.section_id) {
					return { ...agg }
				}
				if (agg[curr.section_id]) {
					return { ...agg, [curr.section_id]: [...agg[curr.section_id], curr] }
				}

				return { ...agg, [curr.section_id]: [curr] }
			}, {} as { [id: string]: Array<MISStudent> })
		// console.log(groupedStudents)
		return groupedStudents
	}

	const orignal_grouped_students = calculateGroupedStudents()

	const sortedClasses = Object.values(classes)
		.filter(a => checkSpecialClass(a))
		.sort((a, b) => b.classYear - a.classYear)

	const initialState: State = {
		displayWarning: true,
		// localState: Object.values(classes)
		// 	.filter(a => checkSpecialClass(a))
		// 	.sort((a, b) => b.classYear - a.classYear),
		promotionData: {},
		groupedStudents: calculateGroupedStudents(),
		augmentedSections: getSectionsFromClasses(classes).reduce((agg, curr) => {
			return { ...agg, [curr.id]: { ...curr, sectionPromoted: false } }
		}, {})
	}

	const [state, setState] = useState<State>(initialState)

	const calculatePromotionData = (localState: MISClass[]) => {
		let mapping: PromotionDataType

		for (let i = 0; i < localState.length; i++) {
			const fromkey = Object.keys(localState[i].sections)[0]

			const sections = getSectionsFromClasses({
				[localState[i].id]: localState[i]
			})

			const sectionIds = sections.reduce((agg, curr) => [...agg, curr.id], [])

			const totalStudents = [...Object.values(students ?? {})].filter(
				s => isValidStudent(s) && s.Active && sectionIds.includes(s.section_id)
			).length

			if (totalStudents <= 0) {
				continue
			}

			if (i === 0) {
				if (Object.keys(localState[i].sections).includes('mis_temp') === true) {
					continue
				}
				const TempSection: MISClass['sections'] = { ['mis_temp']: { name: 'TEMPORARY' } }
				mapping = {
					...mapping,
					[localState[i].id]: {
						...blankClass(),
						name: localState[i].name,
						classYear: localState[i].classYear + 1,
						sections: {
							['mis_temp']: { name: 'TEMPORARY' }
						},

						fromSection: {
							...localState[i].sections[fromkey],
							id: fromkey
						},
						toSection: { ...TempSection, id: 'mis_temp' },
						promoted: false
					}
				}
			} else {
				if (Object.keys(localState[i].sections).includes('mis_temp') === true) {
					continue
				}
				const toKey = Object.keys(localState[i - 1].sections)[0]
				mapping = {
					...mapping,
					[localState[i].id]: {
						...localState[i - 1],
						fromSection: {
							...localState[i].sections[fromkey],
							id: fromkey
						},
						toSection: {
							...localState[i - 1].sections[toKey],
							id: toKey
						},
						promoted: false
					}
				}
			}
		}

		// console.table(mapping)
		setState({ ...state, promotionData: mapping })
	}

	// useEffect(() => {
	// 	setState({
	// 		...state,
	// 		localState: Object.values(classes)
	// 			.filter(a => checkSpecialClass(a))
	// 			.sort((a, b) => b.classYear - a.classYear)
	// 	})
	// }, [classes])

	useEffect(() => {
		// if (sortedClasses.length > 0) {
		console.log('Calculating')
		calculatePromotionData(sortedClasses)
		// }
	}, [])

	useEffect(() => {
		if (Object.values(state.promotionData).length > 0) checkClassPromoted()
	}, [state.augmentedSections])

	const checkClassPromoted = () => {
		let promotionData = state.promotionData
		console.log('Check Class Running')
		// console.table(state.augmentedSections)

		Object.keys(promotionData).forEach(class_key => {
			let noOfPromotedSections = 0

			Object.keys(classes[class_key].sections).forEach(section_key => {
				let noOfSections = Object.keys(classes[class_key].sections).length
				if (state.augmentedSections[section_key].sectionPromoted) {
					console.log('TRUE')
					noOfPromotedSections = noOfPromotedSections + 1
				}
				if (noOfPromotedSections === noOfSections) {
					console.log(promotionData[class_key].name, ' is true')
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

		console.log(promotionData)
		console.table(state.augmentedSections)

		setState({ ...state, promotionData: promotionData })
	}

	const promoteSectionStudents = (fromkey: string, toKey: string, students: MISStudent[]) => {
		const studentsToPromote = students

		if (!studentsToPromote) {
			setState({
				...state,
				augmentedSections: {
					...state.augmentedSections,
					[fromkey]: {
						...state.augmentedSections[fromkey],
						sectionPromoted: true
					}
				}
			})
		}
		// const promotedStudents = (studentsToPromote ?? []).reduce<MISStudent[]>((agg, curr) => {
		// 	return [...agg, { ...curr, section_id: toKey }]
		// }, [])

		setState({
			...state,
			augmentedSections: {
				...state.augmentedSections,
				[fromkey]: {
					...state.augmentedSections[fromkey],
					sectionPromoted: true
				}
			},
			groupedStudents: { ...state.groupedStudents, [fromkey]: students }
		})
	}

	const checkEveryClassPromoted = () => {
		return Object.values(state.promotionData).every(entry => {
			if (!entry.promoted) {
				return false
			}
			return true
		})
	}

	const promoteAllStudents = () => {
		console.log(Object.entries(state.groupedStudents))

		const student_section_map: PromotionMap = Object.entries(
			state.groupedStudents ?? {}
		).reduce((agg, [sectionKey, groupedStudents]) => {
			const studentMap = (groupedStudents ?? []).reduce((agg, curr) => {
				return { ...agg, [curr.id]: { current: sectionKey, next: curr.section_id } }
			}, {})
			return { ...agg, ...studentMap }
		}, {})
		if (!Object.keys(state.augmentedSections).includes('mis_temp')) {
			console.log('Running This One')
			const TempSection: MISClass['sections'] = { ['mis_temp']: { name: 'TEMPORARY' } }
			const tempClass: MISClass = {
				...blankClass(),
				sections: TempSection,
				name: 'Class 10',
				classYear: 9999
			}
			console.table(getSectionsFromClasses({ ...classes, [tempClass.id]: tempClass }))
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

	const undoSectionPromotion = (fromkey: string) => {
		setState({
			...state,
			augmentedSections: {
				...state.augmentedSections,
				[fromkey]: {
					...state.augmentedSections[fromkey],
					sectionPromoted: false
				}
			},
			groupedStudents: {
				...state.groupedStudents,
				[fromkey]: orignal_grouped_students[fromkey]
			}
		})
	}

	return (
		<AppLayout title="Promote Students" showHeaderTitle>
			<div className="p-5 md:p-10 md:pt-5 md:pb-0 text-gray-700 relative">
				{state.displayWarning ? (
					<PromotionWarning
						onPress={() => setState({ ...state, displayWarning: false })}
					/>
				) : (
					<div className="flex flex-col flex-1">
						{Object.entries(state.promotionData ?? {}).map(
							([key, val]: [key: string, val: AugmentedClass]) => {
								return (
									<div className="lg:mx-28">
										<PromotionCard
											undoSectionPromotion={undoSectionPromotion}
											promotionData={state.promotionData}
											groupedStudents={state.groupedStudents}
											augmentedSections={state.augmentedSections}
											classKey={key}
											val={val}
											classes={classes}
											promoteSection={promoteSectionStudents}
											onToChange={(e: string) =>
												setState({
													...state,
													promotionData: {
														...state.promotionData,
														[key]: {
															...state.promotionData[key],
															toSection: state.augmentedSections[e]
														}
													}
												})
											}
											onFromChange={(e: string) =>
												setState({
													...state,
													promotionData: {
														...state.promotionData,
														[key]: {
															...state.promotionData[key],
															fromSection: state.augmentedSections[e]
														}
													}
												})
											}
										/>
									</div>
								)
							}
						)}
						<div
							onClick={() =>
								checkEveryClassPromoted()
									? setIsComponentVisible(true)
									: toast.error('All sections are not promoted yet')
							}
							className="flex flex-1 py-5 px-10 md:w-2/5 w-10/12 self-center rounded-md shadow-lg transform cursor-pointer hover:scale-105 transition-all  items-center justify-center bg-red-brand text-white mb-4 md:text-xl text-lg font-semibold">
							Close Promotions
						</div>
					</div>
				)}
			</div>
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
	promoteSection: (fromKey: string, toKey: string, students: MISStudent[]) => void
	augmentedSections: {
		[id: string]: ModifiedSection
	}
	val: AugmentedClass
	classes: {
		[id: string]: MISClass
	}
	groupedStudents: { [id: string]: MISStudent[] }
	promotionData: PromotionDataType
	undoSectionPromotion: (sectionKey: string) => void
}

const PromotionCard = ({
	classKey,
	val,
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

	useEffect(() => {
		setCardGroupedStudents({
			...groupedStudents,
			[val.fromSection.id]: (groupedStudents[val.fromSection.id] ?? []).map(student => {
				return { ...student, section_id: val.toSection.id }
			})
		})
	}, [groupedStudents, val.toSection, val.fromSection])

	const removeStudentFromPromotion = (sectionId: string, studentId: string) => {
		setCardGroupedStudents({
			...cardGroupedStudents,
			[sectionId]: cardGroupedStudents[sectionId].filter(student => student.id !== studentId)
		})
	}

	const changeStudentSection = (newSectionKey: string, studentKey: string) => {
		const newSection = cardGroupedStudents[val.fromSection.id].reduce((agg, student) => {
			if (student.id === studentKey) {
				return [...agg, { ...student, section_id: newSectionKey }]
			} else {
				return [...agg, student]
			}
		}, [] as MISStudent[])

		setCardGroupedStudents({
			...cardGroupedStudents,
			[val.fromSection.id]: newSection
		})

		// console.log(augmentedSections[newSectionKey].namespaced_name)
	}

	return (
		<>
			<div
				key={classKey + val.id}
				className="flex flex-row justify-between p-2 bg-gray-50 shadow-md border-gray-200 border mb-4 rounded-xl font-medium text-gray-600 lg:text-2xl lg:py-6 lg:px-10  ">
				<div key={classKey} className="flex flex-col w-2/5 lg:w-2/6">
					<h1>{classes[classKey].name}</h1>
					<select
						className="w-full rounded shadow tw-select text-teal-brand"
						onChange={e => onFromChange(e.target.value)}>
						{Object.entries(classes[classKey].sections).map(([key, section]) => {
							return (
								<option value={key}>
									{augmentedSections[key].namespaced_name}
								</option>
							)
						})}
					</select>
				</div>
				{augmentedSections[val.fromSection.id].sectionPromoted ? (
					<div className="flex flex-1 items-center justify-center flex-col">
						<div className="bg-green-brand items-center justify-center h-10 w-10 lg:h-14 lg:w-14 flex rounded-full">
							<ReplyIcon
								onClick={() => {
									if (checkPermissionToUndo(promotionData, val.id)) {
										undoSectionPromotion(val.fromSection.id)
									}
								}}
								color="white"
								className="h-8 lg:h-12 cursor-pointer"
							/>
						</div>
						<div
							onClick={() => {
								if (checkPermissionToUndo(promotionData, val.id)) {
									undoSectionPromotion(val.fromSection.id)
								}
							}}
							className="font-light cursor-pointer underline text-red-brand mt-2 md:text-lg text-sm">
							Undo
						</div>
					</div>
				) : (
					<div
						key={val.id + classKey}
						className="flex flex-1  text-black font-normal justify-center items-center flex-col w-2/6 md:px-0 px-3">
						Move To
						<div
							onClick={() => {
								if (checkPermissionToPromote(promotionData, val.id)) {
									setVisible(val => !val)
									// console.table(promotionData)
									console.table(groupedStudents)
								} else {
									//alert('No Permission')
								}
							}}
							className="rounded-full cursor-pointer bg-blue-brand p-1 px-7 md:px-24 ">
							<ArrowNarrowRightIcon className="md:h-12 h-6 text-white" />
						</div>
					</div>
				)}
				<div key={val.id} className="flex items-end flex-col w-2/5 lg:w-2/6">
					<h1>{val.name}</h1>
					<select
						className="w-full rounded shadow tw-select text-teal-brand"
						onChange={e => onToChange(e.target.value)}>
						{Object.entries(val.sections).map(([key, section]) => {
							return (
								<option value={key}>
									{key === 'mis_temp'
										? section.name
										: augmentedSections[key].namespaced_name}
								</option>
							)
						})}
					</select>
				</div>
			</div>
			<PromotableStudents
				classKey={val.id}
				changeStudentSection={changeStudentSection}
				fromSectionName={augmentedSections[val.fromSection.id].namespaced_name}
				fromSectionKey={val.fromSection.id}
				toSectionKey={val.toSection.id}
				groupedStudents={cardGroupedStudents}
				onClickCallback={(fromKey: string, toKey: string, students: MISStudent[]) => {
					promoteSection(fromKey, toKey, students)
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
	onClickCallback: (fromSectionKey: string, toKey: string, students: MISStudent[]) => void
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
						<div className="md:bg-gray-200 bg-gray-50 text-lg flex-col md:flex-row mb-3 items-center flex justify-between px-5 md:px-10 py-3 md:py-7 rounded-md border-gray-200 border shadow-md md:shadow-none md:rounded-sm font-medium">
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
											.map(([key, section]) => {
												return (
													<option value={key}>
														{section.namespaced_name}
													</option>
												)
											})}
									</select>
								</div>
								<div className="flex md:flex-1 w-1/3 justify-end items-end  flex-row">
									<TrashIcon
										onClick={() =>
											removeStudentFromPromotion(fromSectionKey, student.id)
										}
										color="red"
										className="cursor-pointer h-6 w-6"
									/>
								</div>
							</div>
						</div>
					)
				})}
				<div
					className="bg-green-brand px-10 py-4 w-2/5 flex text-base items-center justify-center text-white font-semibold rounded-md self-center cursor-pointer"
					onClick={() => {
						setIsComponentVisible(true)
					}}>
					Confirm
				</div>
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
									className="w-5/12 p-2 md:p-2 lg:p-3 border-none bg-blue-brand text-white rounded-lg outline-none font-bold text-sm md:text-base lg:text-xl"
									onClick={() => setIsComponentVisible(false)}>
									Go Back
								</button>
								<button
									className="w-5/12 p-2 md:p-2 lg:p-3 border-none bg-green-brand text-white rounded-lg outline-none font-bold text-sm md:text-base lg:text-xl"
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
			<p
				onClick={() => onPress()}
				className=" bg-blue-brand cursor-pointer text-white text-center items-center justify-center px-6 py-3 rounded-xl text-lg font-semibold ">
				Ok, I understand
			</p>
		</div>
	)
}
function checkSpecialClass(a: MISClass): boolean {
	return !(
		'alevel' === a.name.replace(/[^A-Z0-9]+/gi, '').toLowerCase() ||
		'olevel' === a.name.replace(/[^A-Z0-9]+/gi, '').toLowerCase()
	)
}

function checkPermissionToPromote(promotionData: PromotionDataType, id: string) {
	let data = Object.values(promotionData)
	let index = data.findIndex(val => val.id === id)
	// console.log(index)

	if (index === 0) return true

	index = index - 1

	if (!data[index].promoted) {
		toast.error('Promote higher classes first')
		return false
	}

	return true
}

function checkPermissionToUndo(promotionData: PromotionDataType, id: string) {
	let data = Object.values(promotionData)
	let index = data.findIndex(val => val.id === id)
	// console.log(index)

	if (index === data.length - 1) return true

	index = index + 1

	if (data[index].promoted) {
		toast.error('Undo lower classes first')
		return false
	}

	return true
}
