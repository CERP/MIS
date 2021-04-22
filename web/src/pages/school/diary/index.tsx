import React, { useEffect, useState } from 'react'
import { AppLayout } from 'components/Layout/appLayout'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'

import { addDiary, logSms } from 'actions'
import { TModal } from 'components/Modal'
import { replaceSpecialCharsWithUTFChars } from 'utils/stringHelper'
import getSectionFromId from 'utils/getSectionFromId'
import { smsIntentLink } from 'utils/intent'
// import ShareButton from 'components/ShareButton'
import LessonModal from './lessonModal'
import { fetchLessons, sendBatchSMS } from 'actions/core'
import DiaryPrintable from 'components/Printable/Diary/diary'
import toast from 'react-hot-toast'
import { BackArrowIcon, ChainLinkIcon, CopyIcon } from '../assets/svgs'

interface S {
	selectedDate: string
	classId: string
	sectionId: string
	diary: MISDiary['']['']
	studentsFilter: '' | 'All Students' | 'Present Students' | 'Absent Students' | 'Leave Students'
}

const Diary: React.FC = () => {
	/**
	 *  Need to Test If real time syncing works correctly
	 */

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

	useEffect(() => {
		if (state.classId !== '' && state.sectionId !== '') {
			const currDiary =
				diary[moment(state.selectedDate, 'YYYY-MM-DD').format('DD-MM-YYYY')]?.[
				state.sectionId
				] || {}

			setState({
				...state,
				diary: {
					...currDiary,
					...state.diary
				}
			})
		}
	}, [state.selectedDate, state.classId, state.sectionId])

	const onSave = () => {
		// Only Saving modified section subjects for selected date rather then the whole section's diary
		const currDate = moment(state.selectedDate, 'YYYY-MM-DD').format('DD-MM-YYYY')
		const currDiary = Object.entries(state.diary)
			.filter(([subject, { homework }]) => {
				return diary[currDate] && diary[currDate][state.sectionId]
					? diary[currDate][state.sectionId][subject]
						? diary[currDate][state.sectionId][subject].homework !== homework
						: true
					: homework !== ''
			})
			.reduce((agg, [subject, homework]) => {
				return {
					...agg,
					[subject]: homework
				}
			}, {})

		dispatch(addDiary(currDate, state.sectionId, currDiary))
		toast.success('Saved')
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
			s =>
				s.Name &&
				s.Active &&
				s.section_id &&
				s.section_id === state.sectionId &&
				(s.tags === undefined || !s.tags['PROSPECTIVE']) &&
				s.Phone !== undefined &&
				s.Phone !== ''
		)
	}

	const getFilterCondition = (student: MISStudent) => {
		const { selectedDate, studentsFilter } = state
		const { status } = (student.attendance && student.attendance[selectedDate]) || {
			status: ''
		}

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
		return Object.entries(state.diary || {}).reduce((agg, [subject, { homework }]) => {
			return {
				...agg,
				[subject]: homework
			}
		}, {} as { [id: string]: string })
	}

	const isSectionSelected = () => state.classId !== '' && state.sectionId !== ''
	const messages = getMessages()

	const copyDiaryFromSection = () => {
		if (duplicateDiary.from === '') {
			toast.error('Please select a section to copy from')
			return
		}

		const diaryFromId =
			diary[moment(state.selectedDate, 'YYYY-MM-DD').format('DD-MM-YYYY')]?.[
			duplicateDiary.from
			] || {}

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

	return (
		<AppLayout title={'Diary'}>
			<div className="flex flex-col items-center my-10 mx-5 p-5 bg-gray-700 text-white rounded-2xl lg:w-4/5 lg:mx-auto lg:bg-transparent lg:h-screen">
				<div className="text-l text-center print:hidden lg:text-3xl lg:text-black">
					Enter detail of Diary
				</div>

				<div className="flex flex-col w-full lg:flex-row lg:h-3/4">
					<div className="flex flex-col w-full print:hidden lg:bg-gray-700 lg:p-5 lg:rounded-2xl lg:m-5 lg:w-1/2">
						<div className="flex flex-row w-full justify-between">
							<div className="flex flex-col w-1/2 mr-2">
								<div className="text-xl my-4 w-full">Date</div>
								<input
									className="px-4 py-2 mr-2 bg-gray-700 border rounded-md border-gray-300 focus:border-blue-300 text-sm lg:p-6 w-full"
									type="date"
									value={state.selectedDate}
									onChange={e =>
										setState({ ...state, selectedDate: e.target.value })
									}
								/>
							</div>
							<div className="flex flex-col w-1/2">
								<div className="text-xl my-4 w-full">Class</div>
								<select
									className="px-4 py-2 bg-gray-700 border rounded-md border-gray-300 focus:border-blue-300 text-sm lg:p-6 w-full"
									onChange={e => setState({ ...state, classId: e.target.value })}>
									<option value=""> Select </option>
									{Object.values(classes).map(c => (
										<option key={c.id} value={c.id}>
											{c.name}
										</option>
									))}
								</select>
							</div>
						</div>
						{state.classId && (
							<div className="flex flex-col w-full">
								<div className="text-xl my-4">Section's</div>
								<select
									className="pl-3 pr-10 py-2 bg-gray-700 border rounded-md border-gray-300 focus:border-blue-300 text-sm lg:p-6"
									onChange={e =>
										setState({ ...state, sectionId: e.target.value })
									}>
									<option value="">Select</option>
									{Object.entries(classes[state.classId].sections || {}).map(
										([id, s]) => (
											<option key={id} value={id}>
												{s.name}
											</option>
										)
									)}
								</select>
							</div>
						)}

						{isSectionSelected() && (
							<div className="flex justify-between w-full p-1 my-2 md:p-2">
								<div className="text-sm bg-blue rounded-2xl border px-2 text-center">
									Copy From
								</div>
								<div className="flex">
									<select
										className="border rounded-md bg-gray-700 focus:border-blue-300 text-sm p-1"
										onChange={e =>
											setDuplicateDiary({
												...duplicateDiary,
												from: e.target.value
											})
										}
										value={duplicateDiary.from}>
										<option value="">Select</option>
										{Object.entries(classes[state.classId].sections || {})
											.filter(([id, s]) => state.sectionId !== id)
											.map(([id, s]) => (
												<option key={`copy-${id}`} value={id}>
													{s.name}
												</option>
											))}
									</select>
									<div
										className="focus:shadow-outline text-white rounded-full shadow-sm p-2 bg-blue cursor-pointer order-2 md:order-none ml-2"
										onClick={() => copyDiaryFromSection()}>
										<CopyIcon className="w-4" />
									</div>
								</div>
							</div>
						)}
					</div>

					{isSectionSelected() && (
						<div className="flex flex-col w-full print:hidden md:bg-gray-700 lg:p-5 lg:rounded-2xl lg:m-5 lg:w-1 /2 lg:overflow-y-auto">
							<div className="text-xl my-2">Subject</div>
							{Object.keys(classes[state.classId].subjects || {}).map(s => (
								<div
									key={s}
									className="flex flex-wrap w-full justify-between items-center my-2 lg:flex-nowrap">
									<div className="p-1 my-2 md:p-2 bg-teal-brand text-white rounded-3xl order-1 w-1/4 min-w-min text-center border border-white md:order-none">
										{s}
									</div>
									<input
										className="tw-input bg-gray-700 order-3 w-full lg:order-none lg:mx-2"
										type="text"
										placeholder="Write Diary Here"
										onChange={e =>
											setState({
												...state,
												diary: {
													...state.diary,
													[s]: { homework: e.target.value }
												}
											})
										}
										value={state.diary[s]?.homework || ''}
									/>
									<div
										className="focus:shadow-outline text-white rounded-full shadow-sm p-2 bg-blue cursor-pointer order-2 lg:order-none"
										onClick={() => setLessonModalVisible(true)}>
										<ChainLinkIcon className="w-4 lg:w-6" />
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
									<BackArrowIcon className="w-6" />
								</div>
								<div className="text-xl ml-4 justify-start">
									Select Diary Options
								</div>
							</div>
							<div className="text-l">Send To*</div>

							{smsOptions.map(opt => (
								<div key={opt} className="flex items-center justify-start my-2">
									<input
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
								{/* <div className="md:hidden" style={{ marginTop: 10 }}>
									<ShareButton title={'School Diary'} text={diaryString()} />
								</div> */}
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

				{isSectionSelected() && (
					<DiaryPrintable
						schoolName={settings.schoolName}
						sectionName={getSelectedSectionName()}
						diaryDate={moment(state.selectedDate, 'YYYY-MM-DD').format('DD, MMMM YYYY')}
						schoolDiary={getSelectedSectionDiary()}
					/>
				)}

				<div className="flex flex-row w-full py-2 text-center print:hidden">
					<button
						className={`tw-btn-blue ${!isSectionSelected() && 'bg-gray-300'} flex-grow`}
						onClick={() => window.print()}
						disabled={!isSectionSelected()}>
						Print
					</button>
					<button
						className={`tw-btn-blue ${!isSectionSelected() && 'bg-gray-300'
							} flex-grow mx-2`}
						onClick={onSave}
						disabled={!isSectionSelected()}>
						Save
					</button>
					<button
						className={`tw-btn-blue ${!isSectionSelected() && 'bg-gray-300'} flex-grow`}
						onClick={() => setSmsModalVisible(true)}
						disabled={!isSectionSelected()}>
						Send SMS
					</button>
				</div>
			</div>
		</AppLayout>
	)
}

export default Diary
