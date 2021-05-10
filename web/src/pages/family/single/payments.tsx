import React, { useCallback, useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { v4 } from 'node-uuid'
import { useDispatch, useSelector } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { Transition } from '@headlessui/react'
import { ChevronUpIcon, ChevronDownIcon, CalendarIcon } from '@heroicons/react/outline'

import toTitleCase from 'utils/toTitleCase'
import months from 'constants/months'
import numberWithCommas from 'utils/numberWithCommas'
import { AppLayout } from 'components/Layout/appLayout'
import { CustomSelect } from 'components/select'
import { MISFeeLabels } from 'constants/index'
import { getFilteredPayments } from 'utils/getFilteredPayments'
import { checkStudentDuesReturning } from 'utils/checkStudentDues'
import { addMultiplePayments, addPayment, logSms } from 'actions'
import { smsIntentLink } from 'utils/intent'
import { useComponentVisible } from 'hooks/useComponentVisible'
import { TModal } from 'components/Modal'

import UserIconSvg from 'assets/svgs/user.svg'
import { isValidStudent } from 'utils'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'

type State = {
	filter: {
		paymentsView: boolean
		year: string
		month: string
	}
}
type SingleFamilyPaymentsProps = RouteComponentProps<{ id: string }>
type AugmentedFees = Array<[string, MISStudentFee | MISClassFee]>

const getPaymentLabel = (feeName: string, type: MISStudentPayment['type']) => {
	if (feeName === MISFeeLabels.SPECIAL_SCHOLARSHIP) {
		return 'Scholarship (M)'
	}
	// set fee name in default class fee logic
	if (feeName === 'Montly') {
		return 'Class Fee'
	}

	if (type === 'FORGIVEN') {
		return 'Scholarship (A)'
	}

	if (type === 'SUBMITTED') {
		return 'Paid'
	}

	return feeName
}

export const SingleFamilyPayments = ({ match }: SingleFamilyPaymentsProps) => {
	const dispatch = useDispatch()

	const { id: famId } = match.params

	const {
		auth,
		db: { students, settings, sms_templates: smsTemplates, classes }
	} = useSelector((state: RootReducerState) => state)

	const [state, setState] = useState<State>({
		filter: {
			paymentsView: false,
			year: moment().format('YYYY'),
			month: moment().format('MMMM')
		}
	})

	const { sections, siblings } = useMemo(() => {
		// merge siblings sections
		// merge siblings classes fees
		const getSiblings = (
			stds: RootDBState['students'],
			sections: AugmentedSection[]
		): AugmentedStudent[] => {
			return Object.values(stds)
				.filter(s => isValidStudent(s) && s.Active && s.FamilyID && s.FamilyID === famId)
				.map(s => {
					const section = sections.find(sec => sec.id === s.section_id)
					let classFee = {} as MISClassFee
					let classAdditionalFees = {} as AugmentedStudent['classAdditionalFees']

					// we don't need of this check, but it's better to have guard
					if (section) {
						classFee = settings?.classes?.defaultFee?.[section.class_id]
						classAdditionalFees = settings?.classes?.additionalFees?.[section.class_id]
					}

					return {
						...s,
						section,
						classFee,
						classAdditionalFees
					}
				})
		}

		const sections = getSectionsFromClasses(classes)
		const siblings = sections?.length > 0 ? getSiblings(students, sections) : []

		return {
			sections,
			siblings
		}
	}, [students, classes, famId])

	// generate payments for all siblings, if not generated
	useEffect(() => {
		if (siblings.length > 0) {
			const sibling_payments = siblings.reduce((agg, curr) => {
				const curr_student_payments = checkStudentDuesReturning(curr, settings)
				if (curr_student_payments.length > 0) {
					return [...agg, ...curr_student_payments]
				}
				return agg
			}, [])

			if (sibling_payments.length > 0) {
				dispatch(addMultiplePayments(sibling_payments))
			}
		}
	}, [siblings, settings.classes])

	// TODO: if there's no sibling (which means invalid family id), show default blank page with nice emoji
	// and add link to go back home

	// if(siblings.length === 0) {
	// 	return (
	//		add component to show invalid state and link to go -> history.goBack()
	// 	)
	// }

	const mergedPayments = useCallback(() => {
		if (siblings.length > 0) {
			const merged_payments = siblings.reduce(
				(agg, curr) => ({
					...agg,
					...Object.entries(curr.payments ?? {}).reduce((agg2, [pid, p]) => {
						return {
							...agg2,
							[pid]: {
								...p,
								fee_name:
									p.fee_name &&
									`${curr.Name}-${getPaymentLabel(p.fee_name, p.type)}`,
								student_id: curr.id
							}
						}
					}, {})
				}),
				{} as AugmentedMISPaymentMap
			)

			return merged_payments
		}
	}, [siblings])

	const siblingPayments = mergedPayments()

	// for all siblings
	const filteredPayments = getFilteredPayments(
		siblingPayments,
		state.filter.year,
		state.filter.month
	)

	// const filteredPendingAmount = filteredPayments.reduce(
	// 	(agg, [, curr]) =>
	// 		agg - (curr.type === 'SUBMITTED' || curr.type === 'FORGIVEN' ? 1 : -1) * curr.amount,
	// 	0
	// )

	console.log('Payments', siblingPayments)

	const totalPendingAmount = Object.entries(siblingPayments ?? {}).reduce(
		(agg, [, curr]) =>
			agg - (curr.type === 'SUBMITTED' || curr.type === 'FORGIVEN' ? 1 : -1) * curr.amount,
		0
	)

	const years = [
		...new Set(
			Object.entries(siblingPayments)
				.sort(([, a_payment], [, b_payment]) => a_payment.date - b_payment.date)
				.map(([id, payment]) => moment(payment.date).format('YYYY'))
		)
	].sort((a, b) => parseInt(a) - parseInt(b))

	// TODO: fix family payment calculations

	return (
		<AppLayout title="Family Payments" showHeaderTitle>
			<div className="p-5 md:p-10 md:pb-0 text-gray-700 relative print:hidden">
				<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-4 rounded-2xl bg-gray-700 p-5 my-4 mt-8">
					<div className="relative text-white text-center text-base md:hidden w-full">
						<div className="mt-4">{toTitleCase(famId, '-')}</div>
						<div className="text-sm">Siblings - {siblings?.length}</div>
						<div className="absolute left-0 right-0 -top-12 flex -space-x-2 overflow-hidden justify-center w-full h-20">
							{siblings.map(
								(s, index) =>
									index <= 2 && (
										<img
											key={s.id}
											src={
												s.ProfilePicture?.url ||
												s.ProfilePicture?.image_string ||
												UserIconSvg
											}
											className={clsx(
												'  w-14 h-14 md:h-20 md:w-20 rounded-full shadow-md bg-gray-500 inline-block ring-2 ring-white'
											)}
											alt={s.Name}
										/>
									)
							)}
						</div>
					</div>
					<button
						onClick={() =>
							setState({
								...state,
								filter: {
									...state.filter,
									paymentsView: !state.filter.paymentsView
								}
							})
						}
						className="inline-flex items-center tw-btn-blue rounded-3xl md:hidden">
						<span className="mr-2">View Past Payments</span>
						<span className="w-4 h-4 bg-white rounded-full text-blue-brand">
							{state.filter.paymentsView ? (
								<ChevronUpIcon className="w-4 h-4" />
							) : (
								<ChevronDownIcon className="w-4 h-4" />
							)}
						</span>
					</button>
					{!state.filter.paymentsView ? (
						<>
							<div className="flex flex-row items-center justify-between w-full md:w-3/5 space-x-4">
								<CustomSelect
									onChange={month =>
										setState({ ...state, filter: { ...state.filter, month } })
									}
									data={months}
									selectedItem={state.filter.month}>
									<CalendarIcon className="w-5 h-5 text-gray-500" />
								</CustomSelect>
								<CustomSelect
									onChange={year => {
										setState({ ...state, filter: { ...state.filter, year } })
									}}
									data={years}
									selectedItem={state.filter.year}>
									<ChevronDownIcon className="w-5 h-5 text-gray-500" />
								</CustomSelect>
							</div>
							<div className="w-full text-sm md:text-base space-y-1">
								{/* <div className="flex flex-row justify-between text-white w-full font-semibold">
									<div>
										{filteredPendingAmount < 0
											? 'Advance Amount'
											: 'Pending Amount'}{' '}
										(
										<span
											className={clsx(
												'mx-2',
												filteredPendingAmount <= 0
													? 'text-teal-brand'
													: 'text-red-brand'
											)}>
											{state.filter.month}
										</span>
										)
									</div>
									<div>{filteredPendingAmount}</div>
								</div> */}
								<div className="space-y-4 text-white max-h-72 overflow-y-auto">
									{siblings.map(sib => (
										<FeeBreakdownCard key={sib.id} student={sib} />
									))}
								</div>

								<div className="border-b-2 border-dashed w-full" />

								<div
									className={clsx(
										'flex flex-row justify-between w-full font-semibold',
										totalPendingAmount <= 0
											? 'text-teal-brand'
											: 'text-red-brand'
									)}>
									<div>
										{totalPendingAmount < 0
											? 'Advance Amount'
											: 'Total Payable'}
									</div>
									<div>Rs. {numberWithCommas(totalPendingAmount)}</div>
								</div>
							</div>
							<AddPayment
								{...{
									siblings,
									auth,
									settings,
									smsTemplates,
									pendingAmount: totalPendingAmount
								}}
							/>
						</>
					) : (
						<PreviousPayments
							years={years}
							close={() =>
								setState({
									...state,
									filter: {
										...state.filter,
										paymentsView: !state.filter.paymentsView
									}
								})
							}
							students={students}
							pendingAmount={totalPendingAmount}
							payments={siblingPayments}
						/>
					)}
				</div>
			</div>
		</AppLayout>
	)
}

interface FeeBreakdownCardProps {
	student: AugmentedStudent
}

const FeeBreakdownCard = ({ student }: FeeBreakdownCardProps) => {
	const [showFees, setShowFees] = useState(false)

	//  want to have unique Fee IDs and merging class fees and
	//  student fees to render them
	const getFees = useCallback((): AugmentedFees => {
		return [
			[
				v4(),
				{
					...(student.classFee ?? ({} as MISClassFee)),
					name: 'Class Fee'
				}
			],
			...Object.entries(student.classAdditionalFees ?? {}),
			...(Object.entries(student.fees ?? {}).map(([feeId, fee]) => {
				return [
					feeId,
					{
						...fee,
						amount:
							fee.name === MISFeeLabels.SPECIAL_SCHOLARSHIP
								? '-' + fee.amount
								: fee.amount,
						name:
							fee.name === MISFeeLabels.SPECIAL_SCHOLARSHIP
								? 'Scholarship (M)'
								: fee.name
					}
				]
			}) as Array<[string, MISStudentFee]>)
		]
	}, [student])

	const totalPendingAmount = Object.entries(student.payments ?? {}).reduce(
		(agg, [, curr]) =>
			agg - (curr.type === 'SUBMITTED' || curr.type === 'FORGIVEN' ? 1 : -1) * curr.amount,
		0
	)

	return (
		<div className="p-2 w-full bg-gray-500 rounded-md shadow-md">
			<div className="flex flex-row justify-between items-center">
				<div className="flex flex-row w-3/5 flex-start items-center">
					<img
						className="w-10 h-10 mr-2 rounded-full"
						src={
							student.ProfilePicture?.url ||
							student.ProfilePicture?.image_string ||
							UserIconSvg
						}
						alt={student.Name}
					/>
					<div>{toTitleCase(student.Name)}</div>
				</div>
				<div className="flex flex-end">
					<div>{student.section.namespaced_name}</div>
				</div>
			</div>
			<div className="flex flex-row justify-between">
				<div className="flex flex-row  text-sm md:text-base">
					<div>Pending Amount</div>
					<div
						className={clsx(
							'w-5 h-5 rounded-full ml-4 cursor-pointer',
							showFees ? 'bg-red-brand' : 'bg-teal-brand'
						)}
						onClick={() => setShowFees(!showFees)}>
						{showFees ? (
							<ChevronUpIcon className="w-5 h-5" />
						) : (
							<ChevronDownIcon className="w-5 h-5" />
						)}
					</div>
				</div>
				<div>Rs. {totalPendingAmount}</div>
			</div>
			<Transition
				show={showFees}
				enter="transition-opacity duration-150"
				enterFrom="opacity-0"
				as="div"
				className="text-xs md:text-sm"
				enterTo="opacity-100">
				{getFees().map(([id, fee]) => (
					<div key={id} className="flex flex-row justify-between">
						<div>{fee.name}</div>
						<div>{fee.amount}</div>
					</div>
				))}
			</Transition>
		</div>
	)
}

interface PreviousPaymentsProps {
	close: () => void
	years: string[]
	pendingAmount: number
	students: RootDBState['students']
	payments: AugmentedMISPaymentMap
}

const PreviousPayments = ({ years, close, payments, pendingAmount }: PreviousPaymentsProps) => {
	const [state, setState] = useState({
		month: moment().format('MMMM'),
		year: moment().format('YYYY')
	})

	return (
		<Transition
			show={true}
			enter="transition-opacity duration-150"
			enterFrom="opacity-0"
			as="div"
			className="bg-white rounded-md space-y-4 w-full p-2"
			enterTo="opacity-100">
			<div className="flex flex-row items-center w-full space-x-4">
				<CustomSelect
					onChange={month => setState({ ...state, month })}
					data={months}
					selectedItem={state.month}>
					<CalendarIcon className="w-5 h-5 text-gray-500" />
				</CustomSelect>
				<CustomSelect
					onChange={year => {
						setState({ ...state, year })
					}}
					data={years}
					selectedItem={state.year}>
					<ChevronDownIcon className="w-5 h-5 text-gray-500" />
				</CustomSelect>
			</div>
			<div className="space-y-2 px-2 text-sm md:text-base">
				<div className="flex items-center flex-row justify-between font-semibold">
					<div>Date</div>
					<div>Label</div>
					<div>Amount</div>
				</div>
				{getFilteredPayments(payments, state.year, state.month).map(([id, payment]) => (
					<div key={id} className="flex flex-row items-start justify-between">
						<div className="w-1/4">{moment(payment.date).format('DD-MM')}</div>
						<div className="w-2/5 md:w-1/3 mx-auto text-xs md:text-sm flex flex-row justify-center">
							{payment.fee_name}
						</div>
						<div className="w-1/4 flex flex-row justify-end">
							{payment.type === 'FORGIVEN'
								? `-${payment.amount}`
								: `${payment.amount}`}
						</div>
					</div>
				))}
			</div>

			<div className="border-b-2 border-dashed w-full" />

			<div
				className={clsx(
					'flex flex-row justify-between w-full font-semibold',
					pendingAmount <= 0 ? 'text-teal-brand' : 'text-red-brand'
				)}>
				<div>{pendingAmount < 0 ? 'Advance' : 'Pending'} amount</div>
				<div>Rs. {numberWithCommas(pendingAmount)}</div>
			</div>
			<button onClick={close} className="tw-btn bg-orange-brand w-full text-white">
				Go Back
			</button>
		</Transition>
	)
}

interface AddPaymentProps {
	siblings: AugmentedStudent[]
	pendingAmount: number
	auth: RootReducerState['auth']
	settings: MISSettings
	smsTemplates: RootDBState['sms_templates']
}

const blankPayment = (): MISStudentPayment => ({
	amount: 0,
	fee_name: '',
	type: 'SUBMITTED',
	date: Date.now()
})

const AddPayment = ({ siblings, auth, settings, smsTemplates, pendingAmount }: AddPaymentProps) => {
	const dispatch = useDispatch()
	const { ref, setIsComponentVisible, isComponentVisible } = useComponentVisible(false)
	const [state, setState] = useState({
		payment: blankPayment(),
		studentId: siblings[0].id,
		sendSMS: false
	})

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setIsComponentVisible(true)
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let { name, value, valueAsNumber, type } = event.target
		if (name === 'type') {
			value = value === 'on' ? 'FORGIVEN' : 'SUBMITTED'
		}

		if (name === 'sendSMS') {
			setState({ ...state, [name]: value === 'on' ? true : false })
			return
		}

		setState({
			...state,
			payment: {
				...state.payment,
				[name]:
					type === 'text' || type === 'checkbox'
						? value
						: isNaN(valueAsNumber)
							? name === 'date'
								? Date.now()
								: 0
							: valueAsNumber
			}
		})
	}

	const student = siblings.find(s => s.id === state.studentId)

	const handleAddPayment = () => {
		let balance = pendingAmount - state.payment.amount

		if (state.sendSMS) {
			// send SMS with replace text for regex etc.
			const message = smsTemplates.fee
				.replace(/\$BALANCE/g, `${balance}`)
				.replace(/\$AMOUNT/g, `${state.payment.amount}`)
				// .replace(/\$NAME/g, student.Name)
				.replace(/\$FNAME/g, student.ManName)

			if (settings.sendSMSOption !== 'SIM') {
				toast.error('Can only send messages from local SIM')
			} else {
				const url = smsIntentLink({
					messages: [{ text: message, number: student.Phone }],
					return_link: window.location.href
				})

				const log = {
					faculty: auth.faculty_id,
					date: new Date().getTime(),
					type: 'PAYMENT',
					count: 1
				}

				dispatch(logSms(log))
				// TODO: change action to receive object instead of multiple args
				dispatch(
					addPayment(
						student,
						v4(),
						state.payment.amount,
						state.payment.date,
						state.payment.type,
						state.payment.fee_id,
						state.payment.fee_name.trim()
					)
				)

				toast.success(
					`Rs. ${state.payment.amount} has been added as ${state.payment.type === 'FORGIVEN' ? 'scholarship' : 'paid'
					} amount.`
				)

				// redirect to companion app
				//history.push(url)
				window.location.href = url
			}
		} else {
			// TODO: change action to receive object instead of multiple args
			dispatch(
				addPayment(
					student,
					v4(),
					state.payment.amount,
					state.payment.date,
					state.payment.type,
					state.payment.fee_id,
					state.payment.fee_name.trim()
				)
			)

			toast.success(
				`Rs. ${state.payment.amount} has been added as ${state.payment.type === 'FORGIVEN' ? 'scholarship' : 'paid'
				} amount.`
			)
			setState({
				payment: blankPayment(),
				sendSMS: false,
				studentId: siblings[0].id
			})
		}

		// close confirmation modal
		setIsComponentVisible(false)
	}

	const selectItems = siblings.reduce((agg, curr) => ({ ...agg, [curr.id]: curr.Name }), {})

	return (
		<>
			<form
				className="bg-white rounded-md space-y-1 md:space-y-2 w-full p-2 md:p-4"
				onSubmit={handleSubmit}>
				<div>Sibling</div>
				<CustomSelect
					data={selectItems}
					selectedItem={state.studentId}
					onChange={studentId => setState({ ...state, studentId })}>
					<ChevronDownIcon className="w-5 h-5 text-gray-500" />
				</CustomSelect>
				<div>Label</div>
				<input
					type="text"
					name="fee_name"
					onChange={handleInputChange}
					placeholder="Type payment name"
					required
					value={state.payment.fee_name}
					className="tw-input w-full"
				/>

				<div className="flex flex-row space-x-4 w-full">
					<div className="flex flex-col space-y-1 md:space-y-2 w-full">
						<div>Date</div>
						<input
							type="date"
							onChange={handleInputChange}
							name="date"
							required
							value={moment(state.payment.date).format('YYYY-MM-DD')}
							className="tw-input w-full"
						/>
					</div>
					<div className="flex flex-col space-y-1 md:space-y-2 w-full">
						<div>Amount</div>
						<input
							type="number"
							onChange={handleInputChange}
							value={state.payment.amount === 0 ? '' : state.payment.amount}
							placeholder="e.g. Rs 500"
							required
							name="amount"
							className="tw-input w-full"
						/>
					</div>
				</div>

				<div className="flex flex-row w-full items-center justify-between">
					<div className="flex items-center flex-row-reverse">
						<div>Scholarship</div>
						<input
							type="checkbox"
							onChange={handleInputChange}
							name="type"
							checked={state.payment.type === 'FORGIVEN' ? true : false}
							className="rounded form-checkbox mr-4 md:w-6 md:h-6 text-teal-brand"
						/>
					</div>
					<div className="flex items-center flex-row-reverse md:hidden">
						<div>Send SMS</div>
						<input
							type="checkbox"
							onChange={handleInputChange}
							name="sendSMS"
							checked={state.sendSMS}
							className="rounded form-checkbox mr-4 md:w-6 md:h-6 text-teal-brand"
						/>
					</div>
				</div>
				<div className="w-full">
					<button type="submit" className="tw-btn bg-teal-brand text-white w-full mt-2">
						Add Payment
					</button>
				</div>
			</form>
			{isComponentVisible && (
				<TModal>
					<div className="bg-white md:p-10 p-8 text-center text-sm" ref={ref}>
						<div className="font-semibold text-lg">Confirm Payment</div>
						<div className="text-teal-brand font-semibold text-lg">
							Rs. {state.payment.amount} as{' '}
							{state.payment.type === 'FORGIVEN' ? 'Scholarship' : 'Paid'} Amount
						</div>

						<div className="text-blue-brand my-1 font-semibold">
							{toTitleCase(student.Name)}
						</div>
						<div className="flex flex-row justify-between">
							<div>Payment Date</div>
							<div>{moment(state.payment.date).format('DD-MM-YYYY')}</div>
						</div>
						<div className="flex flex-row justify-between">
							<div>Payable Amount</div>
							<div>Rs. {pendingAmount}</div>
						</div>
						<div className="flex flex-row justify-between">
							<div>Pending after Confirm</div>
							<div>Rs. {pendingAmount - state.payment.amount}</div>
						</div>
						<div className="flex flex-row justify-between space-x-4 mt-4">
							<button
								onClick={() => setIsComponentVisible(false)}
								className="py-1 md:py-2 tw-btn bg-gray-400 hover:bg-gray-500 text-white w-full">
								Cancel
							</button>
							<button
								onClick={handleAddPayment}
								className="py-1 md:py-2 tw-btn-red w-full font-semibold">
								Confirm
							</button>
						</div>
					</div>
				</TModal>
			)}
		</>
	)
}