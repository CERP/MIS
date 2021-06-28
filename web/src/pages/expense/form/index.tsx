import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import moment from 'moment'
import toast from 'react-hot-toast'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CameraIcon } from '@heroicons/react/outline'

import { addExpense, deleteExpense, editExpense } from 'actions'
import { AppLayout } from 'components/Layout/appLayout'
import { ExpenseCategories } from 'constants/expense'
import { useComponentVisible } from 'hooks/useComponentVisible'
import { TModal } from 'components/Modal'

const initialState = {
	date: new Date().getTime(),
	type: 'PAYMENT_GIVEN',
	expense: 'MIS_EXPENSE'
} as Partial<MISExpense>

export const ExpenseForm = ({ match }: RouteComponentProps<{ id: string }>) => {
	const dispatch = useDispatch()
	const key = match.params.id
	const expense: any = useSelector((state: RootReducerState) => state.db.expenses)
	const faculty = useSelector((state: RootReducerState) => state.db.faculty)
	const faculty_id = useSelector((state: RootReducerState) => state.auth.faculty_id)

	const { Admin } = faculty[faculty_id]
	const history = useHistory()
	const { ref, setIsComponentVisible, isComponentVisible } = useComponentVisible(false)

	const [state, setState] = useState(expense[key] ?? initialState)

	useEffect(() => {
		if (key !== 'new' && expense) {
			setState(expense[key])
		}
	}, [expense])

	const isNew = () => key === 'new'

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

		if (isNew()) {
			dispatch(addExpense(state))
			toast.success('New Expense entry has been added')
			setTimeout(() => {
				history.goBack()
			}, 1200)
			return
		}

		dispatch(
			editExpense({
				[key]: { amount: state.amount }
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

	return (
		<AppLayout>
			<div className="bg-gray-600 m-4 rounded-2xl flex flex-1 flex-col">
				<h1 className="self-center text-center text-xl text-white font-semibold mt-4">
					Add Expense Items
				</h1>
				{state && (
					<div className="m-5">
						<CustomInput
							editable={isNew()}
							type="text"
							disabled={!isNew()}
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
									editable={isNew()}
									type="number"
									disabled={!isNew()}
									title="Quantity"
									defaultValue={state.quantity}
									placeHolder="Number of Items"
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
						<h1 className="text-xl text-gray-100 font-normal mt-3">Category</h1>
						<div className="flex flex-1 flex-row space-x-2  mt-2 flex-wrap">
							{categories
								.filter((cat, index) => cat.toLowerCase() !== 'other')
								.map((cat, index) => {
									return (
										<button
											onClick={() => setState({ ...state, category: cat })}
											title={cat}
											key={cat + index}
											className={clsx(
												'rounded-full outline-none space-y-2 mt-3 p-2 mr-2 text-gray-200 text-xs border-gray-200 border-2 cursor-pointer hover:bg-teal-brand',
												state.category === cat
													? 'bg-teal-brand'
													: 'bg-transparent',
												key === 'new'
													? 'text-gray-200'
													: 'text-gray-400 border-gray-400'
											)}>
											{cat}
										</button>
									)
								})}
						</div>
						<h1 className="text-xl text-gray-100 font-normal mt-3">Date*</h1>
						<div className="w-full mt-2">
							<input
								disabled={!isNew()}
								defaultValue={moment(state.date).format('YYYY-MM-DD')}
								className={clsx(
									'w-full bg-transparent rounded border-2 border-blue-300 outline-none  placeholder-gray-400',
									key === 'new' ? 'text-white' : 'text-gray-400'
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
							<h1 className="text-xl text-gray-100 font-normal">Attach Image</h1>
							<div className="items-center justify-center flex w-10 h-10 bg-white rounded-full p-1">
								<CameraIcon className="text-teal-brand"></CameraIcon>
							</div>
						</div> */}
						<div
							onClick={() => handleAddOrUpdateExpense()}
							className="flex flex-1 flex-row justify-between mt-6 pl-4 pr-4 pt-2 pb-2 rounded-md bg-teal-brand">
							<h1 className="text-xl text-gray-100 font-semibold">
								{key === 'new' ? 'Add Expense' : 'Edit Expense'}
							</h1>
							<h1 className="text-xl text-gray-100 font-semibold">
								Rs{' '}
								{state.quantity && state.amount ? state.quantity * state.amount : 0}
							</h1>
						</div>
						{!isNew() && Admin && (
							<div
								onClick={() => setIsComponentVisible(true)}
								className="flex flex-1 flex-row justify-center mt-6 pl-4 pr-4 pt-2 pb-2 rounded-md bg-red-brand">
								<h1 className="text-xl text-gray-100 font-semibold">
									Delete Expense
								</h1>
							</div>
						)}
						{isComponentVisible && (
							<TModal>
								<div className="bg-white md:p-10 p-8 text-center text-sm" ref={ref}>
									<div className="font-semibold text-lg">
										Are you sure you want to delete this expense? This action
										cannot be reversed
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
					</div>
				)}
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
			<h1 className="text-xl text-gray-100 font-normal">{props.title}*</h1>
			<div className="w-full rounded  focus:outline-none focus-within:outline-none mt-2">
				<input
					type={props.type}
					disabled={props.disabled}
					placeholder={props.placeHolder}
					className={clsx(
						'w-full bg-transparent rounded border-2 border-blue-300 outline-none  placeholder-gray-400',
						props.editable ? 'text-white' : 'text-gray-400'
					)}
					defaultValue={props.defaultValue}
					onChange={props.onChange}
				/>
			</div>
		</div>
	)
}
