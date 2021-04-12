import React, { useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { ExclamationIcon } from '@heroicons/react/solid'
import { SelectorIcon, UserIcon, XCircleIcon } from '@heroicons/react/outline'

import { CustomSelect } from 'components/select'
import { AppLayout } from 'components/Layout/appLayout'
import { StaffDropdownSearch, StudentDropdownSearch } from 'components/input/search'
import { logSms } from 'actions'
import { isValidStudent, isValidTeacher } from 'utils'
import { replaceSpecialCharsWithUTFChars } from 'utils/stringHelper'
import { isMobile, isValidPhone } from 'utils/helpers'
import { smsIntentLink } from 'utils/intent'
import toTitleCase from 'utils/toTitleCase'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import { NotPaidMonthDuration, ToFeeDefaulters } from './to-fee-defaulters'

enum SendSmsOptions {
	TO_SINGLE_STUDENT,
	// TO_ALL_STUDENTS,
	TO_SINGLE_STAFF,
	TO_ALL_STAFF,
	TO_SINGLE_SECTION,
	TO_FEE_DEFAULTERS
}

const SmsRecipient = {
	0: 'Single Student',
	// 1: 'All Students',
	1: 'Single Staff',
	2: 'All Staff',
	3: 'Single Section',
	4: 'Fee Defaulters'
}

type State = {
	sendTo: SendSmsOptions
	phone?: string
	studentId?: string
	staffId?: string
	sectionId?: string
	message: string
	defaulterOptions: boolean
	pendingAmount?: number
	pendingDuration?: NotPaidMonthDuration
	totalStudentDebts?: {
		[id: string]: { student: MISStudent; debt: StudentDebt; familyId?: string }
	}
	backgroundCalculations?: any
}

type StudentDebt = {
	OWED: number
	SUBMITTED: number
	FORGIVEN: number
	SCHOLARSHIP: number
}

export const SMS = () => {
	const dispatch = useDispatch()

	const {
		auth,
		db: { classes, students, settings, faculty }
	} = useSelector((state: RootReducerState) => state)

	const [state, setState] = useState<State>({
		sendTo: SendSmsOptions.TO_SINGLE_STUDENT,
		message: '',
		defaulterOptions: false
	})

	useEffect(() => {
		const calculate = () => {
			clearTimeout(state.backgroundCalculations)

			let i = 0

			const totalStudentDebts = {} as State['totalStudentDebts']

			const student_list = (Object.values(students) || []).filter(
				student => isValidStudent(student) && student.Active && student.Phone
			)

			const reducify = () => {
				// in loop
				if (i >= student_list.length) {
					setState(prevState => ({ ...prevState, totalStudentDebts }))
				}

				const student = student_list[i]
				const sid = student.id

				i += 1

				const debt = { OWED: 0, SUBMITTED: 0, FORGIVEN: 0, SCHOLARSHIP: 0 }

				for (const pid in student.payments || {}) {
					const payment = student.payments[pid]

					// some payment.amount has type string
					const amount =
						typeof payment.amount === 'string'
							? parseFloat(payment.amount)
							: payment.amount

					// for 'scholarship', payment has also type OWED and negative amount
					if (amount < 0) {
						debt['SCHOLARSHIP'] += Math.abs(amount)
					} else {
						debt[payment.type] += amount
					}
				}

				if (student.FamilyID) {
					const existing = state.totalStudentDebts[student.FamilyID]
					if (existing) {
						state.totalStudentDebts[student.FamilyID] = {
							student,
							debt: {
								OWED: existing.debt.OWED + debt.OWED,
								SUBMITTED: existing.debt.SUBMITTED + debt.SUBMITTED,
								FORGIVEN: existing.debt.FORGIVEN + debt.FORGIVEN,
								SCHOLARSHIP: existing.debt.SCHOLARSHIP + debt.SCHOLARSHIP
							},
							familyId: student.FamilyID
						}
					} else {
						state.totalStudentDebts[student.FamilyID] = {
							student,
							debt,
							familyId: student.FamilyID
						}
					}
				} else {
					state.totalStudentDebts[sid] = { student, debt }
				}

				setState(prevState => ({
					...prevState,
					backgroundCalculations: setTimeout(reducify, 0)
				}))
			}

			setState(prevState => ({
				...prevState,
				backgroundCalculations: setTimeout(reducify, 0)
			}))
		}

		if (state.sendTo === SendSmsOptions.TO_FEE_DEFAULTERS) {
			// calculate()
		}
	}, [
		state.sendTo,
		state.defaulterOptions,
		state.pendingAmount,
		state.pendingDuration,
		students,
		state.backgroundCalculations
	])

	const sections = getSectionsFromClasses(classes).sort(
		(a, b) => a.classYear ?? 0 - b.classYear ?? 0
	)

	// TODOs
	// - refactor if possible
	// - support all student sms
	// - work on send sms to fee defaulters in separate component
	// - Test on mobile device

	const logSMS = () => {
		let msgCounter = 1

		// if (state.sendTo === SendSmsOptions.TO_ALL_STUDENTS) {
		// 	msgCounter = Object.values(students || {}).filter(
		// 		s => isValidStudent(s) && s.Active && s.Phone
		// 	).length
		// }

		if (state.sendTo === SendSmsOptions.TO_SINGLE_SECTION) {
			msgCounter = Object.values(students || {}).filter(
				s => isValidStudent(s) && s.Active && s.Phone && s.section_id === state.sectionId
			).length
		}

		if (state.sendTo === SendSmsOptions.TO_ALL_STAFF) {
			msgCounter ===
				Object.values(faculty || {}).filter(f => isValidTeacher(f) && f.Active && f.Phone)
					.length
		}

		if (state.sendTo === SendSmsOptions.TO_FEE_DEFAULTERS) {
		}

		/**
		 * Note: Changing following for sms log 'type'
		 * ALL_TEACHERS -> ALL_STAFF,
		 * STUDENT -> SINGLE_STUDENT,
		 * TEACHER -> SINGLE_STAFF,
		 * CLASS -> SINGLE_CLASS
		 */

		const log = {
			faculty: auth.faculty_id,
			date: new Date().getTime(),
			type: SmsRecipient[state.sendTo].split(' ').join('_').toUpperCase(),
			count: msgCounter,
			text: state.message
		}

		dispatch(logSms(log))
	}

	const handleStudentSelect = (studentId: string) => {
		const student = students[studentId]
		if (student?.Phone && isValidPhone(student.Phone)) {
			setState({ ...state, phone: student.Phone, studentId })
			return
		}

		const alert = toTitleCase(student.Name) + ' has invalid phone.'
		toast.error(alert)
	}

	const handleMemberSelect = (staffId: string) => {
		const member = faculty[staffId]
		if (member?.Phone && isValidPhone(member.Phone)) {
			setState({ ...state, phone: member.Phone, staffId })
			return
		}

		const alert = toTitleCase(member.Name) + ' has invalid phone.'
		toast.error(alert)
	}

	const calculateDebt = ({ SUBMITTED, FORGIVEN, OWED, SCHOLARSHIP }: StudentDebt) =>
		(SUBMITTED + FORGIVEN + SCHOLARSHIP - OWED) * -1

	const getMessages = useCallback(() => {
		// send sms to only single staff or student
		if (
			state.sendTo === SendSmsOptions.TO_SINGLE_STAFF ||
			state.sendTo === SendSmsOptions.TO_SINGLE_STUDENT
		) {
			return [
				{
					number: state.phone,
					text: state.message
				}
			]
		}

		// send sms to only single section students
		if (state.sendTo === SendSmsOptions.TO_SINGLE_SECTION) {
			return Object.values(students || {})
				.filter(
					s =>
						isValidStudent(s) &&
						s.Active &&
						s.Phone &&
						s.section_id === state.sectionId &&
						isValidPhone(s.Phone)
				)
				.reduce((agg, student) => {
					const index = agg.findIndex(s => s.number === student.Phone)

					if (index >= 0) {
						return agg
					}

					return [
						...agg,
						{
							number: student.Phone,
							text: replaceSpecialCharsWithUTFChars(state.message)
						}
					]
				}, [])
		}

		// send sms to all staff
		if (state.sendTo === SendSmsOptions.TO_ALL_STAFF) {
			return Object.values(faculty || {})
				.filter(f => isValidTeacher(f) && f.Active && f.Phone && isValidPhone(f.Phone))
				.map(f => ({
					number: f.Phone,
					text: replaceSpecialCharsWithUTFChars(state.message)
				}))
		}
	}, [students, faculty, state])

	const messages = getMessages()

	const showWarning = state.message && state.message.length > 165

	console.log(state)

	return (
		<AppLayout title="SMS" showHeaderTitle>
			<div className="p-5 md:p-10 md:pb-0 relative print:hidden">
				<div className="md:w-4/5 md:mx-auto flex flex-col space-y-4 rounded-2xl bg-gray-700 p-5 my-4 mt-4 w-full">
					<div className="text-white text-lg text-center">Select to send SMS</div>
					<div className="text-white">Send To:</div>
					<CustomSelect
						data={SmsRecipient}
						selectedItem={state.sendTo}
						onChange={sendTo =>
							setState({
								message: state.message,
								sendTo: parseInt(sendTo),
								defaulterOptions: false
							})
						}>
						<SelectorIcon className="w-5 h-5 text-gray-500" />
					</CustomSelect>
					{state.sendTo === SendSmsOptions.TO_SINGLE_STUDENT &&
						(state.studentId ? (
							<Recipient
								recipient={students[state.studentId]}
								removeRecipient={() =>
									setState({ ...state, phone: '', studentId: '' })
								}
							/>
						) : (
							<StudentDropdownSearch
								{...{ students, classes, onSelectStudent: handleStudentSelect }}
							/>
						))}
					{state.sendTo === SendSmsOptions.TO_SINGLE_STAFF &&
						(state.staffId ? (
							<Recipient
								recipient={faculty[state.staffId]}
								removeRecipient={() =>
									setState({ ...state, phone: '', staffId: '' })
								}
							/>
						) : (
							<StaffDropdownSearch
								staff={faculty}
								onSelectStaff={handleMemberSelect}
							/>
						))}
					{state.sendTo === SendSmsOptions.TO_SINGLE_SECTION && (
						<CustomSelect
							data={sections.reduce(
								(agg, curr) => ({ ...agg, [curr.id]: curr.namespaced_name }),
								{}
							)}
							selectedItem={state.sectionId || sections?.[0]?.id}
							onChange={sectionId => setState({ ...state, sectionId })}>
							<SelectorIcon className="w-5 h-5 text-gray-500" />
						</CustomSelect>
					)}
					{state.sendTo === SendSmsOptions.TO_FEE_DEFAULTERS && (
						<ToFeeDefaulters
							showOptions={state.defaulterOptions}
							toggleOptions={() =>
								setState({
									sendTo: state.sendTo,
									message: state.message,
									defaulterOptions: !state.defaulterOptions
								})
							}
							setPendingAmount={amnt => setState({ ...state, pendingAmount: amnt })}
							setNotPaidDuration={duration =>
								setState({ ...state, pendingDuration: duration })
							}
						/>
					)}
					<div className="text-white">Message</div>
					<textarea
						onChange={e => setState({ ...state, message: e.target.value })}
						placeholder="Type your message here..."
						className="tw-input text-white focus-within:bg-transparent ring-1 ring-blue-brand h-32"
						rows={6}
					/>
					{showWarning && (
						<div className="w-full p-2 flex flex-row bg-white shadow-lg items-center rounded-md">
							<ExclamationIcon className="text-orange-brand w-20 h-20 md:w-10 md:h-10 mr-2" />
							<span className="text-sm">
								Your SMS is over 165 characters. This may consume more messages from
								network and your sim may be blocked by PTA
							</span>
						</div>
					)}
					{settings?.sendSMSOption === 'SIM' && isMobile() ? (
						<a
							onClick={logSMS}
							href={smsIntentLink({ messages, return_link: window.location.href })}
							className={clsx(
								'tw-btn text-white w-full text-center',
								!state.message ||
									((state.sendTo === SendSmsOptions.TO_SINGLE_STUDENT ||
										state.sendTo === SendSmsOptions.TO_SINGLE_STAFF) &&
										!state.phone) ||
									(state.sendTo === SendSmsOptions.TO_SINGLE_SECTION &&
										!state.sectionId)
									? 'pointer-events-none bg-gray-500 text-gray-300'
									: 'bg-blue-brand'
							)}>
							Send using Local SIM
						</a>
					) : (
						<div className="w-full p-2 flex flex-row bg-gray-100 shadow-lg items-center rounded-md">
							<ExclamationIcon className="text-red-brand w-8 h-8 mr-2" />
							<span className="text-sm">
								{!isMobile()
									? 'Please use MISchool on Mobile Device with Companion App to send SMS'
									: 'Set SIM option in settings to send SMS'}
							</span>
						</div>
					)}
				</div>
			</div>
		</AppLayout>
	)
}

interface RecipientProps {
	recipient: MISStudent | MISTeacher
	removeRecipient: () => void
}

const Recipient = ({ recipient, removeRecipient }: RecipientProps) => {
	return (
		<div className="flex flex-row items-center p-2 bg-white w-full justify-between rounded-md text-gray-900">
			<div className="flex flex-row items-center">
				{recipient.ProfilePicture?.url || recipient.ProfilePicture?.image_string ? (
					<img
						className="w-8 h-8 mr-2 rounded-full"
						src={
							recipient.ProfilePicture?.url || recipient.ProfilePicture?.image_string
						}
						alt={recipient.Name}
					/>
				) : (
					<UserIcon className="w-8 h-8 mr-2 text-blue-brand rounded-full" />
				)}
				<div className="flex flex-col">
					<div className="text-sm">{toTitleCase(recipient.Name)}</div>
					<div className="text-xs text-gray-500">{toTitleCase(recipient.ManName)}</div>
				</div>
			</div>
			<div className="flex flex-row items-center justify-between w-2/5">
				<div className="text-sm">{recipient.Phone}</div>
				<div className="ml-4 cursor-pointer" onClick={removeRecipient}>
					<XCircleIcon className="text-red-brand w-6 h-6" />
				</div>
			</div>
		</div>
	)
}
