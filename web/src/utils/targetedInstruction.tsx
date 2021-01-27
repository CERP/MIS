export const createSingleStdReport = (diagnostic_result: MISStudent["targeted_instruction"]["diagnostic_result"], targeted_instruction: RootReducerState["targeted_instruction"], testId: string) => {
    return Object.values(((diagnostic_result && diagnostic_result[testId]) || {} as MISStudent["targeted_instruction"]["diagnostic_result"]))
        .reduce<MISReport>((report, { is_correct, slo }) => {
            const c = is_correct ? 1 : 0
            const inner = slo.reduce((updated_report: MISReport, curr_slo: string) => {
                const category = targeted_instruction && targeted_instruction.slo_mapping[curr_slo] && targeted_instruction.slo_mapping[curr_slo].category
                return {
                    ...updated_report,
                    [category]: {
                        correct: c,
                        possible: 1,
                        link: targeted_instruction.slo_mapping[curr_slo] && targeted_instruction.slo_mapping[curr_slo].link as string
                    }
                } as MISReport
            }, {})

            return Object.entries(inner).reduce<MISReport>((agg, [category, value]) => {
                if (agg[category]) {
                    return {
                        ...agg,
                        [category]: {
                            ...agg[category],
                            correct: agg[category].correct + c,
                            possible: agg[category].possible + 1,
                        }
                    } as MISReport
                }
                return {
                    ...agg,
                    [category]: value
                } as MISReport
            }, report)
        }, {})
}

export const createAllStdReport = (students: RootDBState["students"], targeted_instruction: RootReducerState["targeted_instruction"], testId: string, type: string) => {
    if (type === 'All Students') {
        return Object.values((students))
            .reduce((agg, std) => {
                const report = createSingleStdReport(students[std.id].targeted_instruction.diagnostic_result, targeted_instruction, testId)
                return {
                    ...agg,
                    [std.id]: {
                        name: std.Name,
                        report: report
                    }
                }
            }, {})
    }
}

// prepare Data Structure for data table (single student)
export const getSingleStdData = (stdReport: MISReport) => {
    let total = 0, obtained = 0
    let students = Object.entries(stdReport || {})
        .reduce((agg, [slo, obj]) => {
            obtained = obj.correct + obtained
            total = obj.possible + total
            return [
                ...agg,
                {
                    slo: slo,
                    correct: obj.correct,
                    possible: obj.possible,
                    percentage: Math.trunc((obj.correct / obj.possible) * 100),
                    link: obj.link
                }
            ]
        }, [])
    students[Object.keys(students).length] = {
        slo: '',
        correct: obtained,
        possible: total,
        percentage: (obtained / total) * 100,
        link: ''
    }
    return students
}
// prepare Data Structure for data table (All students)
export const getAllStdData = (stdReport: Report) => {
    let allStds, columns: Columns[] = [];
    allStds = Object.entries(stdReport || {})
        .reduce((agg, [id, reportObj]) => {
            let stdObj = {}
            stdObj = {
                ...stdObj,
                student: reportObj.name,
                id: id
            }
            !columns.find(col => col.name === 'student name') &&
                columns.push({
                    name: "student name",
                    selector: "student",
                    sortable: true
                })
            let total = 0
            for (let [slo, sloObj] of Object.entries(reportObj.report)) {
                total = ((sloObj.correct / sloObj.possible) * 100) + total
                stdObj = {
                    ...stdObj,
                    [slo]: Math.trunc((sloObj.correct / sloObj.possible) * 100)
                }
                !columns.find(col => col.name === slo) && columns.push({
                    name: slo,
                    selector: slo,
                    sortable: true
                })
            }
            total = Math.trunc((total / (Object.keys(reportObj.report).length * 100)) * 100)
            stdObj = {
                ...stdObj,
                total: total
            }
            return [...agg,
                stdObj]
        }, [])
    columns[Object.keys(columns).length] = {
        name: "total",
        selector: "total",
        sortable: true
    }
    return [allStds, columns]
}
// prepare Data Structure for Graph (All student)
export const graphData = (stdReport: Report, students: RootDBState["students"]) => {
    let graphData: GraphData = {}, arr = []
    for (let testObj of Object.values((stdReport && stdReport) || {})) {
        for (let [slo, rep] of Object.entries(testObj.report)) {
            graphData[slo] ? graphData[slo] = { percentage: graphData[slo].percentage + ((rep.correct / rep.possible) * 100), link: rep.link } :
                graphData[slo] = { percentage: Math.trunc((rep.correct / rep.possible) * 100), link: rep.link }
        }
    }
    for (let [id, obj] of Object.entries(graphData)) {
        arr.push({ name: id, percentage: obj.percentage / Object.entries(students).length, link: obj.link })
    }
    arr.sort((a, b) => {
        return b.percentage - a.percentage;
    });
    return arr
}

export const getQuestionList = (selectedTest: string, stdObj: MISStudent, testType: string) => {
    const res: MISDiagnosticReport['questions'] = stdObj && stdObj.targeted_instruction.diagnostic_result && stdObj.targeted_instruction.diagnostic_result[selectedTest].questions
    if (res && testType === 'Diagnostic') {
        return Object.entries(res).reduce((agg, [key, value]) => {
            return {
                [key]: {
                    "answer": value.is_correct,
                    "correctAnswer": value.answer,
                    "slo": value.slo[0]
                },
                ...agg
            }
        }, {})
    }
}

export const redirectToIlmx = (id: string) => {
    window.location.href = id
}

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