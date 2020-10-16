export const createReport = (students: MISStudent[], targeted_instruction: RootDBState["targeted_instruction"], testId: string) => {
    return Object.values(students)
        .reduce((agg, std) => {
            return {
                ...agg,
                [std.id]: {
                    name: std.Name,
                    report: Object.values(std.diagnostic_result && std.diagnostic_result[testId] || {})
                        .reduce((agg2: MISReport, { isCorrect, slo }) => {
                            const category = targeted_instruction && targeted_instruction.slo_mapping[slo[0]].category;
                            const c = isCorrect ? 1 : 0
                            if (agg2[category]) {
                                return {
                                    ...agg2,
                                    [category]: {
                                        correct: agg2[category].correct + c,
                                        possible: agg2[category].possible + 1,
                                        percentage: (agg2[category].correct / agg2[category].possible) * 100,
                                        link: targeted_instruction.slo_mapping[slo[0]].link
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