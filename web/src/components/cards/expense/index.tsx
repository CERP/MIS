import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

interface ExpenseCardProps {
	expenseData: { [index: string]: MISExpense | MISSalaryExpense }
	date: number
	payments: MISStudentPayment[]
}

type State = {
	totalDayExpense: number
	totalDayIncome: number
}

const Parser = (val: number): number => {
	const value = Number(val)
	if (Number.isFinite(value)) {
		return val
	}
	return 0
}

const calculateExpense = (exp: { [id: string]: MISSalaryExpense | MISExpense }) => {
	return Object.values(exp ?? {}).reduce((agg: number, entry: MISExpense | MISSalaryExpense) => {
		if (entry.expense === 'MIS_EXPENSE') {
			return agg + Parser(entry.amount) * Parser(entry.quantity)
		}
		return agg + Parser(entry.amount)
	}, 0)
}

const calculateIncome = (payments: MISStudentPayment[], date: number): number => {
	return (payments ?? []).reduce((agg: number, payment: MISStudentPayment) => {
		if (moment(date).format('D') === moment(payment.date).format('D')) {
			return agg + payment.amount
		} else {
			return agg + 0
		}
	}, 0)
}

const ExpenseCard = ({ date, expenseData, payments }: ExpenseCardProps) => {
	const [state, setState] = useState<State>({ totalDayExpense: 0, totalDayIncome: 0 })
	useEffect(() => {
		setState({
			totalDayExpense: calculateExpense(expenseData),
			totalDayIncome: calculateIncome(payments, date)
		})
	}, [])
	return (
		<div className="p-3 m-5 rounded flex flex-col justify-between border shadow-md  border-gray-50">
			<div className="flex flex-row justify-between w-full items-center border-b  pb-1 border-gray-400 border-0 mb-2">
				<div className="flex flex-row items-center">
					<h1 className="text-3xl font-bold mr-1">{moment(date).format('DD')}</h1>
					<div>
						<h1 className="text-xs font-bold text-gray-400">
							{moment(date).format('MM')}.{moment(date).format('YYYY')}
						</h1>
						<div className="p-1 bg-gray-400 rounded justify-center items-center text-center">
							<h1 className="text-xs font-bold text-white">
								{moment(date).format('ddd')}
							</h1>
						</div>
					</div>
				</div>
				<h1 className="font-medium text-teal-brand">Rs {state.totalDayIncome}</h1>
				<h1 className="font-medium text-red-500">Rs {state.totalDayExpense}</h1>
			</div>
			{Object.entries(expenseData ?? {}).map(([id, expense]) => {
				return (
					//expense[0] is key and expense[1] is the Data
					<div key={id} className="flex flex-row justify-between mb-2">
						<div className="flex flex-1 items-center font-medium text-gray-500">
							<h1 className="text-sm">{expense.category}</h1>
						</div>

						<Link
							to={expense.expense === 'MIS_EXPENSE' ? `/expenses/${id}` : '#'}
							className="flex flex-1 ml-5 z-20 font-medium">
							<h1>{expense.label}</h1>
						</Link>
						{expense.expense === 'MIS_EXPENSE' ? (
							<div className="flex flex-1 justify-end font-medium">
								<h1>Rs {Number(expense.amount) * Number(expense.quantity)}</h1>
							</div>
						) : (
							<div className="flex flex-1 justify-end font-medium">
								<h1>Rs {Number(expense.amount)}</h1>
							</div>
						)}
					</div>
				)
			})}
		</div>
	)
}

export default ExpenseCard
