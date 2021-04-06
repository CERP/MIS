import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { useFamily, AugmentedFamily } from 'hooks/useFamily'
import { AppLayout } from 'components/Layout/appLayout'
import { SearchInput } from 'components/input/search'
import toTitleCase from 'utils/toTitleCase'

import UserIconSvg from 'assets/svgs/user.svg'

type State = {
	search: string
}

export const FamilyPayments = () => {
	const [state, setState] = useState<State>({
		search: ''
	})

	const { families } = useFamily()

	return (
		<AppLayout title="Families" showHeaderTitle>
			<div className="p-5 md:p-10 relative mb-20">
				{/* <div className="text-center font-bold text-2xl my-4">Families</div> */}
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
							<Link key={f.id} to={`families/${f.id}/payments`}>
								<Card family={f} />
							</Link>
						))}
				</div>
			</div>
		</AppLayout>
	)
}

type CardProps = {
	family: AugmentedFamily
}

const Card = ({ family }: CardProps) => {
	return (
		<div className="relative">
			<div className="bg-white rounded-xl text-center border border-gray-50 shadow-md px-3 py-4 md:p-5">
				<div className="font-bold pt-4 truncate w-4/5 mx-auto">
					{toTitleCase(family.id)}
				</div>
				<div className="mt-2 space-y-0 text-sm md:text-base">
					<CardItem title={'Gaurdian'} val={toTitleCase(family.name)} />
					<CardItem title={'Phone'} val={toTitleCase(family.phone)} />
					<CardItem title={'Siblings'} val={Object.keys(family.students).length} />
					<CardItem title={'Pending'} val={0} />
				</div>
			</div>
			<div className="absolute -top-6 left-0 right-0">
				<div className="flex flex-row items-center justify-center">
					{Object.values(family.students || {}).map(
						(s, index) =>
							index <= 2 && (
								<img
									key={s.id}
									src={UserIconSvg}
									className="w-12 h-12 md:h-14 md:w-14  rounded-full shadow-md bg-gray-500 hover:bg-gray-700"
									alt={s.Name}
								/>
							)
					)}
				</div>
			</div>
		</div>
	)
}

type CardItemProps = {
	title: string
	val: string | number
}
const CardItem = ({ title, val }: CardItemProps) => (
	<div className="flex items-center justify-between flex-row">
		<div className="text-gray-900 font-semibold">{title}</div>
		<div className="text-gray-500 text-xs md:text-base lg:text-lg">{val}</div>
	</div>
)
