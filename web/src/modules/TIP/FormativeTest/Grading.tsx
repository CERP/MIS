import React, { useState } from 'react';
import clsx from 'clsx'
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { calculateLearningLevelFromDiagnosticTest, calculateLearningLevelFromOralTest } from 'utils/TIP'
import { mergeTIPResult, assignLearningLevel } from 'actions'
import { convertLearningGradeToGroupName } from 'utils/TIP'
import { useComponentVisible } from 'utils/customHooks';
import { TModal } from '../Modal'
import Card from '../Card'

interface P {
	teacher_name: string
	students: RootDBState["students"]
	targeted_instruction: RootReducerState['targeted_instruction']

	setLearningLevel: (student_id: string, subject: string, level: TIPGrades) => void
	saveReport: (student_id: string, diagnostic_report: TIPDiagnosticReport, test_id: string) => void
}

interface RouteParams {
	class_name: string
	subject: string
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

const Grading: React.FC<PropsType> = ({ students, targeted_instruction, match, saveReport, setLearningLevel, history }) => {

	const { class_name, subject, section_id, std_id, test_id } = match.params
	const [group, setGroup] = useState<TIPLearningGroups>()
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)

	let test_type: TIPTestType = "Diagnostic"

	const url = match.url.split('/')
	switch (url[2]) {
		case "oral-test":
			test_type = "Oral"
			break;
		case "formative-test":
			test_type = "Formative"
			break;
		case "summative-test":
			test_type = "Summative"
			break;
		default:
			test_type = "Diagnostic"
	}

	const test = targeted_instruction.tests[test_id]
	const student = students[std_id]

	// Note here that we set the "result" variable as either coming from the existing student object or as a new, empty test
	// This is because if a student has already taken the test, we want to load what we've already entered for them.
	// But if this is their first time taking the test, we want to load a fresh object which we will save at the end.
	// Here, we are deriving state from props so that we can make changes to the object and render them, before saving.
	const existing_results = student?.targeted_instruction?.results
	const existing_test = existing_results && existing_results[test_id]

	const [result, setResult] = useState<TIPDiagnosticReport>(existing_test || GenerateEmptyTest(test_type))

	// Here we remove all the $ signs from question text and replace with commas
	// TODO: This is preprocessing which should have been done in ingestion
	const questionsObj = Object.entries(test?.questions || {}).reduce<TIPTest['questions']>((agg, [key, value]) => ({
		...agg,
		[key]: {
			...value,
			question_text: value.question_text.replace(/\$/g, ',')
		}
	}), {})
	console.log(questionsObj)
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

		let complete = false
		if (!result.questions || Object.values(result.questions).length == 0) {
			alert('Please mark questions')
			return;
		}
		// calculate learning level
		const level = url[2] === 'oral-test' ? calculateLearningLevelFromOralTest(result)
			: calculateLearningLevelFromDiagnosticTest(result)

		setGroup(convertLearningGradeToGroupName(level))

		if (Object.keys(result.questions).length === Object.keys(questionsObj).length) {
			complete = true
		}

		//display modal => to see assigned group
		setIsComponentVisible(true)

		// assign level to student
		complete && setLearningLevel(std_id, subject, level)
		complete && saveReport(std_id, result, test_id)

	}

	const redirect = () => {
		history.push(test_type === "Diagnostic" ?
			`/${url[1]}/${url[2]}/${section_id}/${class_name}/${subject}/${test_id}/insert-grades` :
			test_type === "Oral" ?
				`/${url[1]}/${url[2]}/${subject}/${test_id}/insert-grades` :
				`/${url[1]}/${url[2]}/${class_name}/${subject}/${test_id}/insert-grades`)
	}

	return <div className="flex flex-wrap content-between bg-white">
		{isComponentVisible && (
			<TModal>
				<div ref={ref} className="h-32 bg-white">
					<div className={clsx("text-center p-3 rounded-md text-white text-lg dont-bold", {
						"bg-gray-400": group === 'Oral',
						"bg-gray-600": group === 'Remediation Not Needed'
					}, `bg-${group.toLowerCase()}-tip-brand`)}>
						{group} Group
						</div>
					<div className="w-full flex justify-center items-center mt-6">
						<button className="w-6/12 p-3 border-none bg-green-tip-brand text-white rounded-lg outline-none" onClick={redirect}>OK</button>
					</div>
				</div>
			</TModal>
		)}
		<Card class_name={class_name ? class_name : 'Oral Test'} subject={subject} lesson_name='' lesson_no='' />
		<div className="flex flex-col justify-between w-full mx-4">
			{
				Object.keys(questionsObj)
					.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
					.map(function (q_id, index) {
						const question = questionsObj[q_id]
						const is_correct = result.questions[q_id]?.is_correct

						return <div key={q_id} className={`flex flex-row justify-between items-center border border-solid border-gray-200 px-3 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"} h-20`}>
							<span className="text-xs font-bold">{`${q_id}: `}</span>
							<div className="flex flex-col w-full">
								<div className="text-xs px-2">{question.question_text}</div>
								<div className="text-xs px-2 font-bold text-left">Answer: {question.answer}</div>
							</div>
							<div className="rounded-xl w-32 h-6 bg-white border border-solid border-gray-100 flex justify-center items-center">
								<button className={is_correct !== undefined && !is_correct ?
									"border-none h-full rounded-xl text-xs outline-none text-white bg-danger-tip-brand" :
									"border-none bg-white h-full rounded-xl text-xs outline-non"}
									onClick={() => markQuestion(q_id, question, false)}>Incorrect
								</button>
								<button className={is_correct ?
									"border-none h-full rounded-xl text-xs text-white bg-success-tip-brand outline-none" :
									"border-none bg-white h-full rounded-xl text-xs outline-none"}
									onClick={() => markQuestion(q_id, question, true)}>Correct
								</button>
							</div>
						</div>
					})}
		</div>
		<div className="w-full mt-5 flex justify-center">
			<button
				className="bg-blue-tip-brand h-11 font-bold text-base border-none rounded-md text-white p-2 w-9/12 mb-4"
				onClick={onSave}>Save and Continue</button>
		</div>
	</div>
}

export default connect((state: RootReducerState) => ({
	teacher_name: state.auth.name,
	students: state.db.students,
	targeted_instruction: state.targeted_instruction
}), (dispatch: Function) => ({
	saveReport: (student_id: string, diagnostic_report: TIPDiagnosticReport, test_id: string) => dispatch(mergeTIPResult(student_id, diagnostic_report, test_id)),
	setLearningLevel: (student_id: string, subject: string, level: TIPGrades) => dispatch(assignLearningLevel(student_id, subject, level))
}))(withRouter(Grading))
