import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ChevronDownIcon, CubeTransparentIcon } from '@heroicons/react/solid'

import { AppLayout } from 'components/Layout/appLayout'
import { CustomSelect } from 'components/select'
import months from 'constants/months'
import CalendarIcon from 'assets/svgs/react/Calendar'
import ExpenseCard from 'components/cards/expense'

type State = {
	month: string
	year: string
	groupedResults: any
	categoryGroups: any
	totalExpense: number
	totalIncome: number
	monthPayments: MISStudentPayment[]
	detialsExpanded: boolean
	selectedCategory: string
}

export const Expense = () => {
	const currentYear = moment().format('YYYY')
	const currentMonth = moment().format('MMMM')

	const expenses = useSelector((state: RootReducerState) => state.db.expenses)
	const students = useSelector((state: RootReducerState) => state.db.students)

	const [state, setState] = useState<State>({
		month: currentMonth,
		year: currentYear,
		groupedResults: null,
		categoryGroups: 0,
		totalExpense: 0,
		totalIncome: 0,
		monthPayments: null,
		detialsExpanded: false,
		selectedCategory: ''
	})

	const selectCategory = (cat: string) => {
		if (state.selectedCategory === cat) {
			setState({ ...state, selectedCategory: '' })
		} else {
			setState({ ...state, selectedCategory: cat })
		}
	}

	const groupByCategory = (year: string, month: string) => {
		const categoryGrouping = Object.entries(expenses)
			.filter(([expenseId, expense]) => filterData(expense.date, year, month))
			.reduce<{ [id: string]: { [id: string]: MISExpense | MISSalaryExpense } }>(
				(agg, [key, expense]) => {
					const category = expense.category
					if (agg[category]) {
						return {
							...agg,
							[category]: {
								...agg[category],
								[key]: expense
							}
						}
					}

					return {
						...agg,
						[category]: {
							[key]: expense
						}
					}
				},
				{}
			)

		return categoryGrouping
	}

	const calculateCategoryExpense = (id: string) => {
		return Object.values(state.categoryGroups[id]).reduce<number>((agg, expenses: any) => {
			return agg + parseFloat(expenses.amount.toString())
		}, 0)
	}

	const filterData = (time: number, year: string, month: string): boolean => {
		let objMonth = months[new Date(time).getMonth()]
		let objYear = new Date(time).getFullYear()
		if (objYear.toString() == year && objMonth == month) {
			return true
		}

		return false
	}

	const loadExpenseData = (month: string, year: string) => {
		const group = Object.entries(expenses)
			.filter(([key, e]) => filterData(e.date, year, month))
			.reduce<{ [id: string]: { [id: string]: MISExpense | MISSalaryExpense } }>(
				(agg, [key, e]) => {
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

		let payments: MISStudentPayment[] = []
		for (const student of Object.values(students)) {
			for (const payment of Object.values(student.payments ?? {})) {
				if (filterData(payment.date, year, month) && payment.type === 'SUBMITTED') {
					payments.push(payment)
				}
			}
		}

		const finalResult = Object.values(group).sort((a, b) => {
			//This is to sort the final result in Descending Order
			let key_a
			let key_b
			for (let k in a) {
				key_a = k
				break
			}
			for (let k in b) {
				key_b = k
				break
			}
			return a[key_a].date > b[key_b].date ? -1 : 1
		})
		setState({
			...state,
			groupedResults: finalResult,
			totalExpense: calculateTotal(finalResult),
			totalIncome: calculateIncome(payments),
			monthPayments: payments,
			categoryGroups: groupByCategory(year, month)
		})
	}

	const calculateIncome = (payments: MISStudentPayment[]) => {
		return payments.reduce((agg: number, payment: MISStudentPayment) => {
			return agg + payment.amount
		}, 0)
	}

	const calculateTotal = (
		finalResult: {
			[id: string]: MISExpense | MISSalaryExpense
		}[]
	) => {
		let total = 0
		finalResult.forEach(element => {
			Object.values(element).forEach(element => {
				total = parseFloat(total.toString()) + parseFloat(element.amount.toString())
			})
		})

		return total
	}

	useEffect(() => {
		loadExpenseData(state.month, state.year)
	}, [state.month, state.year, expenses, students])

	return (
		<AppLayout title={'Expenses'}>
			<div style={{ height: '80vh' }}>
				<div className="bg-gray-600 flex-col mt-1 mb-2 mx-3 rounded py-5 px-5 ">
					<div id="totals" className="w-full z-10  flex flex-row justify-between mb-4">
						<div className="flex flex-col justify-center items-center text-white">
							<h1 className="font-medium">Income</h1>
							<h1>{state.totalIncome}</h1>
						</div>
						<div className="flex flex-col justify-center items-center text-white">
							<h1 className="font-medium">Expenses</h1>
							<h1>{state.totalExpense}</h1>
						</div>
						<div className="flex flex-col justify-center items-center text-white">
							<h1 className="font-medium">Total</h1>
							<h1>{state.totalIncome - state.totalExpense}</h1>
						</div>
					</div>
					<div
						onClick={() =>
							setState({ ...state, detialsExpanded: !state.detialsExpanded })
						}
						className="w-full flex justify-center items-center">
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
					{state.categoryGroups && (
						<div
							className={clsx(
								'text-gray-100 border-gray-300 border-dashed transition-all duration-500  border-t-2  ',
								state.detialsExpanded
									? 'mt-4 pt-3 pb-3 max-h-screen'
									: ' max-h-0 opacity-0 invisible'
							)}>
							<div className="flex flex-row justify-between text-lg">
								<h1 className="font-semibold">Category</h1>
								<h1 className="font-semibold">Expense</h1>
							</div>
							{Object.entries(state.categoryGroups ?? {}).map(([id, data]) => {
								return (
									<div key={id}>
										<div className="flex flex-row justify-between space-y-2 text-gray-300 ">
											<div className="flex flex-1 justify-between pr-5 flex-row items-center space-x-2">
												<h1>{id}</h1>
												<ChevronDownIcon
													onClick={() => selectCategory(id)}
													className={clsx(
														'bg-teal-brand z-10 h-4 rounded-full transition-all duration-500 text-gray-600 cursor-pointer',
														state.selectedCategory === id
															? 'transform rotate-180 bg-red-tip-brand'
															: ''
													)}></ChevronDownIcon>
											</div>
											<div className="flex flex-1 justify-end">
												<h1>{calculateCategoryExpense(id)}</h1>
											</div>
										</div>
										<ul
											className={clsx(
												'border-l-2 border-gray-400 pl-5 transition-all ease-in-out duration-1000 space-y-2',
												state.selectedCategory === id
													? 'max-h-screen '
													: 'max-h-0 opacity-0 scale-0 '
											)}>
											{Object.entries(data ?? {}).map(([id, expense]) => {
												return (
													<div
														key={id}
														className={clsx(
															'flex-row flex text-sm text-gray-400 justify-between',
															state.selectedCategory === id
																? ''
																: 'visible'
														)}>
														<li>{`${expense.label} - ${moment(
															expense.date
														).format('ddd')} ${moment(
															expense.date
														).format('Do')}`}</li>
														<li>{expense.amount}</li>
													</div>
												)
											})}
										</ul>
									</div>
								)
							})}
							<div className="border-t-2 pt-5 border-dashed mt-2">
								<div
									onClick={() =>
										setState({
											...state,
											detialsExpanded: !state.detialsExpanded
										})
									}
									className="py-2 m-5 px-6 flex flex-1 bg-yellow-400 text-gray-50   text-lg font-medium rounded text-center items-center justify-center">
									<h1>Go Back</h1>
								</div>
							</div>
						</div>
					)}
				</div>
				{state.groupedResults && (
					<div
						className={clsx(
							'flex-1 overflow-scroll h-4/6 duration-300 transition-all',
							state.detialsExpanded ? 'opacity-0 max-h-0 invisible' : 'max-h-screen'
						)}>
						{state.groupedResults.map(
							(data: { [x: string]: MISExpense | MISSalaryExpense }) => {
								return (
									<ExpenseCard
										key={Object.keys(data)[0]}
										payments={state.monthPayments}
										date={data[Object.keys(data)[0]].date}
										expenseData={data}
									/>
								)
							}
						)}
					</div>
				)}
				<div
					className={clsx(
						'flex flex-1 z-10 items-center justify-evenly mt-2 transition-all duration-300',
						state.detialsExpanded ? 'opacity-0 max-h-0 invisible' : 'max-h-screen'
					)}>
					<Link
						to="/staff/salaries"
						className="py-2 z-20 m-5 px-6 flex flex-1 bg-red-500 text-white text-lg font-medium rounded text-center items-center justify-center">
						<h1>Salaries</h1>
					</Link>
					<Link
						to="/expenses/new"
						className="py-2 z-20 px-6 m-5 flex flex-1 bg-blue-400 text-white text-lg font-medium rounded text-center items-center justify-center">
						<h1>Add New</h1>
					</Link>
				</div>
			</div>
		</AppLayout>
	)
}
