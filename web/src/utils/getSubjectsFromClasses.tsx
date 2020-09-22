export const getSubjectsFromClasses = (classes: RootDBState['classes'], className: string) => {
    const subjects = Object.values(classes)
        .reduce((agg, c) => {
            if (className === c.name) {
                return [...agg, ...Object.entries(c.subjects)
                    .reduce((agg2, [sub]) => {
                        return [
                            ...agg2,
                            sub
                        ]
                    }, [])]
            }
            return agg
        }, [])
    return subjects;
}

export default getSubjectsFromClasses;