
type P = {
	[id: string]: MISClass
}

export const getSectionsFromClasses = (classes: P) => {

	return Object.values(classes || {})
		.reduce<AugmentedSection[]>((agg, c) => {
			// each section
			return [...agg, ...Object.entries(c.sections)
				.reduce<AugmentedSection[]>((agg2, [id, section], i, arr) => {
					return [
						...agg2,
						{
							id,
							class_id: c.id,
							namespaced_name: arr.length === 1 && section.name === "DEFAULT" ? c.name : `${c.name}-${section.name}`,
							className: c.name,
							classYear: c.classYear,
							...section
						}
					]
				}, [])]
		}, [])

}