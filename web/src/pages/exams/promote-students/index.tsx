import React, { useState } from 'react'

import { AppLayout } from 'components/Layout/appLayout'
import { useSelector } from 'react-redux'
import { blankClass } from 'constants/form-defaults'
import { useEffect } from 'react'
import { CustomSelect } from 'components/select'
import getSectionFromId from 'utils/getSectionFromId'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import { ArrowNarrowRightIcon } from '@heroicons/react/outline'

type AugmentedClass = MISClass & {
	fromSection?: MISClass['sections']
	toSection?: MISClass['sections']
}

export const PromoteStudents = () => {
	const classes = useSelector((state: RootReducerState) => state.db.classes)
	const [localState, setLocalState] = useState<MISClass[]>([])
	const [promotionData, setPromotionData] = useState([])

	const calculatePromotionData = () => {
		let mapping: { [id: string]: AugmentedClass }
		for (let i = 0; i < localState.length - 1; i++) {
			let key = Object.keys(localState[i].sections)[0]
			if (i === 0) {
				const TempSection: MISClass['sections'] = { ['temp']: { name: 'TEMPORARY' } }
				mapping = {
					...mapping,
					[localState[i].id]: {
						...blankClass(),
						name: localState[i].name,
						classYear: localState[i].classYear + 1,
						sections: {
							['temp']: { name: 'TEMPORARY' }
						},

						fromSection: { [key]: localState[i].sections[key] },
						toSection: TempSection
					}
				}
			} else {
				mapping = {
					...mapping,
					[localState[i].id]: {
						...localState[i - 1],
						fromSection: { [key]: localState[i].sections[key] },
						toSection: { [key]: localState[i].sections[key] }
					}
				}
			}
		}

		console.log('Calculated Promotions', Object.entries(mapping))
		setPromotionData(Object.entries(mapping))
	}

	useEffect(() => {
		console.log('Firing Use Effect')
		setLocalState(Object.values(classes).sort((a, b) => b.classYear - a.classYear))
	}, [classes])

	useEffect(() => {
		if (localState.length > 0) {
			calculatePromotionData()
		}
	}, [localState])

	return (
		<AppLayout title="Promote Students" showHeaderTitle>
			<div className="p-5 md:p-10 md:pt-5 md:pb-0 text-gray-700 relative">
				{promotionData.map(([key, val]: [key: string, val: AugmentedClass]) => {
					return (
						<div
							key={key}
							className="flex flex-row justify-between p-2 bg-gray-50 shadow-md border-gray-200 border mb-4 rounded-xl font-medium text-gray-600 lg:text-2xl lg:py-6 lg:px-10 lg:mx-28 ">
							<div key={key} className="flex flex-col w-2/5 lg:w-2/6">
								<h1>{classes[key].name}</h1>
								<select
									className="w-full lg:w-3/6 rounded shadow tw-select text-teal-brand"
									onChange={e => {}}>
									{Object.entries(classes[key].sections).map(([key, section]) => {
										return <option value={key}>{section.name}</option>
									})}
								</select>
							</div>
							<div
								key={val.id + key}
								className="hidden md:flex flex-1  text-black font-normal justify-center items-center flex-col lg:w-2/6">
								Move To
								<div className="rounded-full cursor-pointer bg-blue-brand p-1 px-24 mx-4">
									<ArrowNarrowRightIcon className="h-12  text-white" />
								</div>
							</div>
							<div key={val.id} className="flex items-end flex-col w-2/5 lg:w-2/6">
								<h1>{val.name}</h1>
								<select
									className="w-full lg:w-3/6 rounded shadow tw-select text-teal-brand"
									onChange={e => {}}>
									{Object.entries(val.sections).map(([key, section]) => {
										return <option value={key}>{section.name}</option>
									})}
								</select>
							</div>
						</div>
					)
				})}
			</div>
		</AppLayout>
	)
}
