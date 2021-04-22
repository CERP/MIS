export const getSubjectsFromTests = (
	targeted_instruction: RootReducerState['targeted_instruction']
): string[] => {
	const subjects = Object.values(targeted_instruction.tests).reduce((agg, test) => {
		if (test.subject !== '') {
			return [...agg, test.subject]
		}
	}, [])
	return [...new Set(subjects)]
}

export const getClassnameFromSectionId = (
	sortedSections: AugmentedSection[],
	sectionId: string
) => {
	return sortedSections.reduce((agg: string, section: AugmentedSection) => {
		if (section.id === sectionId) {
			return section.className
		}
		return agg
	}, '')
}

export const getStudentsBySectionId = (sectionId: string, students: RootDBState['students']) => {
	return (students = Object.values(students).reduce<RootDBState['students']>((agg, student) => {
		if (student.section_id === sectionId) {
			return {
				...agg,
				[student.id]: student
			}
		}
		return agg
	}, {}))
}

/**
 * Gets all students who are part of a TIPGrade (KG, 1, 2, 3)
 * @param students
 * @param group
 * @param subject
 */
export const getStudentsByGroup = (
	students: RootDBState['students'],
	group: TIPGrades,
	subject: string
) => {
	console.log(students, subject, group)

	return Object.values(students)
		.filter(s => s.targeted_instruction)
		.filter(s => s.targeted_instruction.learning_level)
		.filter(s => s.targeted_instruction.learning_level[subject])
		.filter(s => s.targeted_instruction.learning_level[subject].grade === group)
}

export const calculateResult = (students: RootDBState['students'], sub: string) => {
	return Object.entries(students).reduce<DiagnosticRes>((agg, [std_id, std_obj]) => {
		const learning_level =
			std_obj.targeted_instruction.learning_level &&
			std_obj.targeted_instruction.learning_level[sub]
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
		if (agg['Not Graded']) {
			return {
				...agg,
				'Not Graded': {
					students: {
						...agg['Not Graded'].students,
						[std_id]: std_obj
					}
				}
			}
		}
		return {
			...agg,
			'Not Graded': {
				students: {
					[std_id]: std_obj
				}
			}
		}
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
	const grade_results = Object.values(result).reduce<DiagnosticResultByGradeLevel>(
		(agg, question) => {
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
		},
		{} as DiagnosticResultByGradeLevel
	)

	// next we need to compute the percentage for each grade level.
	const grade_percentages = Object.entries(grade_results).reduce<Record<TIPGrades, number>>(
		(agg, [level, { correct, total }]) => {
			return {
				...agg,
				[level]: (correct / total) * 100
			}
		},
		{} as Record<TIPGrades, number>
	)

	// now we check each grade level in order and see if they are below the threshold.
	const threshold = 70
	if (grade_percentages['KG'] < threshold) {
		return 'KG'
	}

	return '1'
}

export const calculateLearningLevelFromDiagnosticTest = (
	report: TIPDiagnosticReport
): TIPGrades => {
	const result = report.questions

	// We build an object that tells us, for each "grade" level of a question, how many the
	// student got correct out of the total amount.
	const grade_results = Object.values(result).reduce<DiagnosticResultByGradeLevel>(
		(agg, question) => {
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
		},
		{} as DiagnosticResultByGradeLevel
	)

	// next we need to compute the percentage for each grade level.
	const grade_percentages = Object.entries(grade_results).reduce<Record<TIPGrades, number>>(
		(agg, [level, { correct, total }]) => {
			return {
				...agg,
				[level]: (correct / total) * 100
			}
		},
		{} as Record<TIPGrades, number>
	)

	// now we check each grade level in order and see if they are below the threshold.
	const threshold = 70
	if (grade_percentages['1'] < threshold) {
		return 'Oral Test'
	}
	if (grade_percentages['2'] < threshold) {
		return '2'
	}
	if (grade_percentages['3'] < threshold) {
		return '3'
	}
	return 'Not Needed'
}

// CONVERSIONS
export const convertLearningGradeToGroupName = (grade: TIPGrades) => {
	const conversion_map: Record<TIPGrades, TIPLearningGroups> = {
		KG: 'Blue',
		'1': 'Yellow',
		'2': 'Green',
		'3': 'Orange',
		'Oral Test': 'Oral',
		'Not Needed': 'Remediation Not Needed',
		'Not Graded': 'Not Graded'
	}

	return conversion_map[grade]
}

export const convertLearningLevelToGrade = (level: TIPLevels): TIPGrades => {
	const conversion_map: Record<TIPLevels, TIPGrades> = {
		'Level KG': 'KG',
		'Level 1': '1',
		'Level 2': '2',
		'Level 3': '3',
		Oral: 'Oral Test',
		'Remediation Not Needed': 'Not Needed'
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
 * Here, we check the lesson progress in order. If a teacher has completed the first 17 lessons for any subject, this will return 17
 * if a teacher has completed all 35 lessons it will return 35
 * otherwise, it returns 0.
 *
 * This function is to be used only to decide which layout to show on the tip landing page.
 * @param teacher
 */
export const getLessonProgress = (teacher: MISTeacher) => {
	// When a teacher has no progress
	if (!teacher.targeted_instruction || !teacher.targeted_instruction.curriculum) {
		return 0
	}

	const teacher_curriculum = teacher.targeted_instruction.curriculum

	for (let [, learning_levels] of Object.entries(teacher_curriculum)) {
		// go through each subject
		// in any of these, do we complete the first 17 lessons or not?

		let first_17 = true
		let completed_all = true

		for (let subject of Object.values(learning_levels)) {
			const ordered_lessons = Object.entries(subject)
				.sort(([l1_id], [l2_id]) => l1_id.localeCompare(l2_id))
				.map(([, l]) => l)

			for (let i = 0; i < 17; i++) {
				first_17 = first_17 && ordered_lessons[i] && ordered_lessons[i].taken
			}

			completed_all = ordered_lessons.filter(lesson => lesson.taken).length == 35

			if (completed_all) {
				return 35
			}

			if (first_17) {
				return 17
			}
		}
	}

	return 0

	// create map of {learning_level: {subject: { completed, total } }}
	// ultimately we want to take the number with the max completion.
	// const lesson_progress = Object.entries(teacher_curriculum)
	// 	.reduce<LessonProgress>((agg, [learning_level, subjects]) => {

	// 		const lesson_progress = Object.entries(subjects)
	// 			.reduce<SubjectLessonProgress>((subject_agg, [subject, lesson_plans]) => {

	// 				if (curriculum[learning_level as TIPLevels] === undefined) {
	// 					return subject_agg
	// 				}

	// 				const num_checked = Object.values(lesson_plans)
	// 					.filter(lp => lp.taken)
	// 					.length

	// 				const total = Object.values(curriculum[learning_level as TIPLevels][subject]).length

	// 				return {
	// 					...subject_agg,
	// 					[subject]: {
	// 						complete: num_checked,
	// 						total
	// 					}
	// 				}
	// 			}, {} as SubjectLessonProgress)

	// 		return {
	// 			...agg,
	// 			[learning_level]: lesson_progress
	// 		}
	// 	}, {})

	// const overall_max = Object.values(lesson_progress)
	// 	.reduce((max, subjects) => {
	// 		return Object.values(subjects)
	// 			.reduce((sm, curr) => {
	// 				return Math.max(sm, curr.complete)
	// 			}, max)
	// 	}, 0)

	// return overall_max;
}

/**
 * this function return result of specific TIP test => slo based
 * @param students
 * @param test_id
 * @param type
 */
export const getResult = (students: MISStudent[], test_id: string) => {
	return Object.entries(students).reduce((agg, [std_id, std_obj]) => {
		if (std_obj.targeted_instruction.results[test_id]?.checked) {
			return {
				...agg,
				[std_id]: Object.values(
					std_obj.targeted_instruction.results[test_id].questions
				).reduce((agg2, question) => {
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
				}, {} as SLOBasedResult['slo_obj'])
			}
		}
		return { ...agg }
	}, {})
}

/**
 *
 * @param result
 */
export const getClassResult = (result: SLOBasedResult) => {
	return Object.values(result || {}).reduce<SloObj>((agg, std_obj) => {
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

/**
 *
 * @param name
 * @param pdf_url
 */
export const downloadPdf = (name: string, pdf_url: string) => {
	const e = document.createElement('a')
	e.setAttribute('href', decodeURIComponent(pdf_url))
	e.setAttribute('download', name + '.pdf')
	e.style.display = 'none'
	document.body.appendChild(e)
	e.click()
	document.body.removeChild(e)
}

/**
 *
 * @param value
 * @returns current test type
 */
export const getTestType = (value: string) => {
	switch (value) {
		case 'oral-test':
			return 'Oral'
		case 'formative-test':
		case 'formative-result':
			return 'Formative'
		case 'summative-test':
			return 'Summative'
		default:
			return 'Diagnostic'
	}
}

/**
 *
 * @param quizzes
 * @param subject
 * @param level
 * @returns TIP Quizzes
 */
export const getQuizzes = (quizzes: TIPQuizzes, subject: TIPSubjects, level: TIPLevels) => {
	return Object.entries(quizzes || {}).reduce((agg, [quiz_id, quiz]) => {
		if (quiz.grade === level && quiz.subject === subject) {
			return {
				...agg,
				[quiz_id]: quiz
			}
		}
		return { ...agg }
	}, {})
}

/**
 *
 * @param quizzes
 * @returns all SLOs in TIP Quizzes
 */
export const getQuizSLOs = (quizzes: TIPQuizzes) => {
	const sloArray = Object.values(quizzes || {}).reduce((agg, quiz) => {
		return [...agg, quiz.slo[0]]
	}, [])
	return [...new Set(sloArray)]
}

/**
 *
 * @param targeted_instruction
 * @param slo
 * @returns quiz id
 */
export const getQuizId = (
	targeted_instruction: RootReducerState['targeted_instruction'],
	slo: string[]
) => {
	return Object.entries(targeted_instruction.quizzes || {})
		.filter(([, t]) => t.slo[0] === slo[0])
		.map(([t_id]) => t_id)[0]
}

/**
 *
 * @param targeted_instruction
 * @param subject
 * @param grade
 * @returns midpoint test id
 */
export const getMidpointTestId = (
	targeted_instruction: RootReducerState['targeted_instruction'],
	subject: TIPSubjects,
	grade: TIPLevels
) => {
	return Object.entries(targeted_instruction.tests || {})
		.filter(([, t]) => t.type === 'Formative' && t.subject === subject && t.grade === grade)
		.map(([t_id]) => t_id)[0]
}
/**
 *
 * @param slo
 * @returns single slo quiz result
 */
export const getSingleSloQuizResult = (
	targeted_instruction: RootReducerState['targeted_instruction'],
	students: MISStudent[],
	slo: string[],
	subject: TIPSubjects,
	grade: TIPLevels
) => {
	const quiz_id = getQuizId(targeted_instruction, slo)

	const midpoint_test_id = getMidpointTestId(targeted_instruction, subject, grade)

	return students.reduce<SingleSloQuizResult>((agg, std) => {
		const [midpoint_obtain_marks, midpoint_total_marks] = getMidpointSloBaseResult(
			targeted_instruction,
			slo,
			std,
			midpoint_test_id
		)
		const quiz_obtain_marks = std.targeted_instruction?.quiz_result?.[quiz_id]?.obtained_marks
		const quiz_total_marks = targeted_instruction?.quizzes?.[quiz_id]?.total_marks
		return {
			...agg,
			[std.id]: {
				std_name: std.Name,
				std_roll_num: std.RollNumber,
				quiz_marks: (quiz_obtain_marks / quiz_total_marks) * 100,
				midpoint_test_marks: (midpoint_obtain_marks / midpoint_total_marks) * 100
			}
		}
	}, {})
}

/**
 *
 * @param targeted_instruction
 * @param slo
 * @param std
 * @param midpoint_test_id
 * @returns obtain and total marks of midpoint test
 */
export const getMidpointSloBaseResult = (
	targeted_instruction: RootReducerState['targeted_instruction'],
	slo: string[],
	std: MISStudent,
	midpoint_test_id: string
) => {
	let obtained_marks = 0
	const question_ids = Object.entries(
		targeted_instruction?.tests?.[midpoint_test_id]?.questions || {}
	)
		.filter(([, t]) => t.slo[0] === slo[0])
		.map(([t_id]) => t_id)

	question_ids.map(id => {
		if (std?.targeted_instruction?.results?.[midpoint_test_id]?.questions[id]?.is_correct) {
			obtained_marks = obtained_marks + 1
		}
	})
	return [obtained_marks, question_ids.length]
}
/**
 *
 * @param student
 * @param targeted_instruction
 * @param subject
 * @param grade
 */
export const getSingleStdQuizResult = (
	student: MISStudent,
	targeted_instruction: RootReducerState['targeted_instruction'],
	subject: TIPSubjects,
	grade: TIPLevels
) => {
	const midpoint_test_id = getMidpointTestId(targeted_instruction, subject, grade)

	const SLOs = getQuizSLOs(targeted_instruction.quizzes)
	return SLOs.reduce((agg, slo) => {
		const quiz_id = getQuizId(targeted_instruction, [slo])
		const quiz_obtained_marks =
			student?.targeted_instruction?.quiz_result?.[quiz_id]?.obtained_marks
		const quiz_total_marks = targeted_instruction?.quizzes?.[quiz_id]?.total_marks
		const [midpoint_obtained_marks, midpoint_total_marks] = getMidpointSloBaseResult(
			targeted_instruction,
			[slo],
			student,
			midpoint_test_id
		)
		return {
			...agg,
			[slo]: {
				quiz_marks: (quiz_obtained_marks / quiz_total_marks) * 100,
				midpoint_test_marks: (midpoint_obtained_marks / midpoint_total_marks) * 100
			}
		}
	}, {})
}

/**
 *
 * @param targeted_instruction
 * @param students
 * @param subject
 * @param grade
 * @returns skill base quiz result
 */

export const getSkillViewQuizResult = (
	targeted_instruction: RootReducerState['targeted_instruction'],
	students: MISStudent[],
	subject: TIPSubjects,
	grade: TIPLevels
) => {
	const midpoint_test_id = getMidpointTestId(targeted_instruction, subject, grade)
	const SLOs = getQuizSLOs(targeted_instruction.quizzes)
	return SLOs.reduce((agg, slo) => {
		let below_average = 0,
			average = 0,
			above_average = 0,
			midpoint_below = 0,
			midpoint_average = 0,
			midpoint_above = 0
		return [
			...agg,
			Object.values(students).reduce((agg2, std) => {
				const quiz_id = getQuizId(targeted_instruction, [slo])
				const quiz = std?.targeted_instruction?.quiz_result?.[quiz_id]
				const percentage = (quiz?.obtained_marks / quiz?.total_marks) * 100
				below_average = below_average + percentage < 40 ? 1 : 0
				average = average + percentage >= 40 && percentage <= 70 ? 1 : 0
				above_average = above_average + percentage > 70 ? 1 : 0
				const [midpoint_obtained_marks, midpoint_total_marks] = getMidpointSloBaseResult(
					targeted_instruction,
					[slo],
					std,
					midpoint_test_id
				)
				const midpoint_percentage = (midpoint_obtained_marks / midpoint_total_marks) * 100
				midpoint_below = midpoint_below + midpoint_percentage < 40 ? 1 : 0
				midpoint_average =
					midpoint_average + midpoint_percentage >= 40 && midpoint_percentage <= 70
						? 1
						: 0
				midpoint_above = midpoint_above + midpoint_percentage > 70 ? 1 : 0
				return {
					...agg2,
					[slo]: {
						quiz: {
							below_average,
							average,
							above_average
						},
						midpoint: {
							below_average: midpoint_below,
							average: midpoint_average,
							above_average: midpoint_above
						}
					}
				}
			}, {})
		]
	}, [])
}
