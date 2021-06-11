import React, { Fragment, useEffect, useState, useRef } from 'react'
import clsx from 'clsx'
import moment from 'moment'
import toast from 'react-hot-toast'
import { Transition } from '@headlessui/react'
import { RouteComponentProps } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { addSalaryExpense } from 'actions'
import UserIconSvg from 'assets/svgs/user.svg'
import toTitleCase from 'utils/toTitleCase'

type StaffMemberSalaryProps = RouteComponentProps<{ id: string }>

enum SalaryType {
	FULL = 'Full',
	DEDUCTED = 'Deducted',
	ADVANCE = 'Advance'
}

interface localState {
	detailsExpanded: boolean
	type: string
	reason: string
	totalDeductions: number
	totalPaid: number
}

const getFacultySalaries = (
	salaries: (MISExpense | MISSalaryExpense)[],
	id: string
): MISSalaryExpense[] => {
	return salaries.reduce((agg, salary) => {
		if (salary.expense === 'SALARY_EXPENSE' && salary.faculty_id === id) {
			return [...agg, salary]
		}
		return agg
	}, [] as MISSalaryExpense[])
}

export const StaffMemberSalary = ({ match }: StaffMemberSalaryProps) => {
	const teacher = useSelector((state: RootReducerState) => state.db.faculty[match.params.id])
	const allSalaries = useSelector((state: RootReducerState) => state.db.expenses)

	const [salaries, setSalaries] = useState<MISSalaryExpense[]>(
		getFacultySalaries(Object.values(allSalaries), match.params.id)
	)
	const [salariesState, setState] = useState<Partial<MISSalaryExpense>>({
		amount: parseFloat(teacher.Salary),
		date: new Date().getTime(),
		advance: 0,
		deduction: 0,
		deduction_reason: '',
		faculty_id: match.params.id,
		category: 'SALARY',
		label: teacher.Name,
		type: 'PAYMENT_GIVEN'
	})

	const [localState, setLocalState] = useState<localState>({
		detailsExpanded: false,
		type: 'Full',
		reason: '',
		totalDeductions: 0,
		totalPaid: 0
	})

	const dispatch = useDispatch()
	const detailsButtonRef = useRef(undefined)
	const mainFormRef = useRef(undefined)

	useEffect(() => {
		setSalaries(getFacultySalaries(Object.values(allSalaries), match.params.id))
	}, [allSalaries])

	const paySalary = () => {
		if (
			typeof salariesState.amount === 'string' ||
			typeof salariesState.amount === 'undefined'
		) {
			toast.error('Amount must be a number')
			return
		} else if (salariesState.amount < 0) {
			toast.error('Amount cannot be less than 0')
			return
		}
		if (isNaN(salariesState.amount)) {
			toast.error('Please Specify an amount')
			return
		}

		const id = `${moment(salariesState.date).format('MM-YYYY')}-${teacher.id}`
		if (salaries !== undefined) {
			if (Object.keys(allSalaries).includes(id)) {
				if (allSalaries[id].amount > 0) {
					toast.error('Salary Already paid')
					return
				}
			}
		}

		switch (localState.type) {
			case SalaryType.FULL:
				dispatch(addSalaryExpense(salariesState))

				toast.success('Payment Made')
				break

			case SalaryType.DEDUCTED:
				if (parseFloat(teacher.Salary) <= 0 || teacher.Salary == '') {
					toast.error('Can not use this option without setting teacher Salary')
					break
				}

				let deducted = parseFloat(teacher.Salary) - salariesState.amount
				dispatch(addSalaryExpense({ ...salariesState, deduction: deducted }))

				toast.success('Payment Made')
				break

			case SalaryType.ADVANCE:
				if (parseFloat(teacher.Salary) <= 0 || teacher.Salary == '') {
					toast.error('Can not use this option without setting teacher Salary')
					break
				}
				if (moment(salariesState.date).endOf('month') <= moment().endOf('month')) {
					toast.error('Please give advance for a month other than the current one')
					break
				}

				dispatch(
					addSalaryExpense({ ...salariesState, advance: salariesState.amount, amount: 0 })
				)

				toast.success('Payment Made')
				break

			default:
				break
		}
	}

	const { deduction, paid } = (salaries ?? []).reduce(
		(agg, salary) => ({
			deduction: agg.deduction + salary.deduction,
			paid: agg.paid + salary.amount + salary.advance
		}),
		{ deduction: 0, paid: 0 }
	)

	return (
		<>
			<div className="flex flex-col-reverse lg:flex-row lg:mx-32">
				<div
					ref={mainFormRef}
					className="bg-gray-700 mx-3 rounded-b-2xl flex flex-1 flex-col lg:mt-4 lg:rounded-2xl  lg:px-8">
					<div className="m-5 text-gray-50 space-y-2 lg:space-y-4">
						<div
							onClick={() => {
								setLocalState({
									...localState,
									detailsExpanded: !localState.detailsExpanded
								})
							}}
							className="w-full flex justify-center items-center">
							<div
								ref={detailsButtonRef}
								className="bg-blue-400 rounded-full py-2 px-2 text-white font-semibold cursor-pointer mb-4 flex flex-row justify-between items-center lg:hidden">
								<h1>View Past Payments </h1>
								<ChevronDownIcon className="w-4 h-4 text-white ml-3" />
							</div>
						</div>
						<h1 className="text-center text-xl font-semibold text-white hidden lg:block">
							Pay Salary
						</h1>
						<h1 className="text-xl text-gray-100 font-normal">Salary*</h1>
						<div className="flex flex-row justify-between items-center">
							<div className="flex items-center space-x-2">
								<input
									type="radio"
									id="Full"
									name="type"
									value="Full"
									onChange={type => {
										setLocalState({ ...localState, type: type.target.value })
										setState({ ...salariesState, date: new Date().getTime() })
									}}
									className="tw-radio form-radio"
								/>
								<label htmlFor="Full">Full</label>
							</div>

							<div className="flex items-center space-x-2">
								<input
									className="tw-radio form-radio"
									type="radio"
									id="dvance"
									onChange={type => {
										setLocalState({ ...localState, type: type.target.value })
									}}
									name="type"
									value="Advance"
								/>
								<label htmlFor="Advance">Advance</label>
							</div>
							<div className="flex items-center space-x-2">
								<input
									className="tw-radio form-radio"
									type="radio"
									onChange={type => {
										setLocalState({ ...localState, type: type.target.value })
										setState({ ...salariesState, date: new Date().getTime() })
									}}
									id="Deducted"
									name="type"
									value="Deducted"
								/>
								<label htmlFor="Deducted">Deducted</label>
							</div>
						</div>
						<h1 className="text-xl text-gray-100 font-normal">Paid Amount*</h1>

						<div className="w-full rounded  focus:outline-none focus-within:outline-none mt-2">
							<input
								type="number"
								placeholder={'Salary'}
								className="tw-input w-full tw-is-form-bg-black"
								value={salariesState.amount}
								onChange={text =>
									setState({
										...salariesState,
										amount: text.target.valueAsNumber
									})
								}
							/>
						</div>
						{localState.type !== 'Full' && (
							<div>
								<h1 className="text-xl text-gray-100 font-normal">
									{localState.type + ' Reason'}
								</h1>
								<div className="w-full rounded  focus:outline-none focus-within:outline-none mt-2">
									<input
										type="text"
										placeholder={'Salary'}
										className="tw-input w-full tw-is-form-bg-black"
										value={localState.reason}
										onChange={text =>
											setLocalState({
												...localState,
												reason: text.target.value
											})
										}
									/>
								</div>
							</div>
						)}
						<h1 className="text-xl text-gray-100 font-normal">Date*</h1>
						<div className="w-full mt-2">
							<input
								disabled={localState.type === 'Advance' ? false : true}
								value={moment(salariesState.date).format('YYYY-MM-DD')}
								className={clsx(
									'tw-input w-full tw-is-form-bg-black',
									localState.type === 'Advance' ? 'text-white' : 'text-gray-400'
								)}
								type="date"
								onChange={e =>
									setState({
										...salariesState,
										date: e.target.valueAsNumber
									})
								}
							/>
						</div>
						<button
							onClick={() => paySalary()}
							className="tw-btn bg-teal-brand text-white w-full">
							<span>
								{localState.type === 'Full'
									? 'Pay Salary'
									: 'Pay ' + localState.type}
							</span>
						</button>
					</div>
				</div>
				<div className="lg:flex-1">
					<div className="text-white lg:pl-14 font-medium bg-gray-700 mx-3 rounded-t-2xl mt-4 lg:bg-white lg:text-black lg:rounded-2xl lg:flex lg:p-5 lg:items-center lg:flex-1 lg:flex-row lg:shadow-lg lg:border lg:border-gray-300">
						<div>
							<img
								src={
									teacher.ProfilePicture?.url ??
									teacher.ProfilePicture?.image_string ??
									UserIconSvg
								}
								className="mx-auto h-20 w-20 rounded-full shadow-lg bg-gray-500 hover:bg-gray-700"
								alt={teacher.Name}
							/>
						</div>
						<div className="flex flex-col  text-center lg:text-left lg:ml-6 lg:flex-1 lg:flex ">
							<h1 className="lg:text-xl">{toTitleCase(teacher.Name)}</h1>
							<h1 className="lg:text-lg">{'Salary: ' + teacher.Salary}</h1>
						</div>
					</div>
					<div
						className="bg-white hidden font-medium  mx-3 rounded-t-2xl mt-4 lg:bg-white
                     lg:text-black lg:rounded-2xl lg:flex lg:p-5 lg:items-center lg:flex-1 flex-col lg:text-center lg:justify-center
                      lg:shadow-lg lg:border lg:border-gray-300">
						<h1 className="lg:text-xl lg:font-medium hidden">View Past Payments</h1>
						<div className="w-full flex flex-1 flex-col space-y-2  mt-2 overflow-y-auto max-h-96">
							<div className="flex flex-1 text-left ">
								<div className="flex-1">Month</div>
								<div className="flex-1 text-center">Deductions</div>
								<div className="flex-1 text-right">Paid</div>
							</div>
							{salaries ? (
								salaries.map((salary, index) => {
									return (
										<div
											key={salary.faculty_id + index}
											className="flex flex-1 text-left text-sm">
											<div
												className={clsx(
													'flex-1',
													salary.deduction > 0 ? 'text-red-500' : ''
												)}>
												{moment(salary.date).format('MMMM') +
													' ' +
													moment(salary.date).format('YYYY')}
											</div>
											<div
												className={clsx(
													'flex-1 text-center',
													salary.deduction > 0 ? 'text-red-500' : ''
												)}>
												{salary.deduction}
											</div>
											<div className="flex-1 text-right">
												{salary.amount + salary.advance}
											</div>
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
								{deduction}
							</div>
							<div className="flex-1 font-semibold text-right">{paid}</div>
						</div>
					</div>
				</div>
			</div>
			<Transition
				as={Fragment}
				show={localState.detailsExpanded}
				enter="transform transition duration-[400ms]"
				enterFrom="opacity-0 rotate-[-120deg] scale-50"
				enterTo="opacity-100 rotate-0 scale-100"
				leave="transform duration-200 transition ease-in-out"
				leaveFrom="opacity-100 rotate-0 scale-100 "
				leaveTo="opacity-0 scale-95 ">
				<div
					style={{
						top: detailsButtonRef?.current?.offsetTop ?? 0,
						height: mainFormRef?.current?.offsetHeight + 100 ?? '50%',
						width: mainFormRef?.current?.offsetWidth ?? '50%'
					}}
					className={'bg-white rounded-md shadow-lg z-50 ml-3 absolute  p-5 lg:hidden'}>
					<div className="bg-white text-blue-400 rounded-full py-2 px-2 font-semibold cursor-pointer mb-4 flex flex-row justify-center items-center lg:hidden">
						<h1
							onClick={() => {
								setLocalState({
									...localState,
									detailsExpanded: !localState.detailsExpanded
								})
							}}>
							Hide Past Payments
						</h1>
						<ChevronUpIcon
							onClick={() => {
								setLocalState({
									...localState,
									detailsExpanded: !localState.detailsExpanded
								})
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
							salaries.map((salary, index) => {
								return (
									<div
										key={salary.faculty_id + index}
										className="flex flex-1 text-left ">
										<div
											className={clsx(
												'flex-1',
												salary.deduction > 0 ? 'text-red-500' : ''
											)}>
											{moment(salary.date).format('MMMM') +
												' ' +
												moment(salary.date).format('YYYY')}
										</div>
										<div
											className={clsx(
												'flex-1 text-center',
												salary.deduction > 0 ? 'text-red-500' : ''
											)}>
											{salary.deduction}
										</div>
										<div className="flex-1 text-right">
											{salary.amount + salary.advance}
										</div>
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
							{deduction}
						</div>
						<div className="flex-1 font-semibold text-right">{paid}</div>
					</div>
					<div
						onClick={() =>
							setLocalState({
								...localState,
								detailsExpanded: !localState.detailsExpanded
							})
						}
						className="flex flex-1 flex-row justify-center text-center mt-6 pl-4 pr-4 pt-2 pb-2 ml-1 mr-1 rounded-md bg-yellow-tip-brand lg:mt-10">
						<h1 className="text-xl text-gray-100 font-semibold">Go Back</h1>
					</div>
				</div>
			</Transition>
		</>
	)
}
