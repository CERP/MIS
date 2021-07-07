import React, { useEffect, useState } from 'react'
import moment from 'moment'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { v4 } from 'node-uuid'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Transition } from '@headlessui/react'
import { ChevronUpIcon, ChevronDownIcon, CalendarIcon, TrashIcon } from '@heroicons/react/outline'

import toTitleCase from 'utils/toTitleCase'
import months from 'constants/months'
import numberWithCommas from 'utils/numberWithCommas'
import { useSectionInfo } from 'hooks/useStudentClassInfo'
import { CustomSelect } from 'components/select'
import { MISFeeLabels } from 'constants/index'
import { getFilteredPayments } from 'utils/getFilteredPayments'
import { checkStudentDuesReturning } from 'utils/checkStudentDues'
import { addMultiplePayments, addPayment, deletePayment, logSms } from 'actions'
import { smsIntentLink } from 'utils/intent'
import { useComponentVisible } from 'hooks/useComponentVisible'
import { TModal } from 'components/Modal'
import { getPaymentLabel } from 'utils'

import UserIconSvg from 'assets/svgs/user.svg'

interface RouteInfo {
	id: string
}

type State = {
	filter: {
		paymentsView: boolean
		year: string
		month: string
	}
}

export const StudentPayments = () => {
	const dispatch = useDispatch()
	const {
		auth,
		db: { students, settings, sms_templates }
	} = useSelector((state: RootReducerState) => state)

	const { id: studentId } = useParams<RouteInfo>()
	const student = students?.[studentId]

	const { section } = useSectionInfo(student.section_id)

	const augmentedStudent = {
		...student,
		section
	}

	// get class fees
	const classDefaultFee = settings?.classes?.defaultFee?.[section.class_id]
	const classAdditionalFees = settings?.classes?.additionalFees?.[section.class_id]

	const [state, setState] = useState<State>({
		filter: {
			paymentsView: false,
			year: moment().format('YYYY'),
			month: moment().format('MMMM')
		}
	})

	// generate payments, if not generated
	useEffect(() => {
		if (augmentedStudent) {
			const owedPayments = checkStudentDuesReturning(augmentedStudent, settings)
			if (owedPayments.length > 0) {
				dispatch(addMultiplePayments(owedPayments))
			}
		}
	}, [augmentedStudent, settings.classes])

	const getFees = (): Array<[string, MISStudentFee | MISClassFee]> => {
		return [
			//  there's no rocket science here,  just want to have unique id and merging class fees and
			//  student fees to render them
			[
				v4(),
				{
					...(classDefaultFee ?? ({} as MISClassFee)),
					name: 'Class Fee'
				}
			],
			...Object.entries(classAdditionalFees ?? {}),
			...(Object.entries(student.fees ?? {})
				.filter(([id, fee]) => !(fee.type === 'FEE' && fee.period === 'MONTHLY'))
				.map(([feeId, fee]) => {
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
	}

	// TODO: if there's no student, show default blank page with nice emoji
	// and add link to go back home

	// if(!student) {
	// 	return (
	//		add component to show invalid state and link to go -> history.goBack()
	// 	)500
	// }

	const filteredPayments = getFilteredPayments(
		student.payments,
		state.filter.year,
		state.filter.month
	)

	const filteredPendingAmount = filteredPayments.reduce(
		(agg, [, curr]) =>
			agg - (curr.type === 'SUBMITTED' || curr.type === 'FORGIVEN' ? 1 : -1) * curr.amount,
		0
	)

	const totalPendingAmount = Object.entries(student.payments ?? {}).reduce(
		(agg, [, curr]) =>
			agg - (curr.type === 'SUBMITTED' || curr.type === 'FORGIVEN' ? 1 : -1) * curr.amount,
		0
	)

	const years = [
		...new Set(
			Object.entries(student.payments ?? {})
				.sort(([, a_payment], [, b_payment]) => a_payment.date - b_payment.date)
				.map(([id, payment]) => moment(payment.date).format('YYYY'))
		)
	].sort((a, b) => parseInt(a) - parseInt(b))

	return (
		<>
			<div className="px-5 text-gray-700 relative print:hidden">
				<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-4 rounded-2xl bg-gray-700 p-5 my-4 mt-14">
					<div className="flex flex-col items-center justify-center relative text-white">
						<img
							className="-top-14 absolute rounded-full bg-gray-500 w-20 h-20 object-contain"
							src={
								student.ProfilePicture?.url ??
								student.ProfilePicture?.image_string ??
								UserIconSvg
							}
							alt="student"
						/>
						<div className="mt-8">{toTitleCase(student.Name)}</div>
						<div className="text-sm">{section?.namespaced_name}</div>
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
						className="inline-flex items-center tw-btn-blue rounded-3xl">
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
									<CalendarIcon className="w-5 h-5 text-teal-brand" />
								</CustomSelect>
								<CustomSelect
									onChange={year => {
										setState({ ...state, filter: { ...state.filter, year } })
									}}
									data={years}
									selectedItem={state.filter.year}>
									<ChevronDownIcon className="w-5 h-5 text-teal-brand" />
								</CustomSelect>
							</div>
							<div className="w-full text-sm md:text-base space-y-1">
								{getFees().map(([id, fee]) => (
									<div
										key={id}
										className="flex flex-row justify-between text-white w-full">
										<div>{getPaymentLabel(fee.name, fee.type)}</div>
										<div>{fee?.amount ?? 0}</div>
									</div>
								))}

								<div className="flex flex-row justify-between text-white w-full font-semibold">
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
									<div>Rs. {numberWithCommas(filteredPendingAmount)}</div>
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
								{...{ student, auth, settings, smsTemplates: sms_templates }}
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
							student={student}
						/>
					)}
				</div>
			</div>
		</>
	)
}

interface PreviousPaymentsProps {
	close: () => void
	years: string[]
	student: MISStudent
}

const PreviousPayments = ({ years, close, student }: PreviousPaymentsProps) => {
	const [state, setState] = useState({
		month: moment().format('MMMM'),
		year: moment().format('YYYY'),
		paymentIdtoDelete: ''
	})

	const faculty_id = useSelector((state: RootReducerState) => state.auth.faculty_id)
	const isAdmin = useSelector((state: RootReducerState) => state.db.faculty[faculty_id].Admin)
	const { ref, setIsComponentVisible, isComponentVisible } = useComponentVisible(false)

	const dispatch = useDispatch()
	const totalPendingAmount = Object.entries(student.payments ?? {}).reduce(
		(agg, [, curr]) =>
			agg - (curr.type === 'SUBMITTED' || curr.type === 'FORGIVEN' ? 1 : -1) * curr.amount,
		0
	)

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
					<CalendarIcon className="w-5 h-5 text-teal-brand" />
				</CustomSelect>
				<CustomSelect
					onChange={year => {
						setState({ ...state, year })
					}}
					data={years}
					selectedItem={state.year}>
					<ChevronDownIcon className="w-5 h-5 text-teal-brand" />
				</CustomSelect>
			</div>
			<div className="space-y-2 px-2 text-sm md:text-base">
				<div className="flex items-center flex-row justify-between font-semibold">
					<div>Date</div>
					<div>Label</div>
					<div>Amount</div>
				</div>
				{getFilteredPayments(student.payments, state.year, state.month).map(
					([id, payment]) => (
						<div key={id} className="flex flex-row items-start justify-between">
							<div className="w-1/4">{moment(payment.date).format('DD-MM')}</div>
							<div className="w-2/5 md:w-1/3 mx-auto items-center text-xs md:text-sm flex flex-row justify-center">
								{getPaymentLabel(payment.fee_name, payment.type)}
							</div>
							<div className="w-1/4 flex flex-row justify-end items-center">
								{payment.type === 'FORGIVEN'
									? `-${payment.amount}`
									: `${payment.amount}`}
								<div>
									<TrashIcon
										onClick={() => {
											if (checkPermissionToDelete(payment, isAdmin)) {
												setState({
													...state,
													paymentIdtoDelete: id
												})
												setIsComponentVisible(true)
											}
										}}
										className={clsx(
											'h-5 md:h-6 ml-2',
											checkPermissionToDelete(payment, isAdmin)
												? 'text-red-brand cursor-pointer'
												: 'text-gray-brand'
										)}
									/>
								</div>
							</div>
						</div>
					)
				)}
			</div>

			<div className="border-b-2 border-dashed w-full" />

			<div
				className={clsx(
					'flex flex-row justify-between w-full font-semibold',
					totalPendingAmount <= 0 ? 'text-teal-brand' : 'text-red-brand'
				)}>
				<div>{totalPendingAmount < 0 ? 'Advance' : 'Pending'} amount</div>
				<div>Rs. {numberWithCommas(totalPendingAmount)}</div>
			</div>
			<button onClick={close} className="tw-btn bg-orange-brand w-full text-white">
				Go Back
			</button>
			{isComponentVisible && (
				<TModal>
					<div className="bg-white md:p-10 p-8 text-center text-sm" ref={ref}>
						<div className="font-semibold text-lg">
							Are you sure you want to delete this payment?
						</div>

						<div className="flex flex-row justify-between space-x-4 mt-4">
							<button
								onClick={() => {
									setState({
										...state,
										paymentIdtoDelete: ''
									})
									setIsComponentVisible(false)
								}}
								className="py-1 md:py-2 tw-btn bg-gray-400 hover:bg-gray-500 text-white w-full">
								Cancel
							</button>
							<button
								onClick={() => {
									dispatch(deletePayment(student.id, state.paymentIdtoDelete))
									setIsComponentVisible(false)
								}}
								className="py-1 md:py-2 tw-btn-red w-full font-semibold">
								Confirm
							</button>
						</div>
					</div>
				</TModal>
			)}
		</Transition>
	)
}

interface AddPaymentProps {
	student: AugmentedStudent
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

const AddPayment = ({ student, auth, settings, smsTemplates }: AddPaymentProps) => {
	const dispatch = useDispatch()
	const { ref, setIsComponentVisible, isComponentVisible } = useComponentVisible(false)
	const [state, setState] = useState({
		payment: blankPayment(),
		sendSMS: false
	})

	let balance = [...Object.values(student.payments ?? {})].reduce(
		(agg, curr) =>
			agg - (curr.type === 'SUBMITTED' || curr.type === 'FORGIVEN' ? 1 : -1) * curr.amount,
		0
	)

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setIsComponentVisible(true)
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let { name, value, valueAsNumber, checked, type } = event.target

		if (name === 'type') {
			value = checked ? 'FORGIVEN' : 'SUBMITTED'
		}

		if (name === 'sendSMS') {
			setState({ ...state, [name]: checked })
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

	const handleAddPayment = () => {
		balance = balance - state.payment.amount

		if (state.sendSMS) {
			// send SMS with replace text for regex etc.
			const message = smsTemplates.fee
				.replace(/\$BALANCE/g, `${balance}`)
				.replace(/\$AMOUNT/g, `${state.payment.amount}`)
				.replace(/\$NAME/g, student.Name)
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
				sendSMS: false
			})
		}

		// close confirmation modal
		setIsComponentVisible(false)
	}

	return (
		<>
			<form
				className="bg-white rounded-md space-y-1 md:space-y-2 w-full p-2 md:p-4"
				onSubmit={handleSubmit}>
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
					<div className="flex flex-col space-y-1 md:space-y-2 w-1/2 md:w-full">
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
							placeholder="Enter amount"
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
						<div className="flex flex-row justify-between">
							<div>Payment Date</div>
							<div>{moment(state.payment.date).format('DD-MM-YYYY')}</div>
						</div>
						<div className="flex flex-row justify-between">
							<div>Payable Amount</div>
							<div>Rs. {balance}</div>
						</div>
						<div className="flex flex-row justify-between">
							<div>Pending after Confirm</div>
							<div>Rs. {balance - state.payment.amount}</div>
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

function checkPermissionToDelete(payment: Partial<AugmentedMISPayment>, admin: boolean) {
	if (payment.type === 'OWED') return false
	return admin && moment(payment.date).isSame(moment.now(), 'M')
}
