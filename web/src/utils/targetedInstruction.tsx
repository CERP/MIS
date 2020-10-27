export const createReport = (students: RootDBState["students"], targeted_instruction: RootDBState["targeted_instruction"], testId: string) => {
    return Object.values(students)
        .reduce((agg, std) => {
            return {
                ...agg,
                [std.id]: {
                    name: std.Name,
                    report: Object.values((std.diagnostic_result && std.diagnostic_result[testId]) || {})
                        .reduce((agg2: MISReport, { isCorrect, slo }) => {
                            const category = targeted_instruction && targeted_instruction.slo_mapping[slo[0]] && targeted_instruction.slo_mapping[slo[0]].category;
                            const c = isCorrect ? 1 : 0
                            if (agg2[category]) {
                                return {
                                    ...agg2,
                                    [category]: {
                                        correct: agg2[category].correct + c,
                                        possible: agg2[category].possible + 1,
                                        percentage: (agg2[category].correct / agg2[category].possible) * 100,
                                        link: targeted_instruction.slo_mapping[slo[0]] && targeted_instruction.slo_mapping[slo[0]].link
                                    }
                                }
                            } else {
                                return {
                                    ...agg2,
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
    return Object.entries(stdReport && stdReport[id] && stdReport[id].report || {})
        .reduce((agg, [slo, obj]) => {
            return [
                ...agg,
                {
                    "slo": slo,
                    "correct": obj.correct,
                    "possible": obj.possible,
                    "percentage": obj.percentage,
                    "link": obj.link
                }
            ]
        }, [])
}

export const getAllStdData = (stdReport: Report) => {
    let allStds, columns: Columns[] = [];
    allStds = Object.entries(stdReport)
        .reduce((agg, [id, reportObj]) => {
            let stdObj = {}
            stdObj = {
                ...stdObj,
                "student": reportObj.name,
                "id": id
            }
            !columns.find(col => col.name === 'student name') &&
                columns.push({
                    "name": "student name",
                    "selector": "student",
                    "sortable": true
                })
            for (let [slo, sloObj] of Object.entries(reportObj.report)) {
                stdObj = {
                    ...stdObj,
                    [slo]: sloObj.percentage
                }
                !columns.find(col => col.name === slo) && columns.push({
                    "name": slo,
                    "selector": slo,
                    "sortable": true
                })
            }
            return [...agg,
                stdObj]
        }, [])
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
        arr.push({ name: id, percentage: Math.round(obj.percentage / Object.entries(students).length), link: obj.link })
    }
    arr.sort((a, b) => {
        return b.percentage - a.percentage;
    });
    return arr
}

export const redirectToIlmx = (id: string) => {
    window.location.href = id
}
