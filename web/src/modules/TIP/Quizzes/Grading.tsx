import React, { useMemo, useEffect, useState } from 'react'
import Card from '../Card'
import { connect } from 'react-redux'
import { getStudentsByGroup, convertLearningLevelToGrade } from 'utils/TIP'
import SingleStdGrading from './SingleStdGrading'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { saveTIPQuizResult, resetTIPQuizResult } from 'actions'
import './style.css'

interface P {
	students: RootDBState['students']

	saveTIPQuizResult: (result: QuizResult, quiz_id: string) => void
	resetTIPQuizResult: (result: QuizResult, quiz_id: string) => void
}

type PropsType = P & RouteComponentProps

type QuizResult = {
	[std_id: string]: number
}

const Grading: React.FC<PropsType> = ({
	match,
	history,
	students,
	saveTIPQuizResult,
	resetTIPQuizResult
}) => {
	const url = match.url.split('/')
	const [std_result, setStdResult] = useState<QuizResult>({})
	const { subject, class_name, quiz_id } = match.params as Params
	const group = convertLearningLevelToGrade(class_name ? (class_name as TIPLevels) : 'Oral')

	const filtered_students = useMemo(() => getStudentsByGroup(students, group, subject), [subject])

	useEffect(() => {
		if (filtered_students.length === 0) {
			return
		}
		const reports: QuizResult = filtered_students.reduce((agg, student) => {
			const obtain_marks = student.targeted_instruction?.quiz_result?.[quiz_id]?.obtain_marks
			return {
				...agg,
				[student.id]: obtain_marks ? obtain_marks : 0
			}
		}, {})
		setStdResult(reports)
	}, [filtered_students])

	const handleChange = (std_id: string, marks: number) => {
		setStdResult({ ...std_result, [std_id]: marks })
	}

	const onSave = () => {
		saveTIPQuizResult(std_result, quiz_id)
		history.push(`/${url[1]}/${url[2]}/${class_name}/${subject}/${quiz_id}/result`)
	}

	const onReset = () => {
		resetTIPQuizResult(std_result, quiz_id)
	}

	return (
		<div className="flex flex-wrap content-between mt-20">
			<Card class_name={class_name} subject={subject} lesson_name="" lesson_no="" />
			<div className="p-4 w-full">
				<div className="bg-blue-tip-brand flex flex-row justify-around text-sm md:text-base lg:text-lg text-white rounded py-2 font-bold">
					<div>Students</div>
					<div>Marks Obtained</div>
				</div>
				{Object.values(filtered_students).map(std => (
					<SingleStdGrading
						key={std.id}
						student={std}
						obtain_marks={std_result[std.id]}
						handleChange={handleChange}
					/>
				))}
			</div>
			<div className="w-full fixed bottom-0 flex flex-row justify-between">
				<button
					className="w-11/13 bg-blue-tip-brand text-white border-none p-3 font-bold text-sm md:text-base lg:text-lg"
					onClick={onReset}>
					Reset
				</button>
				<button
					className="w-11/13 bg-blue-tip-brand text-white border-none p-3 font-bold text-sm md:text-base lg:text-lg"
					onClick={onSave}>
					Save and Continue
				</button>
			</div>
		</div>
	)
}

export default connect(
	(state: RootReducerState) => ({
		students: state.db.students
	}),
	(dispatch: Function) => ({
		saveTIPQuizResult: (quiz_result: QuizResult, quiz_id: string) =>
			dispatch(saveTIPQuizResult(quiz_result, quiz_id)),
		resetTIPQuizResult: (quiz_result: QuizResult, quiz_id: string) =>
			dispatch(resetTIPQuizResult(quiz_result, quiz_id))
	})
)(withRouter(Grading))
