import React, { useState } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

import { useFamily, AugmentedFamily } from 'hooks/useFamily'
import { AppLayout } from 'components/Layout/appLayout'
import { SearchInput } from 'components/input/search'
import { toTitleCase } from 'utils/toTitleCase'
import { AddStickyButton } from 'components/Button/add-sticky'
import Paginate from 'components/Paginate'
import UserIconSvg from 'assets/svgs/user.svg'

type State = {
	search: string
}

interface FamilyProps {
	forwardTo?: string
	pageTitle?: string
}

export const Family = ({ forwardTo, pageTitle }: FamilyProps) => {
	const [state, setState] = useState<State>({
		search: ''
	})

	const { families } = useFamily()
	const filteredFamilies = Object.values(families ?? {})
		.filter(fam => {
			const searchString = `${fam.id} ${fam.name} ${fam.phone}`.toLowerCase()
			return fam.id && (state.search ? searchString.includes(state.search) : true)
		})
		.sort((a, b) => a.id.localeCompare(b.id))

	const listItem = (fam: AugmentedFamily) => {
		return (
			<Link
				key={fam.id}
				to={forwardTo ? `/families/${fam.id}/${forwardTo}` : `/families/${fam.id}`}>
				<Card family={fam} />
			</Link>
		)
	}
	return (
		<AppLayout
			total={filteredFamilies.length ?? 0}
			title={pageTitle ?? 'Families'}
			showHeaderTitle={!pageTitle}>
			<div className="p-5 md:p-10 md:pt-5 relative mb-10 md:mb-0">
				<Link to="/families/new">
					<AddStickyButton label="Create new Family" />
				</Link>

				{/* {!pageTitle && (
					<div className="text-center font-bold text-2xl my-4 lg:hidden">Families</div>
				)} */}
				<div className="flex flex-row mt-4 mb-12 md:mb-20 space-x-4 md:space-y-0 md:space-x-60">
					<SearchInput
						className="md:w-4/12"
						onChange={e => setState({ ...state, search: e.target.value })}
						placeholder="Search by Name or Family Id"
					/>
				</div>

				<Paginate
					items={filteredFamilies}
					itemsPerPage={10}
					numberOfBottomPages={3}
					renderComponent={listItem}
				/>
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
			<div className="bg-white rounded-xl lg:h-48  text-center border border-gray-50 shadow-md px-3 py-4 md:p-5">
				<div className="font-bold pt-4 truncate w-4/5 mx-auto">
					{toTitleCase(family.id)}
				</div>
				<div className="mt-2 space-y-0 text-sm md:text-base">
					<CardItem title={'Gaurdian'} val={toTitleCase(family.name)} />
					<CardItem title={'Phone'} val={toTitleCase(family.phone)} />
					<CardItem title={'CNIC'} val={toTitleCase(family.ManCNIC)} />
					<CardItem title={'Siblings'} val={Object.keys(family.students).length} />
				</div>
			</div>
			<div className="absolute left-0 right-0 -top-6 md:-top-8 flex -space-x-2 overflow-hidden justify-center">
				{Object.values(family.students ?? {}).map(
					(s, index) =>
						index <= 2 && (
							<img
								key={s.id}
								src={
									s.ProfilePicture?.url ??
									s.ProfilePicture?.image_string ??
									UserIconSvg
								}
								className={clsx(
									' w-12 h-12 md:h-16 md:w-16 rounded-full shadow-md bg-gray-500 inline-block ring-2 ring-white'
								)}
								alt={s.Name}
							/>
						)
				)}
			</div>
		</div>
	)
}

type CardItemProps = {
	title: string
	val: string | number
}
const CardItem = ({ title, val }: CardItemProps) => (
	<div className="flex items-center justify-between flex-row text-sm">
		<div className="font-semibold">{title}</div>
		<div className="text-gray-500 text-xs">{val}</div>
	</div>
)
