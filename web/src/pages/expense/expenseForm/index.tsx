import { CameraIcon } from '@heroicons/react/outline'
import { addExpense, editExpense } from 'actions'
import { AppLayout } from 'components/Layout/appLayout'
import { ExpenseCategories } from 'constants/expense'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface addExpense {
	label: string
	amount: number
	date: number
	category: string
	type: 'PAYMENT_GIVEN'
	quantity: number
}

function CustomInput(props: {
	title: string
	defaultValue: string | number
	placeHolder: string
	onChange: any
	disabled: boolean
	type?: string
}) {
	return (
		<div>
			<h1 className="text-xl text-gray-100 font-normal ">{props.title}*</h1>
			<div className="w-full rounded  focus:outline-none focus-within:outline-none mt-2">
				<input
					type="text"
					disabled={props.disabled}
					placeholder={props.placeHolder}
					className="w-full bg-transparent rounded border-2 border-blue-300 outline-none text-white placeholder-gray-400"
					defaultValue={props.defaultValue}
					onChange={props.onChange}
				/>
			</div>
		</div>
	)
}

const index = (props: { match: { params: { id: any } } }) => {
	let key: string = props.match.params.id
	const expense: any = useSelector((state: RootReducerState) => state.db.expenses[key])
	const [state, setState] = useState<addExpense>()
	const dispatch = useDispatch()

	const isNew = () => key === 'new'

	const handleAddorChange = () => {
		if (state.label === undefined || state.label == '') {
			alert('Label can not be empty')
			return
		}
		if (
			state.quantity <= 0 ||
			state.amount <= 0 ||
			state.quantity === undefined ||
			state.amount === undefined
		) {
			alert('Quantity and Amount cannot be zero')
			return
		}
		{
			if (state.category === undefined) {
				alert('Please select a Category')
				return
			}
		}
		if (isNew()) {
			dispatch(
				addExpense(
					state.amount,
					state.label,
					state.type,
					state.category,
					state.quantity,
					state.date
				)
			)
		} else {
			dispatch(
				editExpense({
					[key]: { amount: state.amount }
				})
			)
		}
	}

	const categories = Object.keys(ExpenseCategories).filter(obj => obj.toString() !== 'SALARY')
	const selectCategory = (e: any) => {
		setState({
			...state,
			category: e.target.innerText
		})
	}

	//useDispatch(addExpense())
	useEffect(() => {
		if (key === 'new') {
			setState({
				amount: undefined,
				quantity: undefined,
				category: undefined,
				date: new Date().getTime(),
				label: undefined,
				type: 'PAYMENT_GIVEN'
			})
		} else {
			setState({
				amount: expense.amount,
				category: expense.category,
				date: expense.date,
				label: expense.label,
				quantity: expense.quantity,
				type: 'PAYMENT_GIVEN'
			})
		}
	}, [])
	return (
		<AppLayout>
			<div className="bg-gray-600 mt-4 ml-3 mr-3 rounded-2xl flex flex-1 flex-col ">
				<h1 className="self-center text-center text-xl text-gray-200 font-light mt-2">
					Add Items for Expense
				</h1>
				{state && (
					<div className="m-5">
						<CustomInput
							disabled={!isNew()}
							title="Label"
							defaultValue={state.label}
							placeHolder="Please Write Description Here"
							onChange={(e: { target: { value: any } }) =>
								setState({
									...state,
									label: e.target.value
								})
							}
						/>
						<div className="w-full flex flex-1 flex-row mt-3">
							<div className="w-1/2 mr-2">
								<CustomInput
									disabled={!isNew()}
									title="Quantity"
									defaultValue={state.quantity}
									placeHolder="Number of Items"
									onChange={(e: { target: { value: any } }) =>
										setState({
											...state,
											quantity: e.target.value
										})
									}
								/>
							</div>
							<div className="w-1/2 ml-2">
								<CustomInput
									disabled={false}
									title="Amount"
									defaultValue={state.amount}
									placeHolder="Enter Amount"
									onChange={(e: { target: { value: any } }) =>
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
							{categories.map(cat => {
								return (
									<div
										className="rounded-full p-1 mt-1 text-gray-200 text-xs border-gray-200 border-2"
										style={
											state.category === cat
												? { backgroundColor: '#1bb4bb' }
												: { backgroundColor: 'transparent' }
										}>
										<h1 onClick={e => selectCategory(e)}>{cat}</h1>
									</div>
								)
							})}
						</div>
						<h1 className="text-xl text-gray-100 font-normal mt-3">Date*</h1>
						<div className="w-full mt-2">
							<input
								disabled={!isNew()}
								defaultValue={moment(state.date).format('YYYY-MM-DD')}
								className="w-full bg-transparent rounded border-2 border-blue-300 outline-none text-white placeholder-gray-400"
								type="date"
								onChange={(e: { target: { value: any } }) =>
									setState({
										...state,
										date: new Date(e.target.value).getTime()
									})
								}
							/>
						</div>
						<div className="flex flex-1 flex-row justify-between items-center mt-5">
							<h1 className="text-xl text-gray-100 font-normal">Attach Image</h1>
							<div className="items-center justify-center flex w-10 h-10 bg-white rounded-full p-1">
								<CameraIcon color={'#1CB4BB'}></CameraIcon>
							</div>
						</div>
						<div
							onClick={() => handleAddorChange()}
							className="flex flex-1 flex-row justify-between mt-6 pl-4 pr-4 pt-2 pb-2 ml-1 mr-1 rounded-md"
							style={{ backgroundColor: '#1BB4BB' }}>
							<h1 className="text-xl text-gray-100 font-semibold">
								{key === 'new' ? 'Add Expense' : 'Edit Expense'}
							</h1>
							<h1 className="text-xl text-gray-100 font-semibold">
								Rs{' '}
								{state.quantity !== undefined && state.amount !== undefined
									? state.quantity * state.amount
									: '0'}
							</h1>
						</div>
					</div>
				)}
			</div>
		</AppLayout>
	)
}

export default index
