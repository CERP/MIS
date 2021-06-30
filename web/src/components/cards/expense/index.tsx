import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toTitleCase } from 'utils/toTitleCase'

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
		return agg + Parser(entry.amount) + Parser(entry.advance)
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
		<div className="p-3 rounded flex flex-col justify-between border shadow-md  border-gray-50">
			<div className="flex flex-row justify-between w-full items-center border-b  pb-1 border-gray-400 border-0 mb-2">
				<div className="flex flex-row items-center">
					<p className="text-3xl font-bold mr-1">{moment(date).format('DD')}</p>
					<div>
						<p className="text-xs font-bold text-gray-400">
							{moment(date).format('MM')}.{moment(date).format('YYYY')}
						</p>
						<div className="p-1 bg-gray-400 rounded justify-center items-center text-center">
							<p className="text-xs font-bold text-white">
								{moment(date).format('ddd')}
							</p>
						</div>
					</div>
				</div>
				<p className="text-teal-brand font-medium">Rs. {state.totalDayIncome}</p>
				<p className="text-red-500 font-medium">Rs. {state.totalDayExpense}</p>
			</div>
			<div className="space-y-2">
				{Object.entries(expenseData ?? {}).map(([id, expense]) => {
					return (
						//expense[0] is key and expense[1] is the Data
						<div key={id} className="flex flex-row justify-between">
							<div className="flex flex-1 items-center">
								<p>{toTitleCase(expense.category)}</p>
							</div>

							{expense.expense === 'MIS_EXPENSE' ? (
								<Link
									to={`/expenses/${id}/edit`}
									className="flex flex-1 ml-5 text-blue-brand hover:underline">
									{expense.label}
								</Link>
							) : (
								<p>{expense.label}</p>
							)}
							{expense.expense === 'MIS_EXPENSE' ? (
								<div className="flex flex-1 justify-end">
									<p>{Number(expense.amount) * Number(expense.quantity)}</p>
								</div>
							) : (
								<div className="flex flex-1 justify-end">
									<p>{Number(expense.amount) + Number(expense.advance)}</p>
								</div>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default ExpenseCard
