import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { calculateLearningLevelFromDiagnosticTest, calculateLearningLevelFromOralTest } from 'utils/TIP'
import Card from '../Card'
import { mergeTIPResult, assignLearningLevel } from 'actions'

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

	const { class_name, subject, std_id, section_id, test_id } = match.params

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

	console.log(test_id, targeted_instruction)
	console.log(test, student, existing_results, existing_test)

	const [result, setResult] = useState<TIPDiagnosticReport>(existing_test || GenerateEmptyTest(test_type))

	// Here we remove all the $ signs from question text and replace with commas
	// TODO: This is preprocessing which should have been done in ingestion
	const questionsObj = Object.entries(test.questions).reduce<TIPTest['questions']>((agg, [key, value]) => ({
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

		if (!result.questions || Object.values(result.questions).length == 0) {
			alert('Please mark questions')
			return;
		}
		// calculate learning level
		const level = url[2] === 'oral-test' ? calculateLearningLevelFromOralTest(result)
			: calculateLearningLevelFromDiagnosticTest(result)

		// assign level to student
		setLearningLevel(std_id, subject, level)
		saveReport(std_id, result, test_id)
		history.push(test_type === "Diagnostic" ?
			`/${url[1]}/${url[2]}/${section_id}/${class_name}/${subject}/${test_id}/insert-grades` :
			test_type === "Oral" ?
				`/${url[1]}/${url[2]}/${subject}/${test_id}/insert-grades` :
				`/${url[1]}/${url[2]}/${class_name}/${subject}/${test_id}/insert-grades`)
	}

	return <div className="flex flex-wrap content-between bg-white">
		<Card class_name={class_name ? class_name : 'Oral Test'} subject={subject} lesson_name='' lesson_no='' />
		<div className="flex flex-col justify-between w-full mx-4">
			{
				Object.keys(questionsObj)
					.sort((a, b) => a.localeCompare(b))
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
									"border-none h-full rounded-xl text-xs outline-none text-white bg-incorrect-red" :
									"border-none bg-white h-full rounded-xl text-xs outline-non"}
									onClick={() => markQuestion(q_id, question, false)}>Incorrect
								</button>
								<button className={is_correct ?
									"border-none h-full rounded-xl text-xs text-white bg-correct-green outline-none" :
									"border-none bg-white h-full rounded-xl text-xs outline-none"}
									onClick={() => markQuestion(q_id, question, true)}>Correct
								</button>
							</div>
						</div>
					})}
		</div>
		<div className="w-full mt-5 flex justify-center">
			<button
				className="bg-blue-primary h-11 font-bold text-base border-none rounded-md text-white p-2 w-9/12 mb-4"
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
