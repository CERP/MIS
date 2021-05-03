import { SearchInput } from 'components/input/search'
import { AppLayout } from 'components/Layout/appLayout'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import UserIconSvg from 'assets/svgs/user.svg'
import { toTitleCase } from 'utils/toTitleCase'
import { Link } from 'react-router-dom'

const Salary = () => {
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
		let groupsByFacultyID = Object.values(expenses)
			.filter(element => element.expense === 'SALARY_EXPENSE')
			.reduce((agg: { [id: string]: MISSalaryExpense[] }, curr: any) => {
				const { faculty_id } = curr

				if (agg[faculty_id]) {
					return {
						...agg,
						[faculty_id]: [...agg[faculty_id], curr]
					}
				}

				return {
					...agg,
					[faculty_id]: [curr]
				}
			}, {} as { [id: string]: MISSalaryExpense[] })

		console.log('Teachers', faculty)
		console.log(groupsByFacultyID)
		console.log('ID is ', groupsByFacultyID[Object.keys(groupsByFacultyID)[0]][0].faculty_id)

		setTeacherSalaries(groupsByFacultyID)
	}

	const filteredStaff = Object.values(faculty).filter(
		f =>
			isValidTeacher(f) &&
			f.Active === isActive &&
			(search ? f.Name.toLowerCase().includes(search.toLowerCase()) : true)
	)

	return (
		<AppLayout title="Salaries" showHeaderTitle>
			<div className="pt-3 pb-3 pl-3 pr-3">
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
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 gap-y-12 md:gap-y-20">
						{filteredStaff
							.sort((a, b) => a.Name.localeCompare(b.Name))
							.map(teacher => {
								return (
									<Link
										to={{
											pathname: `/salary/${teacher.id}`,
											state: sortSalaries(teacherSalaries[teacher.id])
										}}>
										<Card
											key={teacher.id}
											teacher={teacher}
											salaries={sortSalaries(teacherSalaries[teacher.id])}
										/>
									</Link>
								)
							})}
					</div>
				)}
			</div>
		</AppLayout>
	)
}

type CardProps = {
	teacher: MISTeacher
	salaries: MISSalaryExpense[]
}

const Card = ({ teacher, salaries }: CardProps) => {
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
							{salaries ? salaries[0].amount : 0}
						</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Deducted</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg">
							{salaries ? salaries[0].deduction : 0}
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
						teacher.ProfilePicture?.url ||
						teacher.ProfilePicture?.image_string ||
						UserIconSvg
					}
					className="mx-auto h-20 w-20 rounded-full shadow-lg bg-gray-500 hover:bg-gray-700"
					alt={teacher.Name || 'faculty'}
				/>
			</div>
		</div>
	)
}

export const isValidTeacher = (teacher: MISTeacher): boolean => {
	return !!(teacher && teacher.id && teacher.Name)
}

function sortSalaries(salaries: MISSalaryExpense[]): MISSalaryExpense[] {
	return salaries?.sort((a, b) => (a.date > b.date ? -1 : 1))
}
export default Salary
