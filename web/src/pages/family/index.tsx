import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { AppLayout } from 'components/Layout/appLayout'
import { SearchInput } from 'components/input/search'
import { isValidStudent } from 'utils'
import toTitleCase from 'utils/toTitleCase'

import UserIconSvg from 'assets/svgs/user.svg'

type State = {
	search: string
}
interface Families {
	[famId: string]: Family
}
interface Family {
	id: string
	name: string
	phone: string
	students: {
		[id: string]: MISStudent
	}
}

export const Family = () => {
	const { students } = useSelector((state: RootReducerState) => state.db)

	const [state, setState] = useState<State>({
		search: ''
	})

	const families = useMemo(() => {
		const reduced = Object.values(students)
			.filter(s => isValidStudent(s) && s.Active)
			.reduce<Families>((agg, curr) => {
				if (!curr.FamilyID) {
					return agg
				}

				const k = `${curr.FamilyID}`

				const existing = agg[k]
				if (existing) {
					return {
						...agg,
						[k]: {
							id: k,
							name: curr.ManName,
							phone: curr.Phone,
							students: {
								...agg[k].students,
								[curr.id]: curr
							}
						}
					}
				} else {
					return {
						...agg,
						[k]: {
							id: k,
							name: curr.ManName,
							phone: curr.Phone,
							students: {
								[curr.id]: curr
							}
						}
					}
				}
			}, {} as Families)
		return reduced
	}, [students])

	return (
		<AppLayout title="Families">
			<div className="p-5 md:p-10 relative mb-20">
				{/* Can be extracted to a resuable component */}
				<Link to="staff/new">
					<div className="flex items-center justify-between fixed z-50 bottom-4 right-4 rounded-full bg-teal-brand text-white lg:hidden py-3 px-6 w-11/12 text-lg mr-0.5">
						<div>Create new Family</div>
						<div className="text-xl">+</div>
					</div>
				</Link>

				<div className="text-center font-bold text-2xl my-4">Families</div>
				<div className="flex flex-row mt-4 mb-12 md:mb-20 space-x-4 md:space-y-0 md:space-x-60">
					<SearchInput
						onChange={e => setState({ ...state, search: e.target.value })}
						placeholder="Search by Name or Family Id"
					/>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 gap-y-12 md:gap-y-20">
					{Object.values(families)
						.filter(fam => {
							const searchString = `${fam.id} ${fam.name} ${fam.phone}`.toLowerCase()
							return (
								fam.id &&
								(state.search ? searchString.includes(state.search) : true)
							)
						})
						.sort((a, b) => a.id.localeCompare(b.id))
						.map(f => (
							<Link key={f.id} to={`families/${f.id}`}>
								<Card family={f} />
							</Link>
						))}
				</div>
			</div>
		</AppLayout>
	)
}

type CardProps = {
	family: Family
}

const Card = ({ family }: CardProps) => {
	return (
		<div className="relative">
			<div className="bg-white rounded-xl text-center border border-gray-50 shadow-md px-3 py-4 md:p-5">
				<div className="font-bold pt-8 truncate w-4/5 mx-auto">
					{toTitleCase(family.id)}
				</div>
				<div className="mt-2 space-y-0 text-sm md:text-base">
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Gaurdian</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg truncate">
							{toTitleCase(family.name)}
						</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Phone</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg truncate">
							{family.phone}
						</div>
					</div>
					<div className="flex items-center justify-between flex-row">
						<div className="text-gray-900 font-semibold">Siblings</div>
						<div className="text-gray-500 text-xs md:text-base lg:text-lg">
							{Object.keys(family.students).length}
						</div>
					</div>
				</div>
			</div>
			<div className="absolute -top-6 left-0 right-0">
				<img
					src={UserIconSvg}
					className="mx-auto h-16 w-16  rounded-full shadow-md bg-gray-500 hover:bg-gray-700"
					alt={'student'}
				/>
			</div>
		</div>
	)
}
