import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { SearchInput } from 'components/input/search'
import { AppLayout } from 'components/Layout/appLayout'
import { toTitleCase } from 'utils/toTitleCase'
import { isValidTeacher } from 'utils'
import Paginate from 'components/Paginate'
import UserIconSvg from 'assets/svgs/user.svg'

type FacultySalaryExpense = {
	[id: string]: MISSalaryExpense[]
}

export const StaffSalary = () => {
	const expenses = useSelector((state: RootReducerState) => state.db.expenses)
	const faculty = useSelector((state: RootReducerState) => state.db.faculty)
	const [teacherSalaries, setTeacherSalaries] = useState<{ [id: string]: MISSalaryExpense[] }>(
		null
	)
	const [isActive, setIsActive] = useState(true)
	const [search, setSearch] = useState('')

	useEffect(() => {
		loadData()
	}, [expenses, faculty])

	const loadData = () => {
		const groupsByFacultyID = Object.values(expenses ?? {}).reduce<FacultySalaryExpense>(
			(agg, salaryExpense) => {
				const { faculty_id } = salaryExpense as MISSalaryExpense
				if (salaryExpense.expense === 'SALARY_EXPENSE') {
					if (agg[faculty_id]) {
						return {
							...agg,
							[faculty_id]: [...agg[faculty_id], salaryExpense]
						}
					}

					return {
						...agg,
						[faculty_id]: [salaryExpense]
					}
				}

				return agg
			},
			{}
		)

		setTeacherSalaries(groupsByFacultyID)
	}

	const listItem = (teacher: MISTeacher) => {
		return (
			<Link
				key={teacher.id}
				to={{
					pathname: `/staff/${teacher.id}/salaries`
				}}>
				<Card
					key={teacher.id}
					teacher={teacher}
					lastSalary={getLastSalary(teacherSalaries[teacher.id])}
				/>
			</Link>
		)
	}

	const filteredStaff = Object.values(faculty)
		.filter(
			f =>
				isValidTeacher(f) &&
				f.Active === isActive &&
				(search ? f.Name.toLowerCase().includes(search.toLowerCase()) : true)
		)
		.sort((a, b) => a.Name.localeCompare(b.Name))

	return (
		<AppLayout title="Staff Salaries" showHeaderTitle>
			<div className="pt-3 pb-3 pl-3 pr-3 lg:ml-10 lg:mr-10">
				<div className="flex flex-row items-center justify-between mt-4 mb-12 md:mb-20 space-x-4 md:space-y-0 md:space-x-60">
					<SearchInput onChange={e => setSearch(e.target.value)} />
					<select
						value={isActive.toString()}
						onChange={e => setIsActive(e.target.value === 'true')}
						className="mt-0 tw-select rounded shadow text-teal-brand w-2/5">
						<option value={'true'}>Active</option>
						<option value={'false'}>InActive</option>
					</select>
				</div>
				{teacherSalaries && (
					<Paginate
						items={filteredStaff}
						itemsPerPage={10}
						numberOfBottomPages={3}
						renderComponent={listItem}
					/>
				)}
			</div>
		</AppLayout>
	)
}

type CardProps = {
	teacher: MISTeacher
	lastSalary: { paid: number; deducted: number }
}

const Card = ({ teacher, lastSalary }: CardProps) => {
	return (
		<div className="relative">
			<div className="bg-white rounded-xl text-center border border-gray-100 shadow-md  py-4 md:p-5">
				<div className="font-bold pt-8   mx-auto">{toTitleCase(teacher.Name)}</div>
				<div className="mt-2 px-3 space-y-0 text-sm md:text-base">
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Salary</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg">
							{teacher.Salary}
						</div>
					</div>

					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Last Paid</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg">
							{lastSalary.paid}
						</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Deducted</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg">
							{lastSalary.deducted}
						</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Phone</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg">
							{teacher.Phone}
						</div>
					</div>
				</div>
			</div>
			<div className="absolute -top-10 left-0 right-0">
				<img
					src={
						teacher.ProfilePicture?.url ??
						teacher.ProfilePicture?.image_string ??
						UserIconSvg
					}
					className="mx-auto h-20 w-20 rounded-full shadow-lg bg-gray-500 hover:bg-gray-700"
					alt={teacher.Name ?? 'faculty'}
				/>
			</div>
		</div>
	)
}

function getLastSalary(salaries: MISSalaryExpense[]) {
	const localSalary = (salaries ?? []).sort((a, b) => (a.date > b.date ? -1 : 1))

	return {
		paid: localSalary?.[0]?.amount ?? 0,
		deducted: localSalary?.[0]?.deduction ?? 0
	}
}
