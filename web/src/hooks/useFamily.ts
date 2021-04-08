import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { isValidStudent } from 'utils'

export interface AugmentedFamily {
	id: string
	name: string
	phone: string
	students: {
		[id: string]: MISStudent
	}
}

export const useFamily = () => {
	const { students } = useSelector((state: RootReducerState) => state.db)

	const families = useMemo(() => {
		const reduced = Object.values(students)
			.filter(s => isValidStudent(s) && s.Active)
			.reduce<{ [id: string]: AugmentedFamily }>((agg, curr) => {
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
			}, {})
		return reduced
	}, [students])

	return {
		families
	}
}
