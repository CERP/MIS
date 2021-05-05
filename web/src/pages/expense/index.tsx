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
import { filter } from 'lodash'
import clsx from 'clsx'

type State = {
	month: string
	year: string
}

export const Expense = () => {
	const currentYear = moment().format('YYYY')
	const currentMonth = moment().format('MMMM')
	const expense = useSelector((state: RootReducerState) => state.db.expenses)
	const students = useSelector((state: RootReducerState) => state.db.students)
	const [groupedResults, setGroupedResults] = useState<any>(null)
	const [categoryGroups, setCategoryGroups] = useState<any>(null)
	const [totalExpense, setTotalExpense] = useState<number>(0)
	const [totalIncome, setTotalIncome] = useState<number>(0)
	const [monthPayments, setMonthPayments] = useState<MISStudentPayment[]>(null)
	const [detialsExpanded, setDetailsExpanded] = useState<boolean>(false)
	const [selectedCategory, setSelectedCategory] = useState<string>('')

	const selectCategory = (cat: string) => {
		if (selectedCategory === cat) {
			setSelectedCategory('')
		} else {
			setSelectedCategory(cat)
		}
	}

	const groupByCategory = (year: string, month: string) => {
		const categoryGrouping = Object.entries(expense)
			.filter(([key, e]) => filterData(e.date, year, month))
			.reduce(
				(
					agg: { [id: string]: { [id: string]: MISExpense | MISSalaryExpense } },
					[key, e]
				) => {
					const category = e.category
					if (agg[category]) {
						return {
							...agg,
							[category]: {
								...agg[category],
								[key]: e
							}
						}
					}

					return {
						...agg,
						[category]: {
							[key]: e
						}
					}
				},
				{}
			)

		setCategoryGroups(categoryGrouping)
	}

	const calculateCategoryExpense = (id: string) => {
		return Object.values(categoryGroups[id]).reduce((agg: number, expense: any) => {
			return agg + parseFloat(expense.amount.toString())
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
		const group = Object.entries(expense)
			.filter(([key, e]) => filterData(e.date, year, month))
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

		groupByCategory(year, month)

		let payments: MISStudentPayment[] = []
		Object.values(students ?? {}).forEach((student: MISStudent) => {
			Object.values(student.payments ?? {}).forEach(payment => {
				if (filterData(payment?.date ?? 0, year, month)) {
					if (payment.type === 'SUBMITTED') {
						payments.push(payment)
					}
				}
			})
		})

		setMonthPayments(payments)

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
		setGroupedResults(finalResult)
		setTotalExpense(calculateTotal(finalResult))
		setTotalIncome(calculateIncome(payments))
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

	const [state, setState] = useState<State>({
		month: currentMonth,
		year: currentYear
	})

	useEffect(() => {
		loadExpenseData(state.month, state.year)
	}, [state.month, state.year, expense, students])

	return (
		<AppLayout title={'Expenses'}>
			<div style={{ height: '80vh' }}>
				<div className="bg-gray-600 flex-col mt-1 mb-2 mx-3 rounded py-5 px-5 ">
					<div id="totals" className="w-full z-10  flex flex-row justify-between mb-4">
						<div className="flex flex-col justify-center items-center text-white">
							<h1 className="font-medium">Income</h1>
							<h1>{totalIncome}</h1>
						</div>
						<div className="flex flex-col justify-center items-center text-white">
							<h1 className="font-medium">Expenses</h1>
							<h1>{totalExpense}</h1>
						</div>
						<div className="flex flex-col justify-center items-center text-white">
							<h1 className="font-medium">Total</h1>
							<h1>{totalIncome - totalExpense}</h1>
						</div>
					</div>
					<div
						onClick={() => setDetailsExpanded(!detialsExpanded)}
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
					{categoryGroups && (
						<div
							className={clsx(
								'text-gray-100 border-gray-300 border-dashed transition-all duration-500  border-t-2  ',
								detialsExpanded
									? 'mt-4 pt-3 pb-3 max-h-screen'
									: ' max-h-0 opacity-0 invisible'
							)}>
							<div className="flex flex-row justify-between text-lg">
								<h1 className="font-semibold">Category</h1>
								<h1 className="font-semibold">Expense</h1>
							</div>
							{Object.entries(categoryGroups ?? {}).map(([id, data]) => {
								return (
									<div>
										<div className="flex flex-row justify-between space-y-2 text-gray-300 ">
											<div className="flex flex-1 justify-between pr-5 flex-row items-center space-x-2">
												<h1>{id}</h1>
												<ChevronDownIcon
													onClick={() => selectCategory(id)}
													className={clsx(
														'bg-teal-brand h-4 rounded-full transition-all duration-500 text-gray-600 cursor-pointer',
														selectedCategory === id
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
												selectedCategory === id
													? 'max-h-screen '
													: 'max-h-0 opacity-0 scale-0 '
											)}>
											{Object.values(data ?? {}).map(
												(element: MISExpense | MISSalaryExpense) => {
													return (
														<div
															className={clsx(
																'flex-row flex text-sm text-gray-400 justify-between',
																selectedCategory === id
																	? ''
																	: 'invisible'
															)}>
															<li>{`${element.label} - ${moment(
																element.date
															).format('ddd')} ${moment(
																element.date
															).format('Do')}`}</li>
															<li>{element.amount}</li>
														</div>
													)
												}
											)}
										</ul>
									</div>
								)
							})}
							<div className="border-t-2 pt-5 border-dashed mt-2">
								<div
									onClick={() => setDetailsExpanded(!detialsExpanded)}
									className="py-2 m-5 px-6 flex flex-1 bg-yellow-400 text-gray-50   text-lg font-medium rounded text-center items-center justify-center">
									<h1>Go Back</h1>
								</div>
							</div>
						</div>
					)}
				</div>
				{groupedResults && (
					<div
						className={clsx(
							'flex-1 overflow-scroll h-4/6 duration-300 transition-all',
							detialsExpanded ? 'opacity-0 max-h-0 invisible' : 'max-h-screen'
						)}>
						{groupedResults.map(
							(data: { [x: string]: MISExpense | MISSalaryExpense }) => {
								return (
									<ExpenseCard
										key={Object.keys(data)[0]}
										payments={monthPayments}
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
						'flex flex-1  items-center justify-evenly mt-2 transition-all duration-300',
						detialsExpanded ? 'opacity-0 max-h-0 invisible' : 'max-h-screen'
					)}>
					<Link
						to="/salary"
						className="py-2 m-5 px-6 flex flex-1 bg-red-500 text-white text-lg font-medium rounded text-center items-center justify-center">
						<h1>Salaries</h1>
					</Link>
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
