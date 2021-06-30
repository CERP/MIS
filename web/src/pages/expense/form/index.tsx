import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import moment from 'moment'
import toast from 'react-hot-toast'
import { RouteComponentProps } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
// import { CameraIcon } from '@heroicons/react/outline'

import { addExpense, deleteExpense, editExpense } from 'actions'
import { AppLayout } from 'components/Layout/appLayout'
import { ExpenseCategories } from 'constants/expense'
import { useComponentVisible } from 'hooks/useComponentVisible'
import { TModal } from 'components/Modal'
import { toTitleCase } from 'utils/toTitleCase'

const initialState = {
	date: new Date().getTime(),
	type: 'PAYMENT_GIVEN',
	expense: 'MIS_EXPENSE'
} as Partial<MISExpense>

export const ExpenseForm = ({ match, history }: RouteComponentProps<{ id: string }>) => {
	const dispatch = useDispatch()
	const key = match.params.id
	const expense: any = useSelector((state: RootReducerState) => state.db.expenses)
	const faculty = useSelector((state: RootReducerState) => state.db.faculty)
	const faculty_id = useSelector((state: RootReducerState) => state.auth.faculty_id)

	const { Admin } = faculty[faculty_id]

	const { ref, setIsComponentVisible, isComponentVisible } = useComponentVisible(false)
	const isNewExpenseItem = () => location.pathname.indexOf('new') >= 0
	const expenseId = match.params.id
	const expenses: any = useSelector((state: RootReducerState) => state.db.expenses)

	const [state, setState] = useState(expenses[expenseId] ?? initialState)

	useEffect(() => {
		if (!isNewExpenseItem() && expenses) {
			setState(expenses[expenseId])
		}
	}, [expenses])

	const handleAddOrUpdateExpense = () => {
		if (!state.label) {
			toast.error('Label can not be empty')
			return
		}
		if (
			state.quantity <= 0 ||
			state.amount <= 0 ||
			state.quantity === undefined ||
			state.amount === undefined
		) {
			toast.error('Quantity and Amount cannot be zero')
			return
		}

		if (!state.category) {
			toast.error('Please select a Category')
			return
		}

		if (isNewExpenseItem()) {
			dispatch(addExpense(state))
			toast.success('New Expense entry has been added')
			setTimeout(() => {
				history.goBack()
			}, 1200)
			return
		}

		dispatch(
			editExpense({
				[expenseId]: { amount: state.amount }
			})
		)
		toast.success('Expense entry has been updated')
	}

	const handleDeleteExpense = () => {
		dispatch(deleteExpense(key))

		setTimeout(() => {
			history.goBack()
		}, 500)
	}

	const categories = Object.keys(ExpenseCategories).filter(obj => obj.toString() !== 'SALARY')

	const pageTitle = isNewExpenseItem() ? 'Add expense' : 'Edit Expense'

	return (
		<AppLayout title={pageTitle} showHeaderTitle>
			<div className="p-5 md:p-10 md:pt-5 md:pb-0 relative print:hidden">
				<div className="bg-gray-700 rounded-2xl flex flex-1 flex-col text-white">
					{state && (
						<>
							<div className="m-5">
								<CustomInput
									editable={isNewExpenseItem()}
									type="text"
									disabled={!isNewExpenseItem()}
									title="Label"
									defaultValue={state.label}
									placeHolder="Please Write Description Here"
									onChange={e =>
										setState({
											...state,
											label: e.target.value
										})
									}
								/>
								<div className="w-full flex flex-1 flex-row mt-3">
									<div className="w-1/2 mr-2">
										<CustomInput
											editable={isNewExpenseItem()}
											type="number"
											disabled={!isNewExpenseItem()}
											title="Quantity"
											defaultValue={state.quantity}
											placeHolder="No. of Items"
											onChange={e =>
												setState({
													...state,
													quantity: e.target.value
												})
											}
										/>
									</div>
									<div className="w-1/2 ml-2">
										<CustomInput
											editable={true}
											type="number"
											disabled={false}
											title="Amount"
											defaultValue={state.amount}
											placeHolder="Enter Amount"
											onChange={e =>
												setState({
													...state,
													amount: e.target.value
												})
											}
										/>
									</div>
								</div>
								<p className="font-normal mt-3">Category</p>
								<div className="flex flex-1 flex-row space-x-2  mt-2 flex-wrap">
									{categories
										.filter(cat => cat.toLowerCase() !== 'other')
										.map((cat, index) => {
											return (
												<button
													onClick={() =>
														setState({ ...state, category: cat })
													}
													disabled={!isNewExpenseItem()}
													title={cat}
													key={cat + index}
													className={clsx(
														'rounded-full outline-none space-y-2 mt-3 p-2 mr-2 text-xs border-white border-2 cursor-pointer hover:bg-teal-brand',
														state.category === cat
															? 'bg-teal-brand text-white'
															: 'bg-transparent',
														{
															'pointer-events-none bg-gray-400': !isNewExpenseItem()
														}
													)}>
													{toTitleCase(cat)}
												</button>
											)
										})}
								</div>
								<p className="font-normal mt-3">Date*</p>
								<div className="w-full mt-2">
									<input
										disabled={!isNewExpenseItem()}
										defaultValue={moment(state.date).format('YYYY-MM-DD')}
										className={clsx(
											'w-full tw-input tw-is-form-bg-black',
											isNewExpenseItem() ? 'text-white' : 'text-gray-400'
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
								{/* <div className="flex flex-1 flex-row justify-between items-center mt-5">
							<p className="font-normal">Attach Image</p>
							<div className="items-center justify-center flex w-10 h-10 bg-white rounded-full p-1">
								<CameraIcon className="text-teal-brand"></CameraIcon>
							</div>
						</div> */}
								<div className="space-y-4 mt-4">
									<button
										onClick={() => handleAddOrUpdateExpense()}
										className="flex flex-1 flex-row justify-between w-full pl-4 pr-4 pt-2 pb-2 rounded-md bg-teal-brand cursor-pointer">
										<p className="font-semibold">
											{isNewExpenseItem() ? 'Add Expense' : 'Edit Expense'}
										</p>
										<p className="font-semibold">
											Rs{' '}
											{state.quantity && state.amount
												? state.quantity * state.amount
												: 0}
										</p>
									</button>
									{!isNewExpenseItem() && Admin && (
										<button
											onClick={() => setIsComponentVisible(true)}
											className="w-full flex flex-1 flex-row justify-center pl-4 pr-4 pt-2 pb-2 rounded-md bg-red-brand font-semibold cursor-pointer">
											Delete Expense
										</button>
									)}
								</div>
							</div>

							{isComponentVisible && (
								<TModal>
									<div
										className="bg-white md:p-10 p-8 text-center text-sm"
										ref={ref}>
										<div className="font-semibold text-lg">
											Are you sure you want to delete this expense? This
											action cannot be reversed
										</div>

										<div className="flex flex-row justify-between space-x-4 mt-4">
											<button
												onClick={() => setIsComponentVisible(false)}
												className="py-1 md:py-2 tw-btn bg-gray-400 hover:bg-gray-500 text-white w-full">
												Cancel
											</button>
											<button
												onClick={handleDeleteExpense}
												className="py-1 md:py-2 tw-btn-red w-full font-semibold">
												Confirm
											</button>
										</div>
									</div>
								</TModal>
							)}
						</>
					)}
				</div>
			</div>
		</AppLayout>
	)
}

function CustomInput(props: {
	title: string
	defaultValue: string | number
	placeHolder: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	disabled: boolean
	type?: string
	editable?: boolean
}) {
	return (
		<div>
			<p className="font-normal">{props.title}*</p>
			<div className="w-full rounded  focus:outline-none focus-within:outline-none mt-2">
				<input
					type={props.type}
					disabled={props.disabled}
					placeholder={props.placeHolder}
					className={clsx(
						'tw-input w-full tw-is-form-bg-black',
						props.editable ? 'text-white' : 'text-gray-400'
					)}
					defaultValue={props.defaultValue}
					onChange={props.onChange}
				/>
			</div>
		</div>
	)
}
