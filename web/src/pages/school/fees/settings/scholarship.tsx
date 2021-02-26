import React, { useMemo, useState } from 'react'
import clsx from 'clsx'
import { useSelector } from 'react-redux'

import { isValidStudent } from 'utils'
import { toTitleCase } from 'utils/toTitleCase'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'

export const Scholarship = () => {

	const { students, classes } = useSelector((state: RootReducerState) => state.db)

	const [sectionId, setSectionId] = useState<string>()
	const [searchName, setSearchName] = useState<string>()

	const sections = useMemo(() => (
		getSectionsFromClasses(classes)
			.sort((a, b) => (a.classYear ?? 0) - (b.classYear ?? 0))
	), [classes])

	const sectionIdWithLeatClassYear = sections?.[0]?.id

	return (
		<div className="my-4 p-5 space-y-4 w-full md:w-9/12 mx-auto">
			<div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 md:space-x-40">

				<div className="relative w-full md:w-3/5">
					<input type="text" name="search"
						className="border-gray-100 tw-input pl-8 rounded-3xl shadow w-full"
						placeholder="Search by name"
						onChange={(e) => setSearchName(e.target.value)}
						autoComplete="off" />
					<div className="absolute text-gray-500 left-0 ml-2 mr-4 my-3 top-0">
						{/* TODO: move this to common place of import */}
						<svg className="h-4 w-4 mt-px fill-current" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966" width="512px" height="512px">
							<path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
						</svg>
					</div>
				</div>

				<select
					value={sectionId || sectionIdWithLeatClassYear}
					onChange={(e) => setSectionId(e.target.value)}
					className="tw-select rounded shadow text-teal-500 w-full md:w-3/5">
					<option>Select Class</option>
					{
						sections
							.sort((a, b) => (a.classYear ?? 0) - (b.classYear ?? 0))
							.map(s => (
								<option key={s.id + s.class_id} value={s.id}>{toTitleCase(s.namespaced_name, '-')}</option>
							))
					}
				</select>

			</div>
			<div className={"w-full max-h-screen overflow-y-auto text-sm md:text-base rounded-md"}>
				<div className="table w-full text-center">
					<div className="table-header-group bg-gray-700">
						<div className="table-row font-bold text-base text-white">
							<div className="table-cell p-2">Name</div>
							<div className="table-cell p-2">Reason</div>
							<div className="table-cell p-2">Scholoarship</div>
						</div>
					</div>
					<div className="table-row-group bg-white">

						{
							Object.values(students)
								.filter(s => isValidStudent(s)
									&& (sectionId ? s.section_id === sectionId : s.section_id === sectionIdWithLeatClassYear)
									&& (searchName ? s.Name.toLowerCase().includes(searchName.toLowerCase()) : true)
								)
								.sort((a, b) => (parseInt(a.RollNumber) ?? 0) - (parseInt(b.RollNumber) ?? 0))
								.map((c, index) => (
									<div key={c.id} className={clsx("table-row", index % 2 === 0 ? "bg-gray-100" : "bg-gray-200")}>
										<div className="table-cell p-2 text-left">
											<div className="">{toTitleCase(c.Name)}</div>
										</div>
										<div className="table-cell p-2">
											<input
												type="number"
												className="w-32 py-1 tw-input" placeholder="e.g. Need based" />
										</div>
										<div className="table-cell p-2">
											<div className="flex flex-col items-center">
												<input
													type="number"
													className="w-16 py-1 tw-input" />
												<div className="text-teal-500 text-xs p-1 text-left">Final:1500</div>
											</div>

										</div>
									</div>
								))
						}
					</div>
				</div>
			</div>
			<div className="flex justify-end">
				<button className="tw-btn-blue w-full md:w-1/4">Save Scholarship</button>
			</div>
		</div>
	)
}