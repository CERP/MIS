import React, { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface propTypes {
	expenseData: { [index: string]: MISExpense | MISSalaryExpense }
	date: number
}

const getDay = (date: number) => {
	let d = new Date(date)
	return d.getDate()
}
const getMonth = (date: number) => {
	let d = new Date(date)
	return d.getMonth() + 1
}
const getYear = (date: number) => {
	let d = new Date(date)
	return d.getFullYear()
}
const getWeekDay = (date: number) => {
	let d = new Date(date)
	let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

	return days[d.getDay()]
}

type State = {
	totalDayExpense: number
}

const calculateExpense = (exp: any) => {
	let total = 0
	Object.values(exp).forEach((entry: any) => {
		total = parseFloat(total.toString()) + parseFloat(String(entry.amount).toString())
	})
	return total
}

const ExpenseCard: FC<propTypes> = ({ expenseData, date }) => {
	const [state, setState] = useState<State>({ totalDayExpense: 0 })
	useEffect(() => {
		setState({ totalDayExpense: calculateExpense(expenseData) })
	}, [])
	return (
		<div className="p-3 m-5 rounded flex flex-col justify-between border shadow-md  border-gray-50">
			<div className="flex flex-row justify-between w-full items-center border-b  pb-1 border-gray-400 border-0 mb-2">
				<div className="flex flex-row items-center">
					<h1 className="text-3xl font-bold mr-1">{getDay(date)}</h1>
					<div>
						<h1 style={{ fontSize: 10 }} className="font-bold text-gray-400">
							{getMonth(date)}.{getYear(date)}
						</h1>
						<div className="p-1 bg-gray-400 rounded justify-center items-center text-center">
							<h1 style={{ fontSize: 10 }} className="font-bold text-white">
								{getWeekDay(date)}
							</h1>
						</div>
					</div>
				</div>
				<h1 style={{ color: '#40C0C6' }} className="font-medium">
					Rs 0
				</h1>
				<h1 className="font-medium text-red-500">Rs {state.totalDayExpense}</h1>
			</div>
			{Object.entries(expenseData).map(([key, e]) => {
				return (
					//expense[0] is key and expense[1] is the Data
					<div key={key} className="flex flex-row justify-between mb-2">
						<div className="flex flex-1 items-center font-medium text-gray-500">
							<h1 className="text-sm">{e.category}</h1>
						</div>

						<Link
							to={e.expense === 'MIS_EXPENSE' ? `/expenses/${key}` : '#'}
							className="flex flex-1 ml-5 font-medium">
							<h1>{e.label}</h1>
						</Link>
						<div className="flex flex-1 justify-end font-medium">
							<h1>Rs {e.amount}</h1>
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default ExpenseCard
