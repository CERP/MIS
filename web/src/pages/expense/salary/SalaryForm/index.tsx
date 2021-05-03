import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import { AppLayout } from 'components/Layout/appLayout'
import React, { Fragment, useEffect, useState, useRef } from 'react'
import UserIconSvg from 'assets/svgs/user.svg'

import { useDispatch, useSelector } from 'react-redux'
import { Transition } from '@headlessui/react'
import { addSalaryExpense } from 'actions'

import toast from 'react-hot-toast'
import moment from 'moment'

const SalaryForm = (props: {
	location: { state: MISSalaryExpense[] }
	match: { params: { id: any } }
}) => {
	const [salaries, setSalaries] = useState<MISSalaryExpense[]>(
		props.location.state === undefined ? [] : props.location.state
	)
	const teacher = useSelector(
		(state: RootReducerState) => state.db.faculty[props.match.params.id]
	)
	const [state, setState] = useState<Partial<MISSalaryExpense>>({
		amount: parseFloat(teacher.Salary),
		date: new Date().getTime()
	})
	const [detialsExpanded, setDetailsExpanded] = useState<boolean>(false)

	const [type, setType] = useState<string>('Full')
	const [reason, setReason] = useState<string>('')
	const [totalDeductions, setTotalDeductions] = useState<number>(0)
	const [totalPaid, setTotalPaid] = useState<number>(0)
	const dispatch = useDispatch()
	const detailsButtonRef = useRef(undefined)
	const mainFormRef = useRef(undefined)

	const calculateDeductionsAndPaid = () => {
		let deduction = 0
		let paid = 0

		salaries.forEach(entry => {
			deduction = deduction + entry.deduction
			paid = paid + entry.amount
		})

		setTotalDeductions(deduction)
		setTotalPaid(paid)
	}

	useEffect(() => {
		calculateDeductionsAndPaid()
	}, [salaries])

	const paySalary = () => {
		if (typeof state.amount === 'string' || typeof state.amount === 'undefined') {
			toast.error('Amount must be a number')
			return
		} else if (state.amount < 0) {
			toast.error('Ammount cannot be less than 0')
			return
		}
		if (isNaN(state.amount)) {
			toast.error('Please Specify an ammount')
			return
		}

		if (type === 'Full') {
			const id = `${moment().format('MM-YYYY')}-${teacher.id}`
			if (salaries !== undefined) {
				//updates the already paid salary if check not present?????
				const old_id = `${moment(salaries[0]?.date).format('MM-YYYY')}-${
					salaries[0]?.faculty_id
				}`

				if (id === old_id) {
					toast.error('Salary Already paid')
					return
				}
			}

			dispatch(
				addSalaryExpense(
					id,
					state.amount,
					teacher.Name,
					'PAYMENT_GIVEN',
					teacher.id,
					state.date,
					0,
					0,
					'',
					'SALARY'
				)
			)

			if (salaries) {
				setSalaries([
					...salaries,
					{
						advance: 0,
						amount: state.amount,
						category: 'SALARY',
						date: state.date,
						expense: 'SALARY_EXPENSE',
						type: 'PAYMENT_GIVEN',
						deduction: 0,
						deduction_reason: '',
						faculty_id: teacher.id,
						label: teacher.Name,
						time: moment.now()
					}
				])
			} else {
				setSalaries([
					{
						advance: 0,
						amount: state.amount,
						category: 'SALARY',
						date: state.date,
						expense: 'SALARY_EXPENSE',
						type: 'PAYMENT_GIVEN',
						deduction: 0,
						deduction_reason: '',
						faculty_id: teacher.id,
						label: teacher.Name,
						time: moment.now()
					}
				])
			}

			toast.success('Payment Made')
		}
	}
	const [offset, setOffset] = useState(0)

	return (
		<AppLayout>
			<div className="flex flex-col-reverse lg:flex-row lg:m-14 lg:mx-32">
				<div
					ref={mainFormRef}
					className="bg-gray-600  ml-3 mr-3 rounded-b-2xl flex flex-1 flex-col lg:mt-4 lg:rounded-2xl  lg:px-8">
					<div className="m-5 text-gray-50 lg:space-y-5">
						<div
							onClick={() => {
								setDetailsExpanded(!detialsExpanded)
							}}
							className="w-full flex justify-center items-center">
							<div
								ref={detailsButtonRef}
								className="bg-blue-400 rounded-full py-2 px-2 text-white font-semibold cursor-pointer mb-4 flex flex-row justify-between items-center lg:hidden">
								<h1>View Past Payments </h1>
								<ChevronDownIcon className="w-4 h-4 text-white ml-3" />
							</div>
						</div>
						<h1 className="text-center text-2xl font-semibold text-white hidden lg:block">
							Pay Salary
						</h1>
						<h1 className="text-xl text-gray-100 font-normal mb-1">Salary*</h1>
						<div className="flex flex-row justify-between items-center">
							<div>
								<input
									type="radio"
									id="Full"
									name="type"
									value="Full"
									onChange={type => {
										setType(type.target.value)
									}}
									className="form-radio bg-transparent text-teal-brand mr-2 w-4 h-4 cursor-pointer"
								/>
								<label>Full</label>
							</div>

							<div>
								<input
									className="form-radio bg-transparent text-teal-brand mr-2 w-4 h-4 cursor-pointer"
									type="radio"
									id="Advance"
									onChange={type => {
										setType(type.target.value)
									}}
									name="type"
									value="Advance"
								/>
								<label>Advance</label>
							</div>
							<div>
								<input
									className="form-radio bg-transparent text-teal-brand mr-2 w-4 h-4 cursor-pointer"
									type="radio"
									onChange={type => {
										setType(type.target.value)
									}}
									id="Deducted"
									name="type"
									value="Deducted"
								/>
								<label>Deducted</label>
							</div>
						</div>
						<h1 className="text-xl text-gray-100 font-normal mt-3">Paid Amount*</h1>

						<div className="w-full rounded  focus:outline-none focus-within:outline-none mt-2">
							<input
								type="number"
								placeholder={'Salary'}
								className="w-full bg-transparent rounded border-2 border-blue-300 outline-none  placeholder-gray-400 text-white"
								value={state.amount}
								onChange={text =>
									setState({
										...state,
										amount: text.target.valueAsNumber
									})
								}
							/>
						</div>
						{type !== 'Full' && (
							<div>
								<h1 className="text-xl text-gray-100 font-normal mt-3">
									{type + ' Reason'}
								</h1>
								<div className="w-full rounded  focus:outline-none focus-within:outline-none mt-2">
									<input
										type="text"
										placeholder={'Salary'}
										className="w-full bg-transparent rounded border-2 border-blue-300 outline-none  placeholder-gray-400 text-white"
										value={reason}
										onChange={text => setReason(text.target.value)}
									/>
								</div>
							</div>
						)}
						<h1 className="text-xl text-gray-100 font-normal mt-3">Date*</h1>
						<div className="w-full mt-2">
							<input
								disabled={type === 'Full' ? true : false}
								defaultValue={moment(state.date).format('YYYY-MM-DD')}
								className={clsx(
									'w-full bg-transparent rounded border-2 border-blue-300 outline-none  placeholder-gray-400',
									type === 'Full' ? 'text-gray-400' : 'text-white'
								)}
								type="date"
								onChange={e =>
									setState({
										...state,
										date: e.target.valueAsNumber
									})
								}
							/>
						</div>
						<div
							onClick={() => paySalary()}
							className="flex flex-1 flex-row justify-center text-center mt-6 pl-4 pr-4 pt-2 pb-2 ml-1 mr-1 rounded-md bg-teal-brand lg:mt-10">
							<h1 className="text-xl text-gray-100 font-semibold">
								{type === 'Full' ? 'Pay Salary' : 'Pay ' + type}
							</h1>
						</div>
					</div>
				</div>
				<div className="lg:flex-1   ">
					<div className="text-white lg:pl-14 font-medium bg-gray-600 mx-3 rounded-t-2xl mt-4 lg:bg-white lg:text-black lg:rounded-2xl lg:flex lg:p-5 lg:items-center lg:flex-1 lg:flex-row lg:shadow-lg lg:border lg:border-gray-300 ">
						<div>
							<img
								src={
									teacher.ProfilePicture?.url ||
									teacher.ProfilePicture?.image_string ||
									UserIconSvg
								}
								className="mx-auto h-20 w-20 rounded-full shadow-lg bg-gray-500 hover:bg-gray-700"
								alt={teacher.Name || 'faculty'}
							/>
						</div>
						<div className="flex flex-col  text-center lg:text-left lg:ml-6 lg:flex-1 lg:flex ">
							<h1 className="lg:text-3xl">{teacher.Name}</h1>
							<h1 className="lg:text-2xl">{'Salary: ' + teacher.Salary}</h1>
						</div>
					</div>
					<div
						className="bg-white hidden font-medium  mx-3 rounded-t-2xl mt-4 lg:bg-white
                     lg:text-black lg:rounded-2xl lg:flex lg:p-5 lg:items-center lg:flex-1 flex-col lg:text-center lg:justify-center
                      lg:shadow-lg lg:border lg:border-gray-300 ">
						<h1 className="lg:text-xl lg:font-medium hidden">View Past Payments</h1>
						<div className="w-full flex flex-1 flex-col space-y-3  mt-2 overflow-y-scroll max-h-96">
							<div className="flex flex-1 text-left ">
								<div className="flex-1">Month</div>
								<div className="flex-1 text-center">Deductions</div>
								<div className="flex-1 text-right">Paid</div>
							</div>
							{salaries ? (
								salaries.map(entry => {
									return (
										<div className="flex flex-1 text-left ">
											<div
												className={clsx(
													'flex-1',
													entry.deduction > 0 ? 'text-red-500' : ''
												)}>
												{moment(entry.date).format('MMMM') +
													' ' +
													moment(entry.date).format('YYYY')}
											</div>
											<div
												className={clsx(
													'flex-1 text-center',
													entry.deduction > 0 ? 'text-red-500' : ''
												)}>
												{entry.deduction}
											</div>
											<div className="flex-1 text-right">{entry.amount}</div>
										</div>
									)
								})
							) : (
								<div>No Data Available</div>
							)}
						</div>
						<div className="flex w-full flex-1 text-left  border-gray-500 mt-4 border-t-2 border-dashed ">
							<div className="flex-1 font-semibold">Total</div>
							<div className="flex-1 font-semibold text-center text-red-500">
								{totalDeductions}
							</div>
							<div className="flex-1 font-semibold text-right">{totalPaid}</div>
						</div>
					</div>
				</div>
			</div>
			<Transition
				as={Fragment}
				show={detialsExpanded}
				enter="transform transition duration-[400ms]"
				enterFrom="opacity-0 rotate-[-120deg] scale-50"
				enterTo="opacity-100 rotate-0 scale-100"
				leave="transform duration-200 transition ease-in-out"
				leaveFrom="opacity-100 rotate-0 scale-100 "
				leaveTo="opacity-0 scale-95 ">
				<div
					style={{
						top: detailsButtonRef?.current?.offsetTop || 0,
						height: mainFormRef?.current?.offsetHeight + 100 || '50%',
						width: mainFormRef?.current?.offsetWidth || '50%'
					}}
					className={` bg-white rounded-md shadow-lg z-50 ml-3 absolute  p-5 lg:hidden`}>
					<div className="bg-white text-blue-400 rounded-full py-2 px-2 font-semibold cursor-pointer mb-4 flex flex-row justify-center items-center lg:hidden">
						<h1
							onClick={() => {
								setDetailsExpanded(!detialsExpanded)
							}}>
							Hide Past Payments
						</h1>
						<ChevronUpIcon
							onClick={() => {
								setDetailsExpanded(!detialsExpanded)
							}}
							className="w-4 h-4 text-blue-400 ml-3"
						/>
					</div>
					<div className="w-full flex flex-1 flex-col space-y-3  mt-2 overflow-y-scroll max-h-72">
						<div className="flex flex-1 text-left ">
							<div className="flex-1 font-medium">Month</div>
							<div className="flex-1 font-medium text-center">Deductions</div>
							<div className="flex-1 font-medium text-right">Paid</div>
						</div>
						{salaries ? (
							salaries.map(entry => {
								return (
									<div className="flex flex-1 text-left ">
										<div
											className={clsx(
												'flex-1',
												entry.deduction > 0 ? 'text-red-500' : ''
											)}>
											{moment(entry.date).format('MMMM') +
												' ' +
												moment(entry.date).format('YYYY')}
										</div>
										<div
											className={clsx(
												'flex-1 text-center',
												entry.deduction > 0 ? 'text-red-500' : ''
											)}>
											{entry.deduction}
										</div>
										<div className="flex-1 text-right">{entry.amount}</div>
									</div>
								)
							})
						) : (
							<div>No Data Available</div>
						)}
					</div>
					<div className="flex flex-1 text-left  border-gray-500 mt-4 border-t-2 border-dashed ">
						<div className="flex-1 font-semibold">Total</div>
						<div className="flex-1 font-semibold text-center text-red-500">
							{totalDeductions}
						</div>
						<div className="flex-1 font-semibold text-right">{totalPaid}</div>
					</div>
					<div
						onClick={() => setDetailsExpanded(!detialsExpanded)}
						className="flex flex-1 flex-row justify-center text-center mt-6 pl-4 pr-4 pt-2 pb-2 ml-1 mr-1 rounded-md bg-yellow-tip-brand lg:mt-10">
						<h1 className="text-xl text-gray-100 font-semibold">Go Back</h1>
					</div>
				</div>
			</Transition>
		</AppLayout>
	)
}

export default SalaryForm
