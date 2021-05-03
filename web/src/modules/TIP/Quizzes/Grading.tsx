import React, { useMemo, useEffect, useState } from 'react'
import Card from '../Card'
import { connect } from 'react-redux'
import Headings from '../Headings'
import { getStudentsByGroup, convertLearningLevelToGrade } from 'utils/TIP'
import SingleStdGrading from './SingleStdGrading'
import { RouteComponentProps } from 'react-router-dom'
import { saveTIPQuizResult, resetTIPQuizResult, quizTaken } from 'actions'
import './style.css'

interface P {
	students: RootDBState['students']
	faculty_id: RootReducerState['auth']['faculty_id']
	targeted_instruction: RootReducerState['targeted_instruction']

	saveTIPQuizResult: (
		result: QuizResult,
		quiz_id: string,
		total_marks: number,
		class_name: TIPLevels,
		subject: TIPSubjects
	) => void
	resetTIPQuizResult: (
		result: QuizResult,
		quiz_id: string,
		class_name: TIPLevels,
		subject: TIPSubjects
	) => void
	quizTaken: (faculty_id: string, quiz_id: string, value: boolean) => void
}

type PropsType = P & RouteComponentProps

type QuizResult = {
	[std_id: string]: number
}

const Grading: React.FC<PropsType> = ({
	match,
	history,
	students,
	faculty_id,
	targeted_instruction,
	saveTIPQuizResult,
	resetTIPQuizResult,
	quizTaken
}) => {
	const url = match.url.split('/')
	const [std_result, setStdResult] = useState<QuizResult>({})
	const { subject, class_name, quiz_id } = match.params as Params
	const group = convertLearningLevelToGrade(class_name ? (class_name as TIPLevels) : 'Oral')

	const filtered_students = useMemo(() => getStudentsByGroup(students, group, subject), [subject])
	const total_marks = targeted_instruction?.quizzes?.[class_name]?.[subject][quiz_id].total_marks
	const { slo, quiz_title } = targeted_instruction?.quizzes?.[class_name]?.[subject]?.[quiz_id]

	useEffect(() => {
		if (filtered_students.length === 0) {
			return
		}
		const reports: QuizResult = filtered_students.reduce((agg, student) => {
			const obtained_marks =
				student.targeted_instruction?.quiz_result?.[class_name]?.[subject]?.[quiz_id]
					?.obtained_marks ?? 0
			return {
				...agg,
				[student.id]: obtained_marks
			}
		}, {})
		setStdResult(reports)
	}, [filtered_students])

	const handleChange = (std_id: string, marks: number) => {
		setStdResult({ ...std_result, [std_id]: marks })
	}

	const onSave = () => {
		saveTIPQuizResult(std_result, quiz_id, total_marks, class_name, subject)
		quizTaken(faculty_id, quiz_id, true)
		history.push(`/${url[1]}/${url[2]}/${class_name}/${subject}/${quiz_id}/result`)
	}

	const onReset = () => {
		const reports: QuizResult = filtered_students.reduce((agg, student) => {
			return {
				...agg,
				[student.id]: 0 // reseting obtained marks to zero
			}
		}, {})
		setStdResult(reports)
		resetTIPQuizResult(std_result, quiz_id, class_name, subject)
	}

	return (
		<div className="flex flex-wrap content-between mt-20">
			<Card class_name={class_name} subject={subject} />

			<div className="w-full">
				<Headings heading={quiz_title} />
			</div>

			<div className="p-4 w-full">
				<div className="bg-blue-tip-brand flex flex-row justify-around text-sm md:text-base lg:text-lg text-white rounded py-2 pl-4 font-bold">
					<div>Students</div>
					<div>Marks Obtained</div>
				</div>
				<div className="mb-10">
					{Object.values(filtered_students ?? {}).map(std => (
						<SingleStdGrading
							key={std.id}
							student={std}
							obtained_marks={std_result[std.id]}
							total_marks={total_marks}
							handleChange={handleChange}
						/>
					))}
				</div>
			</div>
			<div className="w-full fixed bottom-0 flex flex-row justify-between space-x-2">
				<button
					className="w-1/2 bg-blue-tip-brand text-white border-none p-3 font-bold text-sm md:text-base lg:text-lg"
					onClick={onReset}>
					Reset
				</button>
				<button
					className="w-1/2 bg-blue-tip-brand text-white border-none p-3 font-bold text-sm md:text-base lg:text-lg"
					onClick={onSave}>
					Save and Continue
				</button>
			</div>
		</div>
	)
}

export default connect(
	(state: RootReducerState) => ({
		students: state.db.students,
		faculty_id: state.auth.faculty_id,
		targeted_instruction: state.targeted_instruction
	}),
	(dispatch: Function) => ({
		saveTIPQuizResult: (
			quiz_result: QuizResult,
			quiz_id: string,
			obtained_marks: number,
			class_name: TIPLevels,
			subject: TIPSubjects
		) => dispatch(saveTIPQuizResult(quiz_result, quiz_id, obtained_marks, class_name, subject)),
		resetTIPQuizResult: (
			quiz_result: QuizResult,
			quiz_id: string,
			class_name: TIPLevels,
			subject: TIPSubjects
		) => dispatch(resetTIPQuizResult(quiz_result, quiz_id, class_name, subject)),
		quizTaken: (faculty_id: string, quiz_id: string, value: boolean) =>
			dispatch(quizTaken(faculty_id, quiz_id, value))
	})
)(Grading)
