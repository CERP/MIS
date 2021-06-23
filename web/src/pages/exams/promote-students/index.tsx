import React, { Fragment, useState, useEffect } from 'react'

import { AppLayout } from 'components/Layout/appLayout'
import { useDispatch, useSelector } from 'react-redux'
import { blankClass } from 'constants/form-defaults'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import { ArrowNarrowRightIcon, ExclamationCircleIcon, TrashIcon } from '@heroicons/react/outline'
import moment from 'moment'
import { isValidStudent } from 'utils'
import { useComponentVisible } from 'hooks/useComponentVisible'
import { Transition } from '@headlessui/react'
import toast from 'react-hot-toast'
import { TModal } from 'components/Modal'
import { createEditClass, promoteStudents } from 'actions'
import { useHistory } from 'react-router'

type AugmentedClass = MISClass & {
	fromSection?: Partial<ModifiedSection>
	toSection?: Partial<ModifiedSection>
	promoted?: boolean
}

type PromotionDataType = {
	[id: string]: AugmentedClass
}

type State = {
	// localState: Array<MISClass>
	promotionData: PromotionDataType
	displayWarning: boolean
	groupedStudents: {
		[section_id: string]: Array<MISStudent>
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

	// useEffect(() => {
	// 	setState(initialState)

	// 	return () => {
	// 		setState({
	// 			displayWarning: true,
	// 			localState: [],
	// 			promotionData: {},
	// 			groupedStudents: {},
	// 			augmentedSections: {}
	// 		})
	// 	}
	// }, [])

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

		// console.table(state.augmentedSections)

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
				}
			})
			noOfPromotedSections = 0
		})

		setState({ ...state, promotionData: promotionData })
	}

	const promoteSectionStudents = (fromkey: string, toKey: string) => {
		const studentsToPromote = state.groupedStudents[fromkey]

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
		const promotedStudents = (studentsToPromote ?? []).reduce<MISStudent[]>((agg, curr) => {
			return [...agg, { ...curr, section_id: toKey }]
		}, [])

		setState({
			...state,
			augmentedSections: {
				...state.augmentedSections,
				[fromkey]: {
					...state.augmentedSections[fromkey],
					sectionPromoted: true
				}
			},
			groupedStudents: { ...state.groupedStudents, [fromkey]: promotedStudents }
		})
	}

	// console.log('students', students)
	// console.log('classes', classes)
	// console.log(state.groupedStudents)

	// console.log(
	// 	'see count',
	// 	Object.values(students).filter(s => s.section_id === 'cc5a4298-1d65-4257-bd90-59edd43cae01')
	// )

	const checkEveryClassPromoted = () => {
		return Object.values(state.promotionData).every(entry => {
			if (!entry.promoted) {
				return false
			}
			return true
		})
	}

	type PromotionMap = {
		[student_id: string]: {
			current: string
			next: string
		}
	}
	const promoteAllStudents = () => {
		console.log(Object.entries(state.groupedStudents))

		const student_section_map: PromotionMap = Object.entries(state.groupedStudents).reduce(
			(agg, [sectionKey, groupedStudents]) => {
				const studentMap = groupedStudents.reduce((agg, curr) => {
					return { ...agg, [curr.id]: { current: sectionKey, next: curr.section_id } }
				}, {})
				return { ...agg, ...studentMap }
			},
			{}
		)
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

		// setTimeout(() => {
		// 	history.goBack()
		// }, 1500)
	}

	const removeStudentFromPromotion = (sectionId: string, studentId: string) => {
		// console.log(sectionId)
		// console.log(state.groupedStudents)
		setState({
			...state,
			groupedStudents: {
				...state.groupedStudents,
				[sectionId]: state.groupedStudents[sectionId].filter(
					student => student.id !== studentId
				)
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
											removeStudentFromPromotion={removeStudentFromPromotion}
											promotionData={state.promotionData}
											groupedStudents={state.groupedStudents}
											augmentedSections={state.augmentedSections}
											sectionkey={key}
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
							onClick={() => {
								if (checkEveryClassPromoted()) {
									setIsComponentVisible(true)
								} else {
									toast.error('Sections Remaining')
								}
							}}
							className="flex flex-1 py-5 px-10 w-2/5 self-center rounded-md shadow-lg transform cursor-pointer hover:scale-105 transition-all  items-center justify-center bg-blue-brand text-white text-xl font-semibold">
							Confirm Promotions
						</div>
					</div>
				)}
			</div>
			{isComponentVisible && (
				<TModal>
					<div ref={ref} className="bg-white pb-3">
						<div className="text-center p-3 md:p-4 lg:p-5 rounded-md text-sm md:text-base lg:text-xl font-bold">
							Are you sure you want to promote these students? This action is
							irreversable.
						</div>
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
	sectionkey: string
	onFromChange: (id: string) => void
	onToChange: (id: string) => void
	promoteSection: (fromKey: string, toKey: string) => void
	augmentedSections: {
		[id: string]: ModifiedSection
	}
	val: AugmentedClass
	classes: {
		[id: string]: MISClass
	}
	groupedStudents: { [id: string]: MISStudent[] }
	promotionData: PromotionDataType
	removeStudentFromPromotion: (sectionId: string, studentId: string) => void
}

const PromotionCard = ({
	sectionkey,
	val,
	classes,
	onFromChange,
	onToChange,
	augmentedSections,
	promoteSection,
	groupedStudents,
	promotionData,
	removeStudentFromPromotion
}: PromotionCardProps) => {
	const [visible, setVisible] = useState(false)
	return (
		<>
			<div
				key={sectionkey + val.id}
				className="flex flex-row justify-between p-2 bg-gray-50 shadow-md border-gray-200 border mb-4 rounded-xl font-medium text-gray-600 lg:text-2xl lg:py-6 lg:px-10  ">
				<div key={sectionkey} className="flex flex-col w-2/5 lg:w-2/6">
					<h1>{classes[sectionkey].name}</h1>
					<select
						className="w-full lg:w-3/6 rounded shadow tw-select text-teal-brand"
						onChange={e => onFromChange(e.target.value)}>
						{Object.entries(classes[sectionkey].sections).map(([key, section]) => {
							return (
								<option value={key}>
									{augmentedSections[key].namespaced_name}
								</option>
							)
						})}
					</select>
				</div>
				<div
					key={val.id + sectionkey}
					className="hidden md:flex flex-1  text-black font-normal justify-center items-center flex-col lg:w-2/6">
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
						className="rounded-full cursor-pointer bg-blue-brand p-1 px-24 mx-4">
						<ArrowNarrowRightIcon className="h-12  text-white" />
					</div>
				</div>
				<div key={val.id} className="flex items-end flex-col w-2/5 lg:w-2/6">
					<h1>{val.name}</h1>
					<select
						className="w-full lg:w-3/6 rounded shadow tw-select text-teal-brand"
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
				fromSectionKey={val.fromSection.id}
				toSectionKey={val.toSection.id}
				groupedStudents={groupedStudents}
				onClickCallback={promoteSection}
				removeStudentFromPromotion={removeStudentFromPromotion}
				visible={visible}
			/>
		</>
	)
}

type PromotableStudentProps = {
	fromSectionKey: string
	toSectionKey: string
	groupedStudents: State['groupedStudents']
	onClickCallback: (fromSectionKey: string, toSectionKey: string) => void
	removeStudentFromPromotion: (sectionId: string, studentId: string) => void
	visible: boolean
}

type PromotableStudentsState = {
	students: MISStudent[]
}
const PromotableStudents = ({
	fromSectionKey,
	toSectionKey,
	groupedStudents,
	onClickCallback,
	removeStudentFromPromotion,
	visible
}: PromotableStudentProps) => {
	const [state, setState] = useState<PromotableStudentsState>({
		students: []
	})

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
				<div className="text-lg flex-row flex justify-between px-10 py-2 bg-gray-700 text-white rounded-md font-medium">
					<h1>Name</h1>
					<h1>Remove Promotion</h1>
				</div>
				{(state.students || []).map(student => {
					return (
						<div className="bg-gray-200 text-lg flex-row mb-3 flex justify-between px-10 py-7 rounded-sm font-medium">
							<h1>{student.Name}</h1>
							<TrashIcon
								onClick={() =>
									removeStudentFromPromotion(fromSectionKey, student.id)
								}
								color="red"
								className="cursor-pointer h-6 w-6"
							/>
						</div>
					)
				})}
				<div
					className="bg-blue-brand px-10 py-4 w-2/5 flex items-center justify-center text-white font-semibold rounded-md self-center cursor-pointer"
					onClick={() => {
						// console.log('Section Key', fromSectionKey)
						onClickCallback(fromSectionKey, toSectionKey)
					}}>
					Click to promote
				</div>
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
			<div className="w-32 h-32 rounded-full items-center justify-center flex text-6xl bg-blue-brand text-center text-white mt-10">
				!
			</div>
			<div className="font-bold mt-8 mb-4">You are going to </div>
			<div className="font-semibold text-3xl text-blue-brand">Open Promotions</div>
			<div className="font-normal my-4 text-lg text-center">
				You can promote a class only once per academic year
			</div>
			<div
				onClick={() => onPress()}
				className=" bg-blue-brand cursor-pointer text-white text-center items-center justify-center px-6 py-3 rounded-xl text-lg font-semibold ">
				Ok, I understand
			</div>
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
