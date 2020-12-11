import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { AppLayout } from 'components/layout'
import { PageHeading } from 'components/app/pageHeading'
import { AppState } from 'reducers'
import { InfoCard } from 'components/app/infoCards'
import { getSchoolExpense } from 'services'
import moment from 'moment'

type S = {
	[date: string]: {
		income: number
		expense: number
	}
}

export const SchoolExpense = () => {

	const schools = useSelector((state: AppState) => state.user.schools)

	const [schoolId, setSchoolId] = useState(Object.keys(schools)[0])
	const [loading, setLoading] = useState(false)

	const [schoolExpense, setSchoolExpense] = useState<S>({})

	const expenseStats = useMemo(() => getExpenseStats(schoolExpense), [schoolExpense])

	useEffect(() => {
		if (schoolId) {

			setLoading(true)

			getSchoolExpense(schoolId)
				.then(
					resp => {
						setSchoolExpense(resp)
						setLoading(false)
						console.log(resp)
					},
					error => {
						setLoading(false)
						console.log(error)
						alert("Unable to load school enrollment")
					}
				)
		}
	}, [schoolId])

	return (
		<AppLayout title="School Expense">
			<div className="container mx-auto md:ml-64 px-4 sm:px-8">
				<div className="py-8">
					<PageHeading title={"School Expense"} />

					<div className="my-2 flex flex-row justify-end">
						<div className="flex flex-row mb-1 sm:mb-0">
							<select className="select"
								onChange={(e) => setSchoolId(e.target.value)}
								defaultValue={schoolId} >
								<option>Select School</option>
								{
									Object.keys(schools || {}).sort().map(id => <option key={id} value={id} >{id}</option>)
								}
							</select>
						</div>
					</div>
					<div className="mt-4 mb-4 mx-auto grid">
						<div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-4">
							<InfoCard
								loading={loading}
								title={"Total Income"}
								body={expenseStats.income}
								logoType={"cash"} />

							<InfoCard
								loading={loading}
								title={"Total Expense"}
								body={expenseStats.expense}
								logoType={"cash"} />

							<InfoCard
								loading={loading}
								title={"Total Profit"}
								body={expenseStats.income - expenseStats.expense}
								logoType={"cash"} />

						</div>
					</div>
					<div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-2 overflow-x-auto">
						<div className="table-container">
							<table className="table">
								<thead className="thead">
									<tr>
										<th className="th"> Date </th>
										<th className="th"> Income </th>
										<th className="th"> Expense </th>
										<th className="th"> Profit</th>
									</tr>
								</thead>
								<tbody>
									{
										Object.entries(schoolExpense || {})
											.sort(([d1,], [d2,]) => moment(d1, "MM-YYYY").diff(moment(d2, "MM-YYYY")))
											.map(([k, v]) => (
												<tr className="tr" key={k}>
													<td className="td">{k}</td>
													<td className="td">{v.income}</td>
													<td className="td">{v.expense}</td>
													<td className="td">{v.income - v.expense}</td>
												</tr>
											))
									}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}

const getExpenseStats = (expenses: S) => {

	let stats = { income: 0, expense: 0 }

	return Object.values(expenses || {})
		.reduce((agg, curr) => {
			return {
				income: agg.income + curr.income,
				expense: agg.income + curr.expense
			}
		}, stats)
}