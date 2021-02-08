import { AppLayout } from 'components/Layout/appLayout'
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import UserIconSvg from 'assets/svgs/user.svg'

type Filter = {
	active: boolean
}

export const StudentList = () => {

	const { students, classes } = useSelector((state: RootReducerState) => state.db)
	const [search, setSearch] = useState('')
	const [filter, setFilter] = useState<Filter>({
		active: true
	})

	const sections = useMemo(() => {
		return getSectionsFromClasses(classes)
	}, [classes])

	return (
		<AppLayout title="Students">
			<div className="p-5 md:p-10 relative mb-20">

				<Link to="/students/new">
					<div className="flex items-center justify-between fixed z-50 bottom-4 right-4 rounded-full bg-teal-500 text-white lg:hidden py-3 px-6 w-11/12 text-lg mr-0.5">
						<div>Add new Student</div>
						<div className="text-xl">+</div>
					</div>
				</Link>

				<div className="text-center font-bold text-2xl my-4">School Students</div>
				<div className="text-gray-700 text-center">Total = {Object.keys(students).length}</div>
				<div className="flex flex-col md:flex-row items-center justify-between mt-4 mb-12 md:mb-20 space-y-2 md:space-y-0 md:space-x-60">

					<div className="relative w-full md:w-3/5">
						<input type="text" name="search"
							onChange={(e) => setSearch(e.target.value)}
							className="tw-input pl-8 rounded-rounded shadow w-full"
							placeholder="Search by Name, Class"
							autoComplete="off" />
						<div className="absolute text-gray-500 left-0 ml-2 mr-4 my-3 top-0">
							<svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966" width="512px" height="512px">
								<path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
							</svg>
						</div>
					</div>

					<div className="flex flex-row items-center justify-between space-x-8">
						<select className="tw-select rounded shadow text-teal-500 w-full">
							<option>Tag</option>
						</select>
						<select className="tw-select rounded shadow text-teal-500 w-full">
							<option>Class</option>
							{
								sections
									.sort((a, b) => (a.classYear ?? 0 - b.classYear ?? 0))
									.map(s => (
										<option key={s.id + s.class_id} value={s.id}>{s.namespaced_name}</option>
									))
							}
						</select>
						<select className="tw-select rounded shadow text-teal-500 w-full" onChange={(e) => setFilter({ ...filter, active: e.target.value === 'true' })}>
							<option value={'true'}>Active</option>
							<option value={'false'}>InActive</option>
						</select>
					</div>

				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 gap-y-12 md:gap-y-20">
					{
						Object.values(students)
							.filter(f => f && f.Name && f.section_id && (f.Active === filter.active) && (search ? f.Name.includes(search) : true))
							.sort((a, b) => a.Name.localeCompare(b.Name))
							.map(f => (
								<Link key={f.id} to={`students/${f.id}/profile`}>
									<Card student={f} sections={sections} />
								</Link>
							))
					}
				</div>

			</div>
		</AppLayout>
	)
}


type TCardProps = {
	student: MISStudent
	sections: AugmentedSection[]
}

const Card = ({ student, sections }: TCardProps) => {

	const studentSection = sections.find(s => s.id === student.section_id)

	return (
		<div className="relative">
			<div className="bg-white rounded-xl text-center border border-gray-200 shadow-md px-3 py-4 md:p-5">
				<div className="font-bold pt-8 truncate w-4/5 mx-auto">{student.Name}</div>
				<div className="mt-2 space-y-0 text-sm md:text-base">
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Father</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg truncate">{student.ManName}</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Class</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg truncate">{studentSection?.namespaced_name}</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Roll #</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg">{student.RollNumber}</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Phone</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg">{student.Phone}</div>
					</div>
				</div>
			</div>
			<div className="absolute -top-8 md:-top-12 left-0 right-0">
				<img src={student.ProfilePicture?.url || student.ProfilePicture?.image_string || UserIconSvg} className="mx-auto h-16 w-16 md:h-24 md:w-24 rounded-full shadow-lg bg-gray-500 hover:bg-gray-700" alt={student.Name || "student"} />
			</div>
		</div>
	)
}