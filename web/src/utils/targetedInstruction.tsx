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
                                        possible: 1
                                    }
                                }
                            }
                        }, {})
                }
            }
        }, {})
}

export const getSingleStdData = (id: string, stdReport: Report) => {
    return Object.entries(stdReport && stdReport[id] && stdReport[id].report)
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

export const redirectToIlmx = (id: string) => {
    window.location.href = id
}
