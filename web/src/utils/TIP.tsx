//@ts-nocheck
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

export const getStudentsByGroup = (students: RootDBState["students"], group: string, subject: string) => {
    const stds = Object.values(students)
        .reduce<RootDBState["students"]>((agg, student) => {
            return {
                ...agg,
                [student.id]: Object.entries(student.targeted_instruction.learning_level || {})
                    .reduce((agg2, [sub, obj]) => {
                        if (sub === subject) {
                            if (obj.group === group) {
                                return student
                            }
                        }
                        return { ...agg2 }
                    }, {})
            }
        }, {})
    Object.keys(stds).forEach(key => Object.keys(stds[key]).length !== 0 ? stds[key] : delete stds[key]);
    return stds
}

export const getPDF = (selectedSubject: string, selectedSection: string, targeted_instruction: RootReducerState["targeted_instruction"], type: string) => {
    let url, id
    let misTest: Tests = targeted_instruction['tests']
    for (let [test_id, obj] of Object.entries(misTest)) {
        if (obj.grade.substring(obj.grade.length - 1) === selectedSection.substring(selectedSection.length - 1) &&
            obj.subject === selectedSubject && obj.type === type) {
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
        const learning_level = std_obj.targeted_instruction.learning_level && std_obj.targeted_instruction.learning_level[sub]
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

export const getCount = (faculty: RootDBState["faculty"], faculty_id: string) => {
    let count = 0, complete = 0;
    for (let subjects of Object.values(faculty[faculty_id].targeted_instruction.curriculum)) {
        for (let lessons of Object.values(subjects)) {
            for (let lesson of Object.values(lessons)) {
                complete++
                if (lesson.taken) {
                    count++
                }
            }
        }
    }
    return [count, complete]
}

export const getResult = (students: RootDBState["students"], test_id: string, type: string) => {
    return Object.entries(students).reduce((agg, [std_id, std_obj]) => {
        if (std_obj.targeted_instruction[type][test_id].checked) {
            return {
                ...agg,
                [std_id]: Object.values(std_obj.targeted_instruction[type][test_id].questions).reduce((agg2, question) => {
                    const val = question.is_correct ? 1 : 0
                    const slo_category = question.slo_category
                    if (agg2 && agg2.slo_obj && agg2.slo_obj[slo_category]) {
                        return {
                            ...agg2,
                            std_name: std_obj.Name,
                            obtain: agg2.obtain + val,
                            total: agg2.total + 1,
                            slo_obj: {
                                ...agg2.slo_obj,
                                [slo_category]: {
                                    obtain: agg2.slo_obj[slo_category].obtain + val,
                                    total: agg2.slo_obj[slo_category].total + 1
                                }
                            }
                        }
                    } else if (agg2.total > 0) {
                        return {
                            ...agg2,
                            std_name: std_obj.Name,
                            obtain: agg2.obtain + val,
                            total: agg2.total + 1,
                            slo_obj: {
                                ...agg2.slo_obj,
                                [slo_category]: {
                                    obtain: val,
                                    total: 1
                                }
                            }
                        }
                    }
                    return {
                        ...agg2,
                        std_name: std_obj.Name,
                        obtain: val,
                        total: 1,
                        slo_obj: {
                            ...agg2.slo_obj,
                            [slo_category]: {
                                obtain: val,
                                total: 1
                            }
                        }
                    }
                }, {})
            }
        }
        return { ...agg }
    }, {})
}

interface Result {
    [std_id: string]: {
        std_name: string
        obtain: number
        total: number
        slo_obj: {
            [slo_name]: {
                obtain: number
                total: number
            }
        }
    }
}

export const getClassResult = (result: Result) => {

    return Object.values(result || {}).reduce((agg, std_obj) => {
        for (let [slo, slo_obj] of Object.entries(std_obj.slo_obj)) {
            if (agg[slo]) {
                agg = {
                    ...agg,
                    [slo]: {
                        obtain: agg[slo].obtain + slo_obj.obtain,
                        total: agg[slo].total + slo_obj.total
                    }
                }
            } else {
                agg = {
                    ...agg,
                    [slo]: {
                        obtain: slo_obj.obtain,
                        total: slo_obj.total
                    }
                }
            }
        }
        return agg
    }, {})
}
