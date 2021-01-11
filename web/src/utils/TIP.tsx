export const getSubjectsFromTests = (targeted_instruction: RootReducerState["targeted_instruction"]): string[] => {
    return Object.values(targeted_instruction.tests).reduce((agg, test) => {
        if (test.subject !== '') {
            return [
                ...agg,
                test.subject
            ]
        }
    }, [])
}

export const getClassnameFromSectionId = (sortedSections: AugmentedSection[], sectionId: string) => {
    return sortedSections.reduce((agg: string, section: AugmentedSection) => {
        if (section.id === sectionId) {
            return section.className
        }
        return agg
    }, '')
}

export const getStudentsBySectionId = (sectionId: string, students: RootDBState["students"]) => {
    return students = Object.values(students)
        .reduce<RootDBState["students"]>((agg, student) => {
            if (student.section_id === sectionId) {
                return {
                    ...agg,
                    [student.id]: student
                }
            }
            return agg
        }, {})
}

export const getPDF = (selectedSubject: string, selectedSection: string, targeted_instruction: RootReducerState["targeted_instruction"]) => {
    let url, id
    let misTest: Tests = targeted_instruction['tests']
    for (let [test_id, obj] of Object.entries(misTest)) {
        if (obj.grade === selectedSection && obj.subject === selectedSubject) {
            url = obj.pdf_url
            id = test_id
            break
        } else {
            url = ''
            id = ''
        }
    }
    return [id, url]
}

export const getQuestionList = (diagnostic_result: MISStudent["targeted_instruction"]["diagnostic_result"], test_id: string) => {
    return Object.entries(diagnostic_result)
        .reduce((agg, [id, test]) => {
            if (id === test_id) {
                return test
            }
            return agg
        }, {})
}

export const getSloList = (targeted_instruction: RootReducerState["targeted_instruction"]) => {
    return Object.entries(targeted_instruction.tests).reduce((agg, [test_id, test]) => {
        return {
            ...agg,
            [test_id]: Object.values(test.questions).reduce((agg2, test) => {
                if ((agg2.length === 0 || agg2.length > 0) && !agg2.includes(test.slo_category)) {
                    return [
                        ...agg2, test.slo_category
                    ]
                }
                return [...agg2]
            }, [])

        }
    }, {})
}