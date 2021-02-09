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

/**
 * Gives an array of all the grades (TIPLevels) that are available based on the targeted instruction tests
 * NOT including diagnostic test
 * @param targeted_instruction 
 */
export const getGradesFromTests = (targeted_instruction: RootReducerState["targeted_instruction"]): TIPLevels[] => {

	// note that unique_levels will have a key which is a TIPLevels type (level 0, level 1, ... etc)
	const unique_levels = Object.values(targeted_instruction.tests)
		.filter(t => t.type !== "Diagnostic")
		.reduce<Record<TIPLevels, number>>((agg, test) => {
			return {
				...agg,
				[test.grade as TIPLevels]: 1
			}
		}, {} as Record<TIPLevels, number>)

	return Object.keys(unique_levels) as TIPLevels[]
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

/**
 * Gets all students who are part of a TIPGrade (KG, 1, 2, 3)
 * @param students 
 * @param group 
 * @param subject 
 */
export const getStudentsByGroup = (students: RootDBState["students"], group: TIPGrades, subject: string) => {

	console.log(students, subject, group)

	return Object.values(students)
		.filter(s => s.targeted_instruction)
		.filter(s => s.targeted_instruction.learning_level)
		.filter(s => s.targeted_instruction.learning_level[subject])
		.filter(s => s.targeted_instruction.learning_level[subject].grade === group)
}

export const getPDF = (selectedSubject: string, selectedSection: string, targeted_instruction: RootReducerState["targeted_instruction"], type: string) => {
	let url, id
	let misTest = targeted_instruction.tests
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

export const getQuestionList = (diagnostic_result: MISStudent["targeted_instruction"]["results"], test_id: string) => {
	return Object.entries(diagnostic_result)
		.reduce((agg, [id, test]) => {
			if (id === test_id) {
				return test
			}
			return agg
		}, {})
}

export const calculateResult = (students: RootDBState["students"], sub: string) => {
	return Object.entries(students).reduce<DiagnosticRes>((agg, [std_id, std_obj]) => {
		const learning_level = std_obj.targeted_instruction.learning_level && std_obj.targeted_instruction.learning_level[sub]
		if (learning_level) {
			if (agg[learning_level.grade]) {
				return {
					...agg,
					[learning_level.grade]: {
						students: {
							...agg[learning_level.grade].students,
							[std_id]: std_obj
						}
					}
				}
			}
			return {
				...agg,
				[learning_level.grade]: {
					students: {
						[std_id]: std_obj
					}
				}
			}
		}
		return { ...agg }
	}, {} as DiagnosticRes)
}

type DiagnosticResultByGradeLevel = {
	[grade_level in TIPGrades]: {
		correct: number
		total: number
	}
}

/**
 * Takes a diagnostic report and calculates which learning level should be assigned based on the 
 * correct and incorrect answers on the test. 
 * @param result 
 */
export const calculateLearningLevelFromOralTest = (report: TIPDiagnosticReport): TIPGrades => {

	const result = report.questions

	// We build an object that tells us, for each "grade" level of a question, how many the 
	// student got correct out of the total amount.
	const grade_results = Object.values(result).reduce<DiagnosticResultByGradeLevel>((agg, question) => {
		const c = question.is_correct ? 1 : 0

		if (agg[question.grade]) {
			return {
				...agg,
				[question.grade]: {
					correct: agg[question.grade].correct + c,
					total: agg[question.grade].total + 1
				}
			}
		}

		return {
			...agg,
			[question.grade]: {
				correct: c,
				total: 1
			}
		}

	}, {} as DiagnosticResultByGradeLevel)

	// next we need to compute the percentage for each grade level.
	const grade_percentages = Object.entries(grade_results)
		.reduce<Record<TIPGrades, number>>((agg, [level, { correct, total }]) => {
			return {
				...agg,
				[level]: correct / total * 100
			}
		}, {} as Record<TIPGrades, number>)

	// now we check each grade level in order and see if they are below the threshold.
	const threshold = 70
	if (grade_percentages["KG"] < threshold) {
		return "KG"
	}
	if (grade_percentages["1"] < threshold) {
		return "1"
	}
	if (grade_percentages["2"] < threshold) {
		return "2"
	}
	if (grade_percentages["3"] < threshold) {
		return "3"
	}

	return "KG"
}

export const calculateLearningLevelFromDiagnosticTest = (report: TIPDiagnosticReport): TIPGrades => {

	const result = report.questions

	// We build an object that tells us, for each "grade" level of a question, how many the 
	// student got correct out of the total amount.
	const grade_results = Object.values(result).reduce<DiagnosticResultByGradeLevel>((agg, question) => {
		const c = question.is_correct ? 1 : 0

		if (agg[question.grade]) {
			return {
				...agg,
				[question.grade]: {
					correct: agg[question.grade].correct + c,
					total: agg[question.grade].total + 1
				}
			}
		}

		return {
			...agg,
			[question.grade]: {
				correct: c,
				total: 1
			}
		}

	}, {} as DiagnosticResultByGradeLevel)

	// next we need to compute the percentage for each grade level.
	const grade_percentages = Object.entries(grade_results)
		.reduce<Record<TIPGrades, number>>((agg, [level, { correct, total }]) => {
			return {
				...agg,
				[level]: correct / total * 100
			}
		}, {} as Record<TIPGrades, number>)

	// now we check each grade level in order and see if they are below the threshold.
	const threshold = 70
	if (grade_percentages["1"] < threshold) {
		return "Oral Test"
	}
	if (grade_percentages["2"] < threshold) {
		return "2"
	}
	if (grade_percentages["3"] < threshold) {
		return "3"
	}
	return "Oral Test"
}

// CONVERSIONS
export const convertLearningGradeToGroupName = (grade: TIPGrades) => {

	const conversion_map: Record<TIPGrades, TIPLearningGroups> = {
		"KG": "Blue",
		"1": "Yellow",
		"2": "Green",
		"3": "Orange",
		"Oral Test": "Black"
	}

	return conversion_map[grade]
}

export const convertLearningLevelToGrade = (level: TIPLevels): TIPGrades => {

	const conversion_map: Record<TIPLevels, TIPGrades> = {
		"Level 0": "KG",
		"Level 1": "1",
		"Level 2": "2",
		"Level 3": "3",
		"Oral": "Oral Test"
	}

	return conversion_map[level]
}

type LessonProgress = {
	[learning_level: string]: SubjectLessonProgress
}

type SubjectLessonProgress = {
	[subject: string]: {
		complete: number
		total: number
	}
}

/**
 * Returns the maximum amount of lessons which have been completed by a teacher.
 * 
 * Looks through the teachers curriculum object, and out of all possible learning levels and subjects
 * Returns the max completed.
 * @param teacher 
 */
export const getLessonProgress = (teacher: MISTeacher, curriculum: TIPCurriculum) => {

	// When a teacher has no progress
	if (!teacher.targeted_instruction || !teacher.targeted_instruction.curriculum) {
		return 0;
	}

	const teacher_curriculum = teacher.targeted_instruction.curriculum;

	// create map of {learning_level: {subject: { completed, total } }}
	// ultimately we want to take the number with the max completion.
	const lesson_progress = Object.entries(teacher_curriculum)
		.reduce<LessonProgress>((agg, [learning_level, subjects]) => {

			const lesson_progress = Object.entries(subjects)
				.reduce<SubjectLessonProgress>((subject_agg, [subject, lesson_plans]) => {

					if (curriculum[learning_level as TIPLevels] === undefined) {
						return subject_agg
					}

					const num_checked = Object.values(lesson_plans)
						.filter(lp => lp.taken)
						.length

					const total = Object.values(curriculum[learning_level as TIPLevels][subject]).length

					return {
						...subject_agg,
						[subject]: {
							complete: num_checked,
							total
						}
					}
				}, {} as SubjectLessonProgress)

			return {
				...agg,
				[learning_level]: lesson_progress
			}
		}, {})

	const overall_max = Object.values(lesson_progress)
		.reduce((max, subjects) => {
			return Object.values(subjects)
				.reduce((sm, curr) => {
					return Math.max(sm, curr.complete)
				}, max)
		}, 0)

	return overall_max;
}

/**
 * TODO: what does this do
 * @param students
 * @param test_id
 * @param type
 */
/*
export const getResult = (students: MISStudent, test_id: string, type: string) => {
	return Object.entries(students).reduce((agg, [std_id, std_obj]) => {
		if (std_obj.targeted_instruction[type][test_id].checked) {
			return {
				...agg,
				[std_id]: Object.values(std_obj.targeted_instruction[type][test_id].questions)
					.reduce((agg2, question) => {
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
*/

/**
 *
 * @param result
 */
/*
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
*/
