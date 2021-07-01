import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'

export const useSectionInfo = (sectionId: string) => {
	const { classes } = useSelector((state: RootReducerState) => state.db)

	const section = useMemo(() => {
		const sections = getSectionsFromClasses(classes)

		return sections.find(s => s.id === sectionId)
	}, [sectionId, classes])

	return {
		section
	}
}
