export const getSubjectsFromClasses = (classes: RootDBState['classes'], className: string) => {
    const subjects = Object.values(classes)
        .reduce((agg, c) => {
            if (className === c.name) {
                return [...Object.entries(c.subjects)
                    .reduce((agg2, [sub]) => {
                        return [
                            ...agg2,
                            sub
                        ]
                    }, [])]
            }
        }, [])
    return subjects;
}

export default getSubjectsFromClasses;