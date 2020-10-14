type Subjects = {
    [id: string]: string[]
}

export const getSubjectsFromClasses = (classes: RootDBState['classes']) => {
    const subjects = Object.values(classes)
        .reduce<Subjects>((agg, c) => {
            return {
                ...agg,
                [c.name]: Object.entries(c.subjects)
                    .reduce((agg2, [sub]) => {
                        return [
                            ...agg2,
                            sub
                        ]
                    }, [])
            }
        }, {})
    return subjects;
}

export default getSubjectsFromClasses;