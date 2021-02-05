import { AppLayout } from 'components/Layout/appLayout'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import UserIconSvg from 'assets/svgs/user.svg'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import { Link } from 'react-router-dom'

export const StaffList = () => {

	const { faculty, classes } = useSelector((state: RootReducerState) => state.db)

	const sections = useMemo(() => {
		return getSectionsFromClasses(classes)
	}, [classes])

	return (
		<AppLayout title="Staff">
			<div className="p-5 md:p-10 relative mb-20">

				<Link to="staff/new">
					<div className="flex items-center justify-between fixed z-50 bottom-4 right-4 rounded-full bg-teal-500 text-white lg:hidden py-3 px-6 w-11/12 text-lg mr-0.5">
						<div>Add new Staff</div>
						<div className="text-xl">+</div>
					</div>
				</Link>

				<div className="text-center font-bold text-2xl my-4">School Staff</div>
				<div className="text-gray-700 text-center">Total = {Object.keys(faculty).length}</div>
				<div className="flex flex-col md:flex-row items-center justify-between mt-4 mb-12 md:mb-20 space-y-2 md:space-y-0 md:space-x-60">

					<div className="relative w-full md:w-3/5">
						<input type="text" name="search"
							className="tw-input pl-8 rounded-rounded shadow w-full"
							placeholder="Search by Name, Class"
							autoComplete="off" />
						<div className="absolute text-gray-500 left-0 ml-2 mr-4 my-3 top-0">
							<svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966" width="512px" height="512px">
								<path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
							</svg>
						</div>
					</div>

					<select className="tw-select rounded shadow text-teal-500 w-full md:w-3/5">
						<option>Active</option>
						<option>InActive</option>
					</select>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 gap-y-12 md:gap-y-20">
					{
						Object.values(faculty)
							.filter(f => f.Name && f.Active)
							.sort((a, b) => a.Name.localeCompare(b.Name))
							.map(f => (
								<Link key={f.id} to={`staff/${f.id}/profile`}>
									<Card teacher={f} sections={sections} />
								</Link>
							))
					}
				</div>

			</div>
		</AppLayout>
	)
}


type TCardProps = {
	teacher: MISTeacher
	sections: AugmentedSection[]
}

const Card = ({ teacher, sections }: TCardProps) => {

	const teacherSection = sections.find(s => s.faculty_id === teacher.id)

	return (
		<div className="relative">
			<div className="bg-white rounded-xl text-center border border-gray-200 shadow-md px-3 py-4 md:p-5">
				<div className="font-bold pt-8 truncate w-4/5 mx-auto">{teacher.Name}</div>
				<div className="mt-2 space-y-0 text-sm md:text-base">
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Father</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg">{teacher.ManName}</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Class</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg truncate">{teacherSection?.namespaced_name}</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">CNIC</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg">{teacher.CNIC}</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Phone</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg">{teacher.Phone}</div>
					</div>
				</div>
			</div>
			<div className="absolute -top-8 md:-top-12 left-0 right-0">
				<img src={UserIconSvg} className="mx-auto h-16 w-16 md:h-24 md:w-24 rounded-full shadow-lg bg-gray-500 hover:bg-gray-700" alt={teacher.Name || "faculty"} />
			</div>
		</div>
	)
}