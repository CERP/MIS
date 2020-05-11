import React, { Component } from 'react'
import Former from 'utils/former'
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

class CreateExamModal extends Component<PropsType, S> {

	former: Former
	constructor(props: PropsType) {
		super(props)

		const date = moment().unix() * 1000

		this.state = {
			date,
			totalScore: "",
			subject: "",
			isExamCreated: false
		}

		this.former = new Former(this, [])
	}

	isDisabled = () => {
		const { subject, totalScore } = this.state
		return subject.length === 0 || isNaN(parseFloat(totalScore))
	}

	createExam = () => {

		const { subject, totalScore, date } = this.state
		// invoking method
		this.props.onCreate(subject, parseFloat(totalScore), date)

		// reseting state
		this.setState({
			totalScore: "",
			subject: "",
			isExamCreated: true
		})

		setTimeout(() => {
			this.setState({
				isExamCreated: false
			})
		}, 3000)

	}

	render() {

		const { onClose, subjects } = this.props
		const { date, isExamCreated } = this.state

		const disabled = this.isDisabled()

		return <div className="create-exam-container">
			<div className="close button red" onClick={onClose}>✕</div>
			<div className="title">Create New Exam</div>
			<div className="content-inner">
				<div className="section">
					<div className="form">
						{
							isExamCreated && <div className="text-center bold" style={{ color: "#5ecdb9" }}>New exam has been created successfully!</div>
						}
						<div className="row">
							<label>Exam Subject</label>
							<select {...this.former.super_handle(["subject"])}>
								<option value="">Select Subject</option>
								{
									subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)
								}
							</select>
						</div>
						<div className="row">
							<label>Total Marks</label>
							<input type="number" {...this.former.super_handle(["totalScore"])} placeholder="Enter total marks" />
						</div>
						<div className="row">
							<label>Exam Date</label>
							<input type="date" {...this.former.super_handle(["date"])} value={moment(date).format("YYYY-MM-DD")} placeholder="Enter total marks" />
						</div>
					</div>
					<div className="row" style={{ marginTop: 15, justifyContent: "flex-end" }}>
						<div className={`button blue ${disabled ? 'disabled' : ''}`} onClick={this.createExam}>Create Exam</div>
					</div>
				</div>
			</div>
		</div>
	}
}

export default CreateExamModal
