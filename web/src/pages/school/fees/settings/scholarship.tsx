import React, { useMemo, useState } from 'react'
import clsx from 'clsx'
import { useSelector } from 'react-redux'

import { isValidStudent } from 'utils'
import { toTitleCase } from 'utils/toTitleCase'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import { SearchInput } from 'components/input/search'

import UserIconSvg from 'assets/svgs/user.svg'
import { Link } from 'react-router-dom'

export const Scholarship = () => {
	const { students, classes } = useSelector((state: RootReducerState) => state.db)

	const [sectionId, setSectionId] = useState<string>()
	const [searchName, setSearchName] = useState<string>()

	const sections = useMemo(
		() =>
			getSectionsFromClasses(classes).sort((a, b) => (a.classYear ?? 0) - (b.classYear ?? 0)),
		[classes]
	)

	const sectionIdWithLeatClassYear = sections?.[0]?.id

	return (
		<div className="my-4 p-5 space-y-4 w-full md:w-9/12 mx-auto">
			<div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 md:space-x-40">
				<SearchInput onChange={e => setSearchName(e.target.value)} />

				<select
					value={sectionId || sectionIdWithLeatClassYear}
					onChange={e => setSectionId(e.target.value)}
					className="tw-select shadow-sm text-teal-500 w-full md:w-3/5">
					<option>Select Class</option>
					{sections
						.sort((a, b) => (a.classYear ?? 0) - (b.classYear ?? 0))
						.map(s => (
							<option key={s.id + s.class_id} value={s.id}>
								{toTitleCase(s.namespaced_name, '-')}
							</option>
						))}
				</select>
			</div>
			<div className={'w-full max-h-screen overflow-y-auto text-sm md:text-base rounded-lg'}>
				<div className="table w-full text-center">
					<div className="table-header-group bg-gray-700">
						<div className="table-row font-bold text-base text-white">
							<div className="table-cell p-2">Name</div>
							<div className="table-cell p-2">Reason</div>
							<div className="table-cell p-2">Scholoarship</div>
						</div>
					</div>
					<div className="table-row-group bg-white">
						{Object.values(students)
							.filter(
								s =>
									isValidStudent(s) &&
									(sectionId
										? s.section_id === sectionId
										: s.section_id === sectionIdWithLeatClassYear) &&
									(searchName
										? s.Name.toLowerCase().includes(searchName.toLowerCase())
										: true)
							)
							.sort(
								(a, b) =>
									(parseInt(a.RollNumber) ?? 0) - (parseInt(b.RollNumber) ?? 0)
							)
							.map((s, index) => (
								<div
									key={s.id}
									className={clsx(
										'table-row',
										index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
									)}>
									<div className="table-cell text-left p-2 pt-4">
										<div className="flex flex-row items-center">
											<img
												className="w-6 h-6 rounded-full bg-gray-400 mr-4"
												src={
													s.ProfilePicture?.url ||
													s.ProfilePicture?.image_string ||
													UserIconSvg
												}
											/>
											<Link
												to={`/students/${s.id}/profile`}
												className="text-blue-brand hover:underline">
												{toTitleCase(s.Name)}
											</Link>
										</div>
									</div>
									<div className="table-cell p-2 pb-4">
										<input
											type="text"
											className="w-32 md:w-48 py-1 tw-input"
											placeholder="e.g. Need based"
										/>
									</div>
									<div className="table-cell p-2 pb-4">
										<input
											type="number"
											className="w-20 md:w-32 py-1 tw-input"
										/>
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
			<div className="flex justify-end">
				<button className="tw-btn-blue w-full md:w-1/4">Save Scholarship</button>
			</div>
		</div>
	)
}
