export const getSubjectsFromTests = (targeted_instruction: RootReducerState["targeted_instruction"]): string[] => {
    const subjects = Object.values(targeted_instruction.tests).reduce((agg, test) => {
        if (test.subject !== '') {
            return [
                ...agg,
                test.subject
            ]
        }
    }, [])
    return [...new Set(subjects)]
}

export const getGradesFromTests = (targeted_instruction: RootReducerState["targeted_instruction"]): string[] => {
    const grades = Object.values(targeted_instruction.tests || {}).reduce((agg, test) => {
        if (test.questions !== null) {
            return [
                ...agg,
                Object.values(test.questions || {}).reduce((agg2, question) => {
                    return [...agg2, question.grade]
                }, [])
            ]
        }
        return [...agg]
    }, [])
    //@ts-ignore
    return [...new Set(grades[0])]
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

export const calculateResult = (students: RootDBState["students"], sub: string) => {
    return Object.entries(students).reduce((agg, [std_id, std_obj]) => {
        const learning_level = std_obj.targeted_instruction.learning_level[sub]
        if (learning_level) {
            if (agg[learning_level.level]) {
                return {
                    ...agg,
                    [learning_level.level]: {
                        group: learning_level.group,
                        students: {
                            ...agg[learning_level.level].students,
                            [std_id]: std_obj
                        }
                    }
                }
            }
            return {
                ...agg,
                [learning_level.level]: {
                    group: learning_level.group,
                    students: {
                        [std_id]: std_obj
                    }
                }
            }
        }
        return { ...agg }
    }, {} as DiagnosticRes)
}

export const calculateLearningLevel = (result: MISDiagnosticReport['questions']) => {
    const total: Levels = {}
    const levels = Object.values(result || {}).reduce((agg, question) => {
        const val = question.is_correct ? 1 : 0
        if (agg[question.level]) {
            total[question.level] = total[question.level] + 1
            return {
                ...agg,
                [question.level]: agg[question.level] + val
            }
        }
        total[question.level] = 1
        return {
            ...agg,
            [question.level]: val
        }
    }, {} as Levels)
    const percentages = Object.entries(levels).reduce((agg, [level, value]) => {
        const percentage = value / total[level] * 100
        if (percentage < 80) {
            return {
                ...agg,
                [level]: percentage
            }
        }
        return { ...agg }
    }, {} as Levels)
    const level = Object.keys(percentages).reduce((a, b) => {
        if (percentages[a] === 0 && percentages[b] === 0) {
            return a < b ? a : b
        }
        return percentages[a] > percentages[b] ? a : b
    }, '')
    const color = level === "1" ? "blue" : level === "2" ? "red" : level === "3" ? "green" : "orange"
    return { "level": level, "group": color }
}