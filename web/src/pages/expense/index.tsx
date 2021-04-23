import { AppLayout } from 'components/Layout/appLayout'
import { CustomSelect } from 'components/select'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import months from 'constants/months'
import { ChevronDownIcon, CubeTransparentIcon } from '@heroicons/react/solid'
import CalendarIcon from 'assets/svgs/react/Calendar'
import ExpenseCard from 'components/cards/expense'
import { Link } from 'react-router-dom'

type State = {
	month: string
	year: string
}

export const Expense = () => {
	const currentYear = moment().format('YYYY')
	const currentMonth = moment().format('MMMM')
	const expense = useSelector((state: RootReducerState) => state.db.expenses)
	const [groupedResults, setGroupedResults] = useState<any>(null)
	const [totalExpense, setTotalExpense] = useState<number>(0)

	const expenseFilter = (time: number, year: string, month: string): boolean => {
		let objMonth = months[new Date(time).getMonth()]
		let objYear = new Date(time).getFullYear()
		if (objYear.toString() == year && objMonth == month) {
			return true
		}

		return false
	}

	const loadExpenseData = (month: string, year: string) => {
		const g = Object.entries(expense)
			.filter(([key, e]) => expenseFilter(e.date, year, month))
			.reduce(
				(
					agg: { [id: string]: { [id: string]: MISExpense | MISSalaryExpense } },
					[key, e]
				) => {
					const day = moment(e.date).startOf('day').toString()
					if (agg[day]) {
						return {
							...agg,
							[day]: {
								...agg[day],
								[key]: e
							}
						}
					}

					return {
						...agg,
						[day]: {
							[key]: e
						}
					}
				},
				{}
			)

		const finalResult = Object.values(g)
		setGroupedResults(finalResult)
		setTotalExpense(calculateTotal(finalResult))
	}

	const calculateTotal = (
		finalResult: (
			| { [id: string]: MISExpense | MISSalaryExpense }
			| { [x: string]: MISExpense | MISSalaryExpense }
		)[]
	) => {
		let total = 0
		finalResult.forEach(element => {
			Object.values(element).forEach(element => {
				total = parseFloat(total.toString()) + parseFloat(element.amount.toString())
			})
		})

		return total
	}

	const [state, setState] = useState<State>({
		month: currentMonth,
		year: currentYear
	})

	useEffect(() => {
		loadExpenseData(state.month, state.year)
	}, [state.month, state.year, expense])

	return (
		<AppLayout title={'Expenses'}>
			<div style={{ height: '80vh' }}>
				<div className="bg-gray-600 flex-col mt-1 mb-2 mx-3 rounded py-5 px-5 ">
					<div id="totals" className="w-full z-10  flex flex-row justify-between mb-4">
						<div className="flex flex-col justify-center items-center text-white">
							<h1 className="font-medium">Income</h1>
							<h1>Dummy</h1>
						</div>
						<div className="flex flex-col justify-center items-center text-white">
							<h1 className="font-medium">Expenses</h1>
							<h1>{totalExpense}</h1>
						</div>
						<div className="flex flex-col justify-center items-center text-white">
							<h1 className="font-medium">Total</h1>
							<h1>Dummy</h1>
						</div>
					</div>
					<div className="w-full flex justify-center items-center">
						<div className="bg-blue-400 rounded-full py-2 px-8 text-white font-semibold cursor-pointer mb-4 flex flex-row justify-center items-center ">
							<CubeTransparentIcon className="w-8 h-8 text-white mr-2" />
							<h1>Detailed Analysis</h1>
						</div>
					</div>
					<div
						id="selects"
						className="flex flex-row items-center justify-between w-full md:w-3/5 space-x-4">
						<CustomSelect
							onChange={month => setState({ ...state, month })}
							data={months}
							selectedItem={state.month}>
							<CalendarIcon className="w-5 h-5 text-gray-500" />
						</CustomSelect>
						<CustomSelect
							onChange={year => setState({ ...state, year })}
							data={['2021', '2020']}
							selectedItem={state.year}>
							<ChevronDownIcon className="w-5 h-5 text-gray-500" />
						</CustomSelect>
					</div>
				</div>
				<div className="flex-1 overflow-scroll h-4/6">
					{groupedResults &&
						groupedResults.map((data: any) => {
							return (
								<ExpenseCard
									date={data[Object.keys(data)[0]].date}
									expenseData={data}
								/>
							)
						})}
				</div>
				<div className="flex flex-1  items-center justify-evenly mt-2 ">
					<div className="py-2 m-5 px-6 flex flex-1 bg-red-500 text-white text-lg font-medium rounded text-center items-center justify-center">
						<h1>Salaries</h1>
					</div>
					<Link
						to="/expenses/new"
						className="py-2 px-6 m-5 flex flex-1 bg-blue-400 text-white text-lg font-medium rounded text-center items-center justify-center">
						<h1>Add New</h1>
					</Link>
				</div>
			</div>
		</AppLayout>
	)
}
