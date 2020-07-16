import React, { useState } from 'react'
import moment from 'moment'

interface PropsType {
	onCreate: (subject: string, total_score: number, date: number) => void
	onClose: () => void
	subjects: string[]
}

type S = {
	date: number
	totalScore: string
	subject: string
	isExamCreated: boolean
}

const CreateExamModal: React.FC<PropsType> = ({ onCreate, onClose, subjects }) => {

	const current_date = moment().unix() * 1000

	const [stateProps, setStateProps] = useState<S>({
		date: current_date,
		totalScore: "",
		subject: "",
		isExamCreated: false
	})

	const isDisabled = () => {
		const { subject, totalScore } = stateProps
		return subject.length === 0 || isNaN(parseFloat(totalScore))
	}

	const createExam = () => {

		const { subject, totalScore, date } = stateProps
		// invoking method
		onCreate(subject, parseFloat(totalScore), date)

		// reseting state
		setStateProps({
			...stateProps,
			isExamCreated: true
		})

		setTimeout(() => {
			setStateProps({
				date,
				totalScore: "",
				subject: "",
				isExamCreated: false
			})
		}, 3000)

	}

	return <div className="bulk-exams modal-container inner">
		<div className="close button red" onClick={onClose}>✕</div>
		<div className="title">Create New Exam</div>
		<div className="section-container section">
			<div className="form">
				{
					stateProps.isExamCreated && <div className="text-center bold" style={{ color: "#5ecdb9" }}>New exam has been created successfully!</div>
				}
				<div className="row">
					<label>Exam Subject</label>
					<select onChange={(e) => setStateProps({ ...stateProps, subject: e.target.value })} value={stateProps.subject}>
						<option value="">Select Subject</option>
						{
							subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)
						}
					</select>
				</div>
				<div className="row">
					<label>Total Marks</label>
					<input type="number"
						value={stateProps.totalScore}
						onChange={(e) => setStateProps({ ...stateProps, totalScore: e.target.value })}
						placeholder="Enter total marks" />
				</div>
				<div className="row">
					<label>Exam Date</label>
					<input type="date"
						onChange={(e) => setStateProps({ ...stateProps, date: moment(e.target.value, "YYYY-MM-DD").unix() * 1000 })}
						value={moment(current_date).format("YYYY-MM-DD")} placeholder="Enter total marks" />
				</div>
			</div>
			<div className="row" style={{ marginTop: 15, justifyContent: "flex-end" }}>
				<div className={`button blue ${isDisabled() ? 'disabled' : ''}`} onClick={createExam}>Create Exam</div>
			</div>
		</div>
	</div>
}

export default CreateExamModal
