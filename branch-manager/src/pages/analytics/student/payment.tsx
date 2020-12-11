import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { AppLayout } from 'components/layout'
import { PageHeading, PageSubHeading } from 'components/app/pageHeading'
import { AppState } from 'reducers'
import { getSectionsFromClasses } from 'utils/generic'
import { toTitleCase } from 'utils/string'
import { InfoCard } from 'components/app/infoCards'
import { getStudentsPayment } from 'services'
import IconUserSvg from 'assets/userCircle.svg'
import moment from 'moment'


type S = {
	[id: string]: MISStudent
}

export const StudentPayment = () => {

	const schools = useSelector((state: AppState) => state.user.schools)

	const [schoolId, setSchoolId] = useState(Object.keys(schools)[0])
	const [sectionId, setSectionId] = useState('')
	const [loading, setLoading] = useState(true)
	const [searchable, setSearchable] = useState('')

	const [students, setStudents] = useState<S>({})

	useEffect(() => {
		if (schoolId) {
			getStudentsPayment(schoolId)
				.then((resp) => {
					setStudents(resp)
					setLoading(false)

				}, error => {
					setLoading(false)
					console.log(error)
				})
		}
	}, [schoolId])


	const sections = useMemo(() => getSections(schools as School, schoolId), [schools, schoolId])
	const aggPaymentList = useMemo(() => getAggregatedPaymentList(students), [students])
	const paymentStats = useMemo(() => getPaymentStats(students), [students])


	return (
		<AppLayout title="Student Payments">
			<div className="container mx-auto md:ml-64 px-4 sm:px-8">
				<div className="py-8">
					<PageHeading title={"Student Payments"} />
					<div className="my-2 flex flex-row justify-end">
						<div className="flex flex-row mb-1 sm:mb-0">
							<select className="select"
								onChange={(e) => setSchoolId(e.target.value)}
								defaultValue={schoolId}
							>
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
								title={"Total Amount"}
								body={paymentStats.OWED}
								logoType={"cash"} />

							<InfoCard
								loading={loading}
								title={"Paid Amount"}
								body={paymentStats.SUBMITTED}
								logoType={"cash"} />

							<InfoCard
								loading={loading}
								title={"Forgiven Amount"}
								body={paymentStats.SCHOLARSHIP + paymentStats.FORGIVEN}
								logoType={"cash"} />

							<InfoCard
								loading={loading}
								title={"Pending"}
								body={paymentStats.OWED - (paymentStats.FORGIVEN + paymentStats.SCHOLARSHIP + paymentStats.SUBMITTED)}
								logoType={"cash"} />
						</div>
					</div>

					<div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-2 overflow-x-auto">
						<div className="table-container">
							<table className="table">
								<thead className="thead">
									<tr>
										<th className="th"> Date </th>
										<th className="th"> Total </th>
										<th className="th"> Paid </th>
										<th className="th"> Forgiven</th>
										<th className="th"> Pending</th>
									</tr>
								</thead>
								<tbody>
									{
										Object.entries(aggPaymentList || {})
											.sort(([d1,], [d2,]) => moment(d1, "MM-YYYY").diff(moment(d2, "MM-YYYY")))
											.map(([k, v]) => (
												<tr className="tr" key={k}>
													<td className="td">{k}</td>
													<td className="td">{v.OWED}</td>
													<td className="td">{v.SUBMITTED}</td>
													<td className="td">{v.FORGIVEN + v.SCHOLARSHIP}</td>
													<td className="td">{v.OWED - v.SCHOLARSHIP + v.FORGIVEN + v.SUBMITTED}</td>
												</tr>
											))
									}
								</tbody>
							</table>
						</div>
					</div>
					<div className="mb-5 mt-2">
						<PageSubHeading title={"Outstanding Dues Students"} />
					</div>
					<div className="my-2 flex flex-row justify-end">
						<input
							name="search"
							onChange={(e) => setSearchable(e.target.value)}
							placeholder="Search here..."
							className="input w-full" />
						<div className="flex flex-row ml-2">
							<select
								className="select"
								onChange={(e) => setSectionId(e.target.value)} >
								<option>Select Section</option>
								{
									sections
										.sort((a, b) => a.namespaced_name.localeCompare(b.namespaced_name))
										.map(section => <option key={section.id} value={section.id} >{toTitleCase(section.namespaced_name)}</option>)
								}
							</select>
						</div>
					</div>
					<div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-2 overflow-x-auto">
						<div className="table-container">
							<table className="table">
								<thead className="thead">
									<tr>
										<th className="th"> Name </th>
										<th className="th"> F. Name </th>
										<th className="th"> Phone </th>
										<th className="th"> Amount</th>
									</tr>
								</thead>
								<tbody>
									{
										Object.entries(students || {})
											.filter(([k, v]) => {

												if (sectionId) {
													return sectionId === v.section_id
												}

												if (searchable) {
													return v.name.toLowerCase().includes(searchable)
												}

												return true
											})
											.sort(([, a], [, b]) => b.payments.debt - a.payments.debt)
											.map(([k, v]) => (
												<tr className="tr" key={k}>
													<td className="td text-left">
														<div className="flex items-center">
															<div className="flex-shrink-0">
																<img className="w-8 h-8 mr-4 rounded-full" src={v?.avatar_url || IconUserSvg} alt={v.name} />
															</div>
															<div className="ml-3">
																<p> {v.name} </p>
															</div>
														</div>
													</td>
													<td className="td text-left">{v.fname}</td>
													<td className="td">{v.phone}</td>
													<td className="td">{v.payments.debt}</td>
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

const getSections = (schools: School, schoolId: string) => {
	const classes = schools[schoolId]?.classes
	return getSectionsFromClasses(classes)
}

const getPaymentStats = (students: S) => {

	let stats: Payment = { OWED: 0, SUBMITTED: 0, SCHOLARSHIP: 0, FORGIVEN: 0 }

	for (const { payments } of Object.values(students || {})) {

		stats = {
			OWED: stats["OWED"] + payments.aggregated["OWED"],
			SUBMITTED: stats["SUBMITTED"] + payments.aggregated["SUBMITTED"],
			FORGIVEN: stats["FORGIVEN"] + payments.aggregated["FORGIVEN"],
			SCHOLARSHIP: stats["SCHOLARSHIP"] + payments.aggregated["SCHOLARSHIP"],
		}
	}

	return stats
}

const getAggregatedPaymentList = (students: S) => {

	let stats: MISStudent["payments"]["monthvise"] = {}

	for (const { payments } of Object.values(students || {})) {
		for (const [k, v] of Object.entries(payments.monthvise || {})) {

			if (stats[k]) {

				stats = {
					...stats,
					[k]: {
						OWED: stats[k].OWED + v.OWED,
						FORGIVEN: stats[k].FORGIVEN + v.FORGIVEN,
						SCHOLARSHIP: stats[k].SCHOLARSHIP + v.SCHOLARSHIP,
						SUBMITTED: stats[k].SUBMITTED + v.SUBMITTED
					}
				}
			} else {
				stats = {
					...stats,
					[k]: v
				}
			}
		}
	}

	return stats
}