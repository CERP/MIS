export const createReport = (students: RootDBState["students"], targeted_instruction: RootDBState["targeted_instruction"], testId: string) => {
    return Object.values(students)
        .reduce((agg, std) => {
            return {
                ...agg,
                [std.id]: {
                    name: std.Name,
                    report: Object.values((std.diagnostic_result && std.diagnostic_result[testId]) || {})
                        .reduce((report: MISReport, { isCorrect, slo }) => {
                            const category = targeted_instruction && targeted_instruction.slo_mapping[slo[0]] && targeted_instruction.slo_mapping[slo[0]].category;
                            const c = isCorrect ? 1 : 0
                            if (report[category]) {
                                return {
                                    ...report,
                                    [category]: {
                                        correct: report[category].correct + c,
                                        possible: report[category].possible + 1,
                                        percentage: (report[category].correct / report[category].possible) * 100,
                                        link: targeted_instruction.slo_mapping[slo[0]] && targeted_instruction.slo_mapping[slo[0]].link
                                    }
                                }
                            } else {
                                return {
                                    ...report,
                                    [category]: {
                                        correct: c,
                                        possible: 1,
                                        percentage: c / 1 * 100,
                                        link: targeted_instruction.slo_mapping[slo[0]] && targeted_instruction.slo_mapping[slo[0]].link
                                    }
                                }
                            }
                        }, {})
                }
            }
        }, {})
}

export const getSingleStdData = (id: string, stdReport: Report) => {
    let total = 0, obtained = 0
    let students = Object.entries(stdReport && stdReport[id] && stdReport[id].report || {})
        .reduce((agg, [slo, obj]) => {
            obtained = obj.correct + obtained
            total = obj.possible + total
            return [
                ...agg,
                {
                    slo: slo,
                    correct: obj.correct,
                    possible: obj.possible,
                    percentage: obj.percentage,
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

export const getAllStdData = (stdReport: Report) => {
    let allStds, columns: Columns[] = [];
    allStds = Object.entries(stdReport)
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
                total = sloObj.percentage + total
                stdObj = {
                    ...stdObj,
                    [slo]: sloObj.percentage
                }
                !columns.find(col => col.name === slo) && columns.push({
                    name: slo,
                    selector: slo,
                    sortable: true
                })
            }
            total = (total / (Object.keys(reportObj.report).length * 100)) * 100
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

export const graphData = (stdReport: Report, students: RootDBState["students"]) => {
    let graphData: GraphData = {}, arr = []
    for (let testObj of Object.values((stdReport && stdReport) || {})) {
        for (let [slo, rep] of Object.entries(testObj.report)) {
            graphData[slo] ? graphData[slo] = { percentage: graphData[slo].percentage + rep.percentage, link: rep.link } :
                graphData[slo] = { percentage: rep.percentage, link: rep.link }
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
    const res: MISDiagnosticReport = stdObj && stdObj.diagnostic_result && stdObj.diagnostic_result[selectedTest]
    if (res && testType === 'Diagnostic') {
        return Object.entries(res).reduce((agg, [key, value]) => {
            return {
                [key]: {
                    "answer": value.isCorrect,
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
