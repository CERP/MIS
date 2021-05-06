import React, { useState } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { convertLearningGradeToGroupName, getTestType } from 'utils/TIP'
import { useComponentVisible } from 'utils/customHooks'
import AssignedGroupModal from './AssignedGroupModal'
import { TModal } from '../Modal'
import Card from '../Card'
import {
	calculateLearningLevelFromDiagnosticTest,
	calculateLearningLevelFromOralTest
} from 'utils/TIP'
import {
	mergeTIPResult,
	assignLearningLevel,
	resetStudentLearningLevel,
	resetStudentGrades
} from 'actions'
interface P {
	teacher_name: string
	students: RootDBState['students']
	targeted_instruction: RootReducerState['targeted_instruction']

	resetStudentLearningLevel: (student_id: string, subject: TIPSubjects) => void
	resetStudentGrades: (student_id: string, test_id: string) => void
	setLearningLevel: (
		student_id: string,
		subject: TIPSubjects,
		level: TIPGrades,
		is_oral: boolean,
		history: TIPGradesHistory
	) => void
	saveReport: (
		student_id: string,
		diagnostic_report: TIPDiagnosticReport,
		test_id: string
	) => void
}

interface RouteParams {
	class_name: string
	subject: TIPSubjects
	section_id: string
	std_id: string
	test_id: string
	lesson_number: string
}

type PropsType = P & RouteComponentProps<RouteParams>

const GenerateEmptyTest = (type: TIPTestType): TIPDiagnosticReport => {
	return {
		type,
		questions: {},
		checked: true
	}
}

const Grading: React.FC<PropsType> = ({
	students,
	targeted_instruction,
	match,
	saveReport,
	setLearningLevel,
	resetStudentLearningLevel,
	resetStudentGrades,
	history
}) => {
	const { class_name, subject, section_id, std_id, test_id } = match.params
	const [group, setGroup] = useState<TIPLearningGroups>()
	const [modal_type, setModaltype] = useState('')
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)

	let test_type: TIPTestType = 'Diagnostic'

	const url = match.url.split('/')
	test_type = getTestType(url[2])

	const test = targeted_instruction.tests[test_id]
	const student = students[std_id]

	// Note here that we set the "result" variable as either coming from the existing student object or as a new, empty test
	// This is because if a student has already taken the test, we want to load what we've already entered for them.
	// But if this is their first time taking the test, we want to load a fresh object which we will save at the end.
	// Here, we are deriving state from props so that we can make changes to the object and render them, before saving.
	const existing_results = student?.targeted_instruction?.results
	const existing_test = existing_results && existing_results[test_id]

	const [result, setResult] = useState<TIPDiagnosticReport>(
		existing_test || GenerateEmptyTest(test_type)
	)

	// Here we remove all the $ signs from question text and replace with commas
	// TODO: This is preprocessing which should have been done in ingestion
	const questionsObj = Object.entries(test?.questions || {}).reduce<TIPTest['questions']>(
		(agg, [key, value]) => ({
			...agg,
			[key]: {
				...value,
				question_text: value.question_text.replace(/\$/g, ',')
			}
		}),
		{}
	)
	const markQuestion = (q_id: string, question: TIPQuestion, is_correct: boolean) => {
		setResult({
			...result,
			questions: {
				...result.questions,
				[q_id]: {
					...question,
					is_correct
				}
			}
		})
	}

	const onSave = () => {
		if (Object.values(result?.questions ?? {}).length == 0) {
			alert('Please mark questions')
			return
		}
		// calculate learning level
		const level =
			test_type === 'Oral'
				? calculateLearningLevelFromOralTest(result)
				: calculateLearningLevelFromDiagnosticTest(result)

		setGroup(convertLearningGradeToGroupName(level))

		if (
			Object.keys(result?.questions ?? {}).length === Object.keys(questionsObj ?? {}).length
		) {
			// if user has gradded all questions => a Modal will open to display assigned Group else it will display warning
			if (test_type === 'Diagnostic' || test_type === 'Oral') {
				const { is_oral: current_oral_value, history: current_history } = students?.[
					std_id
				]?.targeted_instruction?.learning_level?.[subject]
				const is_oral = level === 'Oral Test' ? true : current_oral_value ? true : false
				const history = {
					...current_history,
					[Date.now()]: {
						type: 'Graduation',
						grade: level
					}
				}
				setLearningLevel(std_id, subject, level, is_oral, history)
				setIsComponentVisible(true)
				setModaltype('assign_group_modal')
			} else {
				//if test type is not diagnostic and oral then it will not assign any group and rediect to student list
				redirect()
			}
			saveReport(std_id, result, test_id)
		} else {
			setIsComponentVisible(true)
			setModaltype('warning_modal')
		}
	}

	const onResetStudentGrades = () => {
		resetStudentLearningLevel(std_id, subject)
		resetStudentGrades(std_id, test_id)
		redirect()
	}

	const redirect = () => {
		history.push(
			test_type === 'Diagnostic'
				? `/${url[1]}/${url[2]}/${section_id}/${class_name}/${subject}/${test_id}/insert-grades`
				: test_type === 'Oral'
					? `/${url[1]}/${url[2]}/${subject}/${test_id}/insert-grades`
					: `/${url[1]}/${url[2]}/${class_name}/${subject}/${test_id}/insert-grades`
		)
	}

	return (
		<div className="flex flex-wrap content-between bg-white mt-20">
			{isComponentVisible && (
				<TModal>
					<div ref={ref} className="bg-white pb-3">
						{modal_type === 'assign_group_modal' && (
							<AssignedGroupModal group={group} redirect={redirect} />
						)}
						{modal_type === 'warning_modal' && (
							<>
								<div className="text-center p-3 md:p-4 lg:p-5 rounded-md text-sm md:text-base lg:text-xl font-bold">
									you have not finished grading student, Do you want to finish
									grading or go back to another page?
								</div>
								<div className="w-full flex justify-around items-center mt-3">
									<button
										className="w-5/12 p-2 md:p-2 lg:p-3 border-none bg-blue-tip-brand text-white rounded-lg outline-none font-bold text-sm md:text-base lg:text-xl"
										onClick={redirect}>
										Leave Page
									</button>
									<button
										className="w-5/12 p-2 md:p-2 lg:p-3 border-none bg-blue-tip-brand text-white rounded-lg outline-none font-bold text-sm md:text-base lg:text-xl"
										onClick={() => (
											setIsComponentVisible(false), setModaltype('')
										)}>
										Finish Grading
									</button>
								</div>
							</>
						)}
					</div>
				</TModal>
			)}
			<Card
				class_name={class_name ? class_name : 'Oral Test'}
				subject={subject}
				lesson_name=""
				lesson_no=""
			/>
			<div className="flex flex-col justify-between w-full mx-4">
				{Object.keys(questionsObj)
					.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
					.map(function (q_id, index) {
						const question = questionsObj[q_id]
						const is_correct = result.questions?.[q_id]?.is_correct

						return (
							<div
								key={q_id}
								className={`flex flex-row justify-between items-center border border-solid border-gray-200 px-3 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
									} h-20`}>
								<span className="text-xs font-bold">{`${q_id}: `}</span>
								<div className="flex flex-col w-full">
									<div className="text-xs px-2">{question.question_text}</div>
									<div className="text-xs px-2 font-bold text-left">
										Answer: {question.answer}
									</div>
								</div>
								<div className="rounded-xl w-32 h-6 bg-white border border-solid border-gray-100 flex justify-center items-center">
									<button
										className={
											is_correct !== undefined && !is_correct
												? 'border-none h-full rounded-xl text-xs outline-none text-white bg-danger-tip-brand'
												: 'border-none bg-white h-full rounded-xl text-xs outline-non'
										}
										onClick={() => markQuestion(q_id, question, false)}>
										Incorrect
									</button>
									<button
										className={
											is_correct
												? 'border-none h-full rounded-xl text-xs text-white bg-success-tip-brand outline-none'
												: 'border-none bg-white h-full rounded-xl text-xs outline-none'
										}
										onClick={() => markQuestion(q_id, question, true)}>
										Correct
									</button>
								</div>
							</div>
						)
					})}
			</div>
			<div className="w-full mt-5 flex justify-around">
				<button
					className="bg-blue-tip-brand font-bold text-sm md:text-base lg:text-lg border-none rounded-md text-white py-2 w-5/12 mb-4"
					onClick={onResetStudentGrades}>
					Reset Student Grades
				</button>
				<button
					className="bg-blue-tip-brand font-bold text-sm md:text-base lg:text-lg border-none rounded-md text-white py-2 w-5/12 mb-4"
					onClick={onSave}>
					Save and Continue
				</button>
			</div>
		</div>
	)
}

export default connect(
	(state: RootReducerState) => ({
		teacher_name: state.auth.name,
		students: state.db.students,
		targeted_instruction: state.targeted_instruction
	}),
	(dispatch: Function) => ({
		resetStudentGrades: (student_id: string, test_id: string) =>
			dispatch(resetStudentGrades(student_id, test_id)),
		resetStudentLearningLevel: (student_id: string, subject: TIPSubjects) =>
			dispatch(resetStudentLearningLevel(student_id, subject)),
		saveReport: (student_id: string, diagnostic_report: TIPDiagnosticReport, test_id: string) =>
			dispatch(mergeTIPResult(student_id, diagnostic_report, test_id)),
		setLearningLevel: (
			student_id: string,
			subject: TIPSubjects,
			level: TIPGrades,
			is_oral: boolean,
			history: TIPGradesHistory
		) => dispatch(assignLearningLevel(student_id, subject, level, is_oral, history))
	})
)(Grading)
