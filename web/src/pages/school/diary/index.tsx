import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import moment from 'moment'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeftIcon, ClipboardCopyIcon, LinkIcon } from '@heroicons/react/outline'

import getSectionFromId from 'utils/getSectionFromId'
import LessonModal from './lessonModal'
import DiaryPrintable from 'components/Printable/Diary/diary'
import { addDiary, logSms } from 'actions'
import { TModal } from 'components/Modal'
import { smsIntentLink } from 'utils/intent'
import { fetchLessons, sendBatchSMS } from 'actions/core'
import { replaceSpecialCharsWithUTFChars } from 'utils/stringHelper'
import { AppLayout } from 'components/Layout/appLayout'
import { isMobile } from 'utils/helpers'
import { isValidStudent, classYearSorter } from 'utils'

interface S {
	selectedDate: string
	classId: string
	sectionId: string
	diary: MISDiary['']['']
	studentsFilter: '' | 'All Students' | 'Present Students' | 'Absent Students' | 'Leave Students'
}

const Diary: React.FC = () => {
	// Todo:  Need to test If real time syncing works correctly

	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(fetchLessons())
	}, [])

	const { classes, diary, students, settings, ilmx } = useSelector(
		(state: RootReducerState) => state.db
	)
	const { faculty_id } = useSelector((state: RootReducerState) => state.auth)
	const { isLoading } = useSelector((state: RootReducerState) => state.ilmxLessons)

	const [state, setState] = useState<S>({
		selectedDate: moment().format('YYYY-MM-DD'),
		classId: '',
		sectionId: '',
		diary: {},
		studentsFilter: 'All Students'
	})
	const [smsModalVisible, setSmsModalVisible] = useState(false)
	const [lessonModalVisible, setLessonModalVisible] = useState(false)
	const [duplicateDiary, setDuplicateDiary] = useState({
		from: '',
		isDone: false
	})

	const smsOptions: Array<S['studentsFilter']> = [
		'All Students',
		'Present Students',
		'Absent Students',
		'Leave Students'
	]

	const currentDate = moment(state.selectedDate, 'YYYY-MM-DD').format('DD-MM-YYYY')

	useEffect(() => {
		if (state.classId !== '' && state.sectionId !== '') {
			const currDiary = diary[currentDate]?.[state.sectionId] ?? {}

			setState({
				...state,
				diary: {
					...currDiary,
					...state.diary
				}
			})
		}
	}, [currentDate, state.classId, state.sectionId])

	const onSave = () => {
		// Only Saving modified section subjects for selected date rather then the whole section's diary
		const currDiary = Object.entries(state.diary)
			.filter(([subject, { homework }]) => {
				return diary[currentDate]?.[state.sectionId]
					? diary[currentDate][state.sectionId][subject]
						? diary[currentDate][state.sectionId][subject].homework !== homework
						: true
					: homework !== ''
			})
			.reduce((agg, [subject, homework]) => {
				return {
					...agg,
					[subject]: homework
				}
			}, {})

		dispatch(addDiary(currentDate, state.sectionId, currDiary))
		toast.success('Diary has been saved')
	}

	const getSelectedSectionName = (): string => {
		const section = getSectionFromId(state.sectionId, classes)
		return section && section.namespaced_name ? section.namespaced_name : ''
	}

	const diaryString = (): string => {
		if (state.sectionId === '' || state.diary[state.sectionId] === undefined) {
			console.log('Not running diary')
			return ''
		}

		const currDate = `Date: ${moment(state.selectedDate, 'YYYY-MM-DD').format(
			'DD MMMM YYYY'
		)}\n`
		const sectionName = `Class: ${getSelectedSectionName()}\n`
		const diary_message = Object.entries(state.diary).map(
			([subject, { homework }]) => `${subject}: ${homework}`
		)
		const raw_diary_string = currDate + sectionName + diary_message.join('\n')
		const diary_string = replaceSpecialCharsWithUTFChars(raw_diary_string)

		return diary_string
	}

	const getSelectedSectionStudents = () => {
		return Object.values(students).filter(
			s => isValidStudent(s, { active: true }) && s.section_id === state.sectionId && s.Phone
		)
	}

	const getFilterCondition = (student: MISStudent) => {
		const { selectedDate, studentsFilter } = state

		const { status } = student?.attendance?.[selectedDate] ?? { status: '' }

		switch (studentsFilter) {
			case 'Absent Students':
				return status === 'ABSENT'
			case 'Leave Students':
				return (
					status === 'LEAVE' ||
					status === 'SHORT_LEAVE' ||
					status === 'SICK_LEAVE' ||
					status === 'CASUAL_LEAVE'
				)
			case 'Present Students':
				return status === 'PRESENT'
			case 'All Students':
				return true
		}
	}

	const getMessages = (): MISSms[] => {
		const diary = diaryString()
		const selectedStudents = getSelectedSectionStudents().filter(student =>
			getFilterCondition(student)
		)

		const messages = selectedStudents.reduce((agg, student) => {
			const index = agg.findIndex(s => s.number === student.Phone)

			if (index >= 0) {
				return agg
			}

			return [
				...agg,
				{
					number: student.Phone,
					text: diary
				}
			]
		}, [])

		return messages
	}

	const logMessages = (messages: MISSms[]) => {
		if (messages.length === 0) {
			console.log('No Messaged to Log')
			return
		}

		const historyObj = {
			faculty: faculty_id,
			date: new Date().getTime(),
			type: 'DIARY',
			count: messages.length
		}

		dispatch(logSms(historyObj))
	}

	const getSelectedSectionDiary = () => {
		return Object.entries(state.diary ?? {}).reduce((agg, [subject, { homework }]) => {
			return {
				...agg,
				[subject]: homework
			}
		}, {} as { [id: string]: string })
	}

	const messages = getMessages()

	const copyDiaryFromSection = () => {
		if (duplicateDiary.from === '') {
			toast.error('Please select a section to copy from')
			return
		}

		const diaryFromId =
			diary[moment(state.selectedDate, 'YYYY-MM-DD').format('DD-MM-YYYY')]?.[
			duplicateDiary.from
			] ?? {}

		setState({
			...state,
			diary: {
				...state.diary,
				...diaryFromId
			}
		})

		setDuplicateDiary({
			...duplicateDiary,
			isDone: true
		})

		toast.success('Copied Succesfully')
	}

	const isSectionSelected = state.classId && state.sectionId

	return (
		<AppLayout title={'Manage Diary'} showHeaderTitle>
			<div className="flex flex-col items-center m-5 md:mb-0 p-5 md:p-10 md:pt-5 bg-gray-700 rounded-2xl md:w-4/5 md:mx-auto md:bg-transparent md:h-screen">
				<div className="flex flex-col w-full justify-center md:flex-row md:h-3/4 md:space-x-4 text-white">
					<div className="flex flex-col w-full print:hidden md:bg-gray-700 md:p-5 md:rounded-2xl md:w-1/2 space-y-2 md:space-y-4">
						<div className="flex flex-row w-full justify-between">
							<div className="flex flex-col w-1/2 mr-2 space-y-2 md:space-y-4">
								<label htmlFor="diary-date">Date</label>
								<input
									id="diary-date"
									className="px-1 tw-input w-full tw-is-form-bg-black"
									type="date"
									value={state.selectedDate}
									onChange={e =>
										setState({ ...state, selectedDate: e.target.value })
									}
								/>
							</div>

							<div className="flex flex-col w-1/2 space-y-2 md:space-y-4">
								<label htmlFor="class-id">Class</label>
								<select
									id="class-id"
									className="tw-select w-full"
									onChange={e => setState({ ...state, classId: e.target.value })}>
									<option value=""> Select Class</option>
									{Object.values(classes)
										.sort(classYearSorter)
										.map(c => (
											<option key={c.id} value={c.id}>
												{c.name}
											</option>
										))}
								</select>
							</div>
						</div>

						{state.classId && (
							<div className="flex flex-col w-full space-y-2 md:space-y-4">
								<label htmlFor="section-id">Sections</label>
								<select
									id="section-id"
									className="tw-select"
									onChange={e =>
										setState({ ...state, sectionId: e.target.value })
									}>
									<option value={''}>Select</option>
									{Object.entries(classes[state.classId].sections ?? {}).map(
										([id, s]) => (
											<option key={id} value={id}>
												{s.name}
											</option>
										)
									)}
								</select>
							</div>
						)}

						{isSectionSelected && (
							<div className="flex justify-between items-center w-full py-4">
								<label htmlFor="duplicate-diary">Copy From</label>
								<select
									id="duplicate-diary"
									className="tw-select text-gray-700"
									onChange={e =>
										setDuplicateDiary({
											...duplicateDiary,
											from: e.target.value
										})
									}
									value={duplicateDiary.from}>
									<option value="">Select Section</option>
									{Object.entries(classes[state.classId].sections ?? {})
										.filter(([id, s]) => state.sectionId !== id)
										.map(([id, s]) => (
											<option key={`copy-${id}`} value={id}>
												{s.name}
											</option>
										))}
								</select>

								<ClipboardCopyIcon
									className="text-white h-10 w-10 p-2 bg-blue-brand rounded-full cursor-pointer"
									onClick={() => copyDiaryFromSection()}
								/>
							</div>
						)}
					</div>

					{isSectionSelected && (
						<div className="flex flex-col w-full print:hidden md:bg-gray-700 md:p-5 md:rounded-2xl md:w-1/2 md:overflow-y-auto space-y-2">
							<div>Subjects</div>
							{Object.keys(classes[state.classId].subjects ?? {})
								.sort()
								.map(s => (
									<div
										key={s}
										className="flex flex-wrap w-full justify-between flex-row items-center space-y-2 md:flex-nowrap">
										<p className="px-2 py-1 md:py-2 bg-teal-brand text-white rounded-3xl order-1 w-40 md:w-60 min-w-min text-sm text-center border border-white md:order-none">
											{s}
										</p>
										<input
											className="tw-input tw-is-bg-form-black order-3 w-full md:order-none md:mx-2 bg-transparent"
											type="text"
											placeholder="Write diary here"
											onChange={e =>
												setState({
													...state,
													diary: {
														...state.diary,
														[s]: { homework: e.target.value }
													}
												})
											}
											value={state.diary[s]?.homework ?? ''}
										/>
										<div
											className="focus:shadow-outline text-white rounded-full shadow-sm p-2 bg-blue cursor-pointer order-2 md:order-none"
											onClick={() => setLessonModalVisible(true)}>
											<LinkIcon className="w-4 md:w-6 cursor-pointer" />
										</div>
									</div>
								))}
						</div>
					)}
				</div>

				{smsModalVisible && (
					<TModal>
						<div className="bg-white p-8 w-full rounded-2xl">
							<div className="flex items-center my-2">
								<div
									className="focus:shadow-outline text-red-brand rounded-full shadow-sm p-2 border border-gray-200 bg-white cursor-pointer"
									onClick={() => setSmsModalVisible(false)}>
									<ArrowLeftIcon className="w-6" />
								</div>
								<div className=" ml-4 justify-start">Select Diary Options</div>
							</div>
							<div className="text-lg">Send To*</div>

							{smsOptions.map(opt => (
								<div key={opt} className="flex items-center justify-start my-2">
									<input
										className="tw-checkbox form-checkbox"
										type="checkbox"
										onChange={() =>
											setState({
												...state,
												studentsFilter: opt
											})
										}
										checked={state.studentsFilter === opt}
									/>
									<div className="ml-2 text-sm">{opt}</div>
								</div>
							))}

							<div className="row">
								{settings.sendSMSOption === 'SIM' ? (
									<a
										className="tw-btn-blue my-2 w-full text-center"
										href={smsIntentLink({
											messages,
											return_link: window.location.href
										})}
										onClick={() => logMessages(messages)}>
										Send Using Local Sim
									</a>
								) : (
									<div
										className="tw-btn-blue my-2 w-full text-center"
										onClick={() => dispatch(sendBatchSMS(messages))}
										style={{ width: '20%' }}>
										Send
									</div>
								)}
							</div>
						</div>
					</TModal>
				)}

				{lessonModalVisible && (
					<TModal>
						<LessonModal
							onClose={() => setLessonModalVisible(false)}
							lessons={ilmx.lessons as IlmxLessonVideos}
							isLoading={isLoading}
						/>
					</TModal>
				)}

				{isSectionSelected && (
					<DiaryPrintable
						schoolName={settings.schoolName}
						sectionName={getSelectedSectionName()}
						diaryDate={moment(state.selectedDate, 'YYYY-MM-DD').format('DD, MMMM YYYY')}
						schoolDiary={getSelectedSectionDiary()}
					/>
				)}

				<div className="flex flex-row w-full text-center print:hidden space-x-2 mt-4">
					<button
						className={clsx('tw-btn-blue flex-grow', {
							'bg-gray-300': !isSectionSelected
						})}
						onClick={() => window.print()}
						disabled={!isSectionSelected}>
						Print
					</button>
					<button
						className={clsx('tw-btn-blue flex-grow', {
							'bg-gray-300': !isSectionSelected
						})}
						onClick={onSave}
						disabled={!isSectionSelected}>
						Save
					</button>
					<button
						className={clsx('tw-btn-blue flex-grow', {
							'bg-gray-300': !isSectionSelected || !isMobile()
						})}
						onClick={() => setSmsModalVisible(true)}
						disabled={!isSectionSelected || !isMobile()}>
						Send SMS
					</button>
				</div>
			</div>
		</AppLayout>
	)
}

export default Diary
