import { AppLayout } from 'components/Layout/appLayout'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import UserIconSvg from 'assets/svgs/user.svg'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'

export const StaffList = () => {

	const { faculty, classes } = useSelector((state: RootReducerState) => state.db)

	const sections = useMemo(() => {
		return getSectionsFromClasses(classes)
	}, [classes])

	return (
		<AppLayout title="Staff">
			<div className="p-5 md:p-10">
				<div className="fixed z-50 bottom-4 right-4 w-16 h-16 rounded-full bg-gray-900 text-white block lg:hidden">H</div>
				<div className="text-center font-bold text-2xl my-4">School Staff</div>
				<div className="text-gray-700 text-center">Total = {Object.keys(faculty).length}</div>
				<div className="flex flex-row items-center justify-between mt-4 mb-12">

					<div className="relative">
						<input type="text" name="search"
							className="tw-input inline-flex items-center pl-8 rounded-full shadow-md"
							placeholder="Search by Name, Class"
							autoComplete="off" />
						<div className="absolute text-gray-500 left-0 ml-2 mr-4 my-3 top-0">
							<svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966" width="512px" height="512px">
								<path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
							</svg>
						</div>
					</div>

					<select className="tw-select rounded shadow text-teal-500">
						<option>Active</option>
						<option>InActive</option>
					</select>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-12">
					{
						Object.values(faculty)
							.filter(f => f.Name && f.Active)
							.sort((a, b) => a.Name.localeCompare(b.Name))
							.map(f => (
								<Card key={f.id} teacher={f} sections={sections} />
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
			<div className="bg-white rounded-xl text-center border border-gray-200 shadow-md p-2 md:p-2">
				<div className="font-bold pt-8 truncate w-4/5 mx-auto">{teacher.Name}</div>
				<div className="mt-2 space-y-0 text-sm">
					<div className="flex items-items justify-between flex-row">
						<div className="text-gray-900 font-semibold">Father</div>
						<div className="text-gray-500">{teacher.ManName}</div>
					</div>
					<div className="flex items-items justify-between flex-row">
						<div className="text-gray-900 font-semibold">Class</div>
						<div className="text-gray-500 truncate w-4/5">{teacherSection?.namespaced_name}</div>
					</div>
					<div className="flex items-items justify-between flex-row">
						<div className="text-gray-900 font-semibold">CNIC</div>
						<div className="text-gray-500">{teacher.CNIC}</div>
					</div>
					<div className="flex items-items justify-between flex-row">
						<div className="text-gray-900 font-semibold">Phone</div>
						<div className="text-gray-500">{teacher.Phone}</div>
					</div>
				</div>
			</div>
			<div className="absolute -top-8 md:-top-10 left-0 right-0">
				<img src={UserIconSvg} className="mx-auto h-16 w-16 md:h-24 md:w-24 rounded-full shadow-lg bg-gray-500 hover:bg-gray-700" alt={teacher.Name || "faculty"} />
			</div>
		</div>
	)
}