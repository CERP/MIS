import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ChevronDownIcon, CubeTransparentIcon } from '@heroicons/react/solid'

import months from 'constants/months'
import CalendarIcon from 'assets/svgs/react/Calendar'
import ExpenseCard from 'components/cards/expense'
import { AppLayout } from 'components/Layout/appLayout'
import { CustomSelect } from 'components/select'
import { toTitleCase } from 'utils/toTitleCase'

type AugmentedExpense = MISExpense | MISSalaryExpense
type State = {
	month: string
	year: string
	groupedResults: { [id: string]: AugmentedExpense }[]
	categoryGroups: { [id: string]: { [id: string]: AugmentedExpense } }
	totalExpense: number
	totalIncome: number
	monthPayments: MISStudentPayment[]
	detialsExpanded: boolean
	selectedCategory: string
	years: string[]
}

const Parser = (val: number): number => {
	const value = Number(val)
	if (Number.isFinite(value)) {
		return val
	}
	return 0
}

export const Expense = () => {
	const currentYear = moment().format('YYYY')
	const currentMonth = moment().format('MMMM')

	const expenses = useSelector((state: RootReducerState) => state.db.expenses)
	const students = useSelector((state: RootReducerState) => state.db.students)

	const [state, setState] = useState<State>({
		month: currentMonth,
		year: currentYear,
		groupedResults: [],
		categoryGroups: {},
		totalExpense: 0,
		totalIncome: 0,
		monthPayments: null,
		detialsExpanded: false,
		selectedCategory: '',
		years: []
	})

	const selectCategory = (cat: string) => {
		if (state.selectedCategory === cat) {
			return setState({ ...state, selectedCategory: '' })
		}
		setState({ ...state, selectedCategory: cat })
	}

	const groupByCategory = (year: string, month: string) => {
		return Object.entries(expenses ?? {}).reduce<{
			[id: string]: { [id: string]: AugmentedExpense }
		}>((agg, [key, expenseItem]) => {
			if (!filterData(expenseItem.date, year, month)) {
				return agg
			}

			const category = expenseItem.category
			if (agg[category]) {
				return {
					...agg,
					[category]: {
						...agg[category],
						[key]: expenseItem
					}
				}
			}

			return {
				...agg,
				[category]: {
					[key]: expenseItem
				}
			}
		}, {})
	}

	const calculateCategoryExpense = (id: string) => {
		return Object.values(state.categoryGroups[id]).reduce<number>((agg, expenses: any) => {
			return agg + Parser(expenses.amount) * Parser(expenses.quantity ?? 1)
		}, 0)
	}

	const getYearsfromExpenses = (): string[] => {
		const duplicatedYears = Object.values(expenses).reduce<string[]>((agg, curr) => {
			const year = moment(curr.date).format('YYYY')
			return [...agg, year]
		}, [])

		return [...new Set(duplicatedYears)]
	}

	const filterData = (time: number, year: string, month: string): boolean => {
		const objMonth = months[new Date(time).getMonth()]
		const objYear = new Date(time).getFullYear().toString()

		return objYear === year && objMonth == month
	}

	useEffect(() => {
		const loadExpenseData = (month: string, year: string) => {
			const groupedExpense = Object.entries(expenses).reduce<{
				[id: string]: { [id: string]: AugmentedExpense }
			}>((agg, [expenseId, expenseItem]) => {
				if (!filterData(expenseItem.date, year, month)) {
					return agg
				}

				const day = moment(expenseItem.date).startOf('day').toString()

				if (agg[day]) {
					return {
						...agg,
						[day]: {
							...agg[day],
							[expenseId]: expenseItem
						}
					}
				}

				return {
					...agg,
					[day]: {
						[expenseId]: expenseItem
					}
				}
			}, {})

			const payments = Object.values(students).reduce((agg, student) => {
				return [
					...agg,
					...Object.values(student.payments ?? {}).reduce((agg2, payment) => {
						if (filterData(payment.date, year, month) && payment.type === 'SUBMITTED') {
							return [...agg2, payment]
						}
						return agg2
					}, [] as MISStudentPayment[])
				]
			}, [] as MISStudentPayment[])

			const finalResult = Object.values(groupedExpense ?? {}).sort(
				(a, b) => Object.values(b)[0].date - Object.values(a)[0].date
			)

			setState({
				...state,
				groupedResults: finalResult,
				totalExpense: calculateTotal(finalResult),
				totalIncome: calculateIncome(payments),
				monthPayments: payments,
				categoryGroups: groupByCategory(year, month),
				years: getYearsfromExpenses()
			})
		}

		// invoke function
		loadExpenseData(state.month, state.year)
	}, [state.month, state.year, expenses, students])

	const calculateIncome = (payments: MISStudentPayment[]) => {
		return payments.reduce((agg: number, payment: MISStudentPayment) => {
			return agg + payment.amount
		}, 0)
	}

	const calculateTotal = (
		finalResult: {
			[id: string]: AugmentedExpense
		}[]
	): number => {
		let total = 0

		finalResult.forEach(expenseItem => {
			Object.values(expenseItem).forEach(expenseItem => {
				if (expenseItem.expense === 'MIS_EXPENSE') {
					total =
						Parser(total) + Parser(expenseItem.amount) * Parser(expenseItem.quantity)
				} else {
					total = Parser(total) + Parser(expenseItem.amount)
				}
			})
		})

		return total
	}

	return (
		<AppLayout title={'Expenses'} showHeaderTitle>
			<div className="p-5 md:p-10 md:pt-5 md:pb-0 relative print:hidden">
				<div style={{ height: '80vh' }} className="w-full">
					<div className="bg-gray-600 flex-col mt-1 mb-2 rounded py-2 px-5 ">
						<div id="totals" className="w-full flex flex-row justify-between mb-2">
							<div className="flex flex-col justify-center items-center text-white">
								<p className="font-medium">Income</p>
								<p>{state.totalIncome}</p>
							</div>
							<div className="flex flex-col justify-center items-center text-white">
								<p className="font-medium">Expense</p>
								<p>{state.totalExpense}</p>
							</div>
							<div className="flex flex-col justify-center items-center text-white">
								<p className="font-medium">Total</p>
								<p>{state.totalIncome - state.totalExpense}</p>
							</div>
						</div>
						<div className="flex justify-center mb-4">
							<button
								onClick={() =>
									setState({ ...state, detialsExpanded: !state.detialsExpanded })
								}
								className="tw-btn-blue inline-flex items-center rounded-3xl">
								<CubeTransparentIcon className="w-6 h-6 mr-2" />
								<span className="font-semibold">Detailed Analysis</span>
							</button>
						</div>
						<div
							id="selects"
							className="flex flex-row items-center justify-between w-full md:w-3/5 space-x-4 mx-auto">
							<CustomSelect
								onChange={month => setState({ ...state, month })}
								data={months}
								selectedItem={state.month}>
								<CalendarIcon className="w-5 h-5 text-teal-brand" />
							</CustomSelect>
							<CustomSelect
								onChange={year => setState({ ...state, year })}
								data={state.years ?? []}
								selectedItem={state.year}>
								<ChevronDownIcon className="w-5 h-5 text-teal-brand" />
							</CustomSelect>
						</div>
						{state.categoryGroups && state.detialsExpanded && (
							<div
								className={clsx(
									'text-gray-100 border-gray-300 border-dashed transition-all duration-500  border-t-2',
									state.detialsExpanded
										? 'mt-4 pt-3 pb-3 max-h-screen'
										: 'max-h-0 opacity-0 invisible'
								)}>
								<div className="flex flex-row justify-between font-semibold">
									<p>Category</p>
									<p>Expense</p>
								</div>
								<div className="space-y-2 md:space-y-0">
									{Object.entries(state.categoryGroups ?? {}).map(
										([id, data]) => {
											return (
												<div key={id}>
													<div className="flex flex-row justify-between space-y-2 text-white">
														<div
															onClick={() => selectCategory(id)}
															className="flex flex-1 justify-between pr-5 flex-row items-center space-x-2 cursor-pointer hover:text-gray-brand">
															<p className="text-sm">
																{toTitleCase(id)}
															</p>
															<div
																className={clsx(
																	'bg-teal-brand z-10 p-px w-8 h-8 md:w-6 md:h-6 rounded-full transition-all duration-500',
																	{
																		'bg-red-brand':
																			state.selectedCategory ===
																			id
																	}
																)}>
																<ChevronDownIcon
																	className={clsx(
																		state.selectedCategory ===
																			id
																			? 'transform rotate-180'
																			: ''
																	)}
																/>
															</div>
														</div>
														<div className="flex flex-1 justify-end">
															<p>{calculateCategoryExpense(id)}</p>
														</div>
													</div>
													<div
														className={clsx(
															'border-l-2 border-gray-400 pl-5 transition-all ease-in-out duration-1000 space-y-2',
															state.selectedCategory === id
																? 'max-h-screen '
																: 'max-h-0 opacity-0 scale-0 '
														)}>
														{Object.entries(data ?? {}).map(
															([id, expense]) => {
																return (
																	<div
																		key={id}
																		className={clsx(
																			'flex-row flex text-sm text-gray-400 justify-between',
																			state.selectedCategory ===
																				id
																				? ''
																				: 'visible'
																		)}>
																		<p>{`${expense.label
																			} - ${moment(
																				expense.date
																			).format('ddd')} ${moment(
																				expense.date
																			).format('Do')}`}</p>
																		<p>
																			{getListTotal(expense)}
																		</p>
																	</div>
																)
															}
														)}
													</div>
												</div>
											)
										}
									)}
								</div>
								<div className="border-t-2 pt-5 border-dashed mt-2" />
								<div className="flex justify-center">
									<button
										onClick={() =>
											setState({
												...state,
												detialsExpanded: !state.detialsExpanded
											})
										}
										className="tw-btn text-white bg-orange-brand w-full md:w-1/4">
										Go Back
									</button>
								</div>
							</div>
						)}
					</div>
					{state.groupedResults.length > 0 && !state.detialsExpanded && (
						<div
							className={clsx(
								'flex-1 overflow-y-auto h-3/5 lg:h-5/6 duration-300 transition-all w-full space-y-4',
								state.detialsExpanded
									? 'opacity-0 max-h-0 invisible'
									: 'max-h-screen'
							)}>
							{state.groupedResults.map(data => (
								<ExpenseCard
									// TODO: What we're getting from '0' indexed
									// '0' index returns the key for the first entry in data
									key={Object.keys(data)[0]}
									payments={state.monthPayments}
									date={data[Object.keys(data)[0]].date}
									expenseData={data}
								/>
							))}
						</div>
					)}
					<div
						className={clsx(
							'flex flex-1  items-center justify-evenly  transition-all duration-300',
							state.detialsExpanded ? 'opacity-0 max-h-0 invisible' : 'max-h-screen'
						)}>
						<Link
							to="/staff/salaries"
							className="py-2 m-5 px-6 flex flex-1 bg-red-brand text-white text-lg font-medium rounded text-center justify-center">
							Salaries
						</Link>
						<Link
							to="/expenses/new"
							className="py-2 px-6 m-5 flex flex-1 bg-blue-brand text-white text-lg font-medium rounded text-center justify-center">
							Add New
						</Link>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
const getListTotal = (expense: MISExpense | MISSalaryExpense) => {
	if (expense.expense === 'MIS_EXPENSE') {
		return expense.amount * expense.quantity
	} else {
		return expense.amount
	}
}
