import React, { Component } from 'react'
import { v4 } from 'node-uuid'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import moment from 'moment'

import checkCompulsoryFields from 'utils/checkCompulsoryFields'

import { mergeExam, removeStudentFromExam, deleteExam } from 'actions'
import Banner from 'components/Banner'
import Layout from 'components/Layout'
import Former from 'utils/former'
import Dropdown from 'components/Dropdown'
import calculateGrade from 'utils/calculateGrade'
import { AppLayout } from 'components/Layout/appLayout'

import './style.css'

const blankExam = () => ({
	id: v4(),
	name: '',
	subject: '',
	total_score: '',
	date: new Date().getTime(),
	student_marks: {}
})

class SingleExam extends Component {
	constructor(props) {
		super(props)

		const student_marks = Object.entries(this.props.students)
			.filter(([id, student]) => student.section_id === this.section_id())
			.reduce(
				(agg, [id, student]) => ({ ...agg, [id]: { score: '', grade: '', remarks: '' } }),
				{}
			)

		this.state = {
			exam:
				this.exam_id() === undefined
					? {
						...blankExam(),
						student_marks
					}
					: {
						...this.props.exams[this.exam_id()],
						student_marks: this.getGradesForExistingExam(this.exam_id())
					},
			sendSMS: false,
			redirect: false,
			banner: {
				active: false,
				good: true,
				text: 'Saved!'
			}
		}

		this.former = new Former(this, ['exam'])
	}

	// what if someone is added to the section after we have saved the exam...
	// we probably need an option to add an arbitrary student to an exam
	getGradesForExistingExam = exam_id => {
		return Object.entries(this.props.students)
			.filter(([id, student]) => student.exams && student.exams[exam_id])
			.reduce((agg, [id, student]) => {
				if (student.exams === undefined) {
					return agg
				}

				const exam = student.exams[exam_id]
				return {
					...agg,
					[id]: exam || { score: '', grade: '', remarks: '' }
				}
			}, {})
	}

	isNew = () => this.props.location.pathname.indexOf('new') >= 0
	exam_id = () => this.props.match.params.exam_id
	section_id = () => this.props.match.params.section_id
	class_id = () => this.props.match.params.class_id

	onSave = () => {
		const compulsoryFields = checkCompulsoryFields(this.state.exam, [
			['name'],
			['subject'],
			['total_score']
		])

		if (compulsoryFields) {
			const errorText = 'Please Fill ' + compulsoryFields + ' !!!'

			return this.setState({
				banner: {
					active: true,
					good: false,
					text: errorText
				}
			})
		}

		/*
		const hasScoreAboveLimit = Object.values(this.state.exam.student_marks)
			.some(mark => parseFloat(mark) > parseFloat(this.state.exam.total_score))

		if(hasScoreAboveLimit)
		{
			return this.setState({
				banner:{
					active: true,
					good: false,
					text: "Marks cannot exceed the max score"
				}
			})
		}
		*/

		// Just make sure, when exam gets saved, convert total score to number instead of string
		// Reported by: Pakistangrammerschool
		this.props.saveExam(
			{
				...this.state.exam,
				total_score: parseFloat(this.state.exam.total_score || '0')
			},
			this.class_id(),
			this.section_id()
		)

		this.setState({
			banner: {
				active: true,
				good: true,
				text: 'Saved!'
			}
		})

		this.banner_timeout = setTimeout(() => {
			this.setState({
				redirect: this.exam_id() === undefined,
				banner: {
					active: false
				}
			})
		}, 3000)

		// send sms
		/*
		if(this.state.sendSMS) {
			// send SMS with replace text for regex etc.
			console.log("SENDING MESSAGE", this.state.payment.sendSMS)
			const message = this.props.feeSMStemplate
					.replace(/\$BALANCE/g, balance)
					.replace(/\$AMOUNT/g, payment.amount)
					.replace(/\$NAME/g, this.student().Name)

			
			if(this.props.settings.sendSMSOption !== "SIM") {
				alert("can only send messages from local SIM");
			}
			else {
				const url = smsIntentLink({ messages: [{ text: message, number: this.student().Phone }], return_link: window.location.href })

				//this.props.history.push(url);
				window.location.href = url;
			}
		*/
	}

	onDelete = exam_id => {
		const val = window.confirm('Are you sure you want to delete?')
		if (!val) return

		const students = Object.values(this.props.students)
			.filter(s => s.exams && s.exams[exam_id])
			.map(s => s.id)

		this.props.deleteExam(students, exam_id)

		this.setState({
			banner: {
				active: true,
				good: false,
				text: 'Exam Deleted'
			}
		})

		this.banner_timeout = setTimeout(() => {
			this.setState({
				redirect: true,
				banner: {
					active: false
				}
			})
		}, 3000)
	}

	// TODO: get students marks again when this rerenders, if the new studentMarks are different from the old ones.

	componentWillUnmount() {
		clearTimeout(this.banner_timeout)
	}

	componentWillReceiveProps(nextProps) { }

	addStudent = student => {
		this.setState({
			exam: {
				...this.state.exam,
				student_marks: {
					...this.state.exam.student_marks,
					[student.id]: { score: '', grade: '', remarks: '' }
				}
			}
		})
	}
	removeStudent = student => {
		const val = window.confirm('Are you sure you want to delete?')

		if (!val) return

		const { [student.id]: removed, ...rest } = this.state.exam.student_marks
		this.setState({
			exam: {
				...this.state.exam,
				student_marks: rest
			}
		})

		this.props.removeStudent(this.state.exam.id, student.id) //To remove exam from student
	}

	setGrade = student => {
		const marks_obtained = this.state.exam.student_marks[student.id].score
		const total_marks = parseFloat(this.state.exam.total_score) || 0

		const grade = calculateGrade(marks_obtained, total_marks, this.props.grades)

		const remarks = grade && this.props.grades[grade] ? this.props.grades[grade].remarks : ''

		this.setState({
			exam: {
				...this.state.exam,
				student_marks: {
					...this.state.exam.student_marks,
					[student.id]: {
						...this.state.exam.student_marks[student.id],
						grade: marks_obtained ? grade : '',
						remarks: marks_obtained ? remarks : ''
					}
				}
			}
		})
	}

	render() {
		const students = Object.values(this.props.students).filter(
			student => student && student.Name && student.section_id === this.section_id()
		)

		const exam_title = this.state.exam.name
		const year = moment(this.state.exam.date).format('YYYY')

		if (this.state.redirect) {
			return (
				<Redirect
					to={`/reports?section_id=${this.section_id()}&exam_title=${exam_title}&year=${year}`}
				/>
			)
		}
		return (
			<AppLayout title="Exam" showHeaderTitle>
				<div className="single-exam p-5 md:p-10 md:pt-5">
					{this.state.banner.active ? (
						<Banner isGood={this.state.banner.good} text={this.state.banner.text} />
					) : (
						false
					)}

					<div className="form">
						<div className="row">
							<label>Exam Name</label>
							<select className="tw-select" {...this.former.super_handle(['name'])}>
								<option value="">Select Exam</option>
								<option value="Test">Test</option>
								<option value="1st Term">1st Term</option>
								<option value="2nd Term">2nd Term</option>
								<option value="Mid-Term">Mid-Term</option>
								<option value="Final-Term">Final-Term</option>
							</select>
						</div>

						<div className="row">
							<label>Subject</label>
							<select
								className="tw-select"
								{...this.former.super_handle(['subject'])}>
								<option value="" disabled>
									Please Select a Subject
								</option>
								{Object.keys(this.props.classes[this.class_id()].subjects).map(
									s => (
										<option value={s} key={s}>
											{s}
										</option>
									)
								)}
							</select>
						</div>

						<div className="row">
							<label>Total Score</label>
							<input
								className="tw-input"
								type="number"
								{...this.former.super_handle(['total_score'])}
								placeholder="Maximum Score"
							/>
						</div>

						<div className="row">
							<label>Date of Test</label>
							<input
								className="tw-input"
								type="date"
								onChange={this.former.handle(['date'])}
								value={moment(this.state.exam.date).format('YYYY-MM-DD')}
								placeholder="Exam Date"
							/>
						</div>

						{/*
						<div className="row">
							<label>SMS Notification</label>
							<select {...this.former.super_handle(["sendSMS"])}>
								<option value={false}>No SMS Notification</option>
								<option value={true}>Send Marks to Students with Local SIM</option>
							</select>
						</div>
						*/}

						<div className="divider">Marks</div>
						<div>
							{
								// Object.entries(this.props.students)
								// 	.filter(([id, student]) => student.section_id === this.section_id())
								Object.keys(this.state.exam.student_marks || {})
									.map(xid => this.props.students[xid])
									.filter(s => s !== undefined && s.id !== undefined)
									.sort((a, b) =>
										a.RollNumber !== undefined && b.RollNumber !== undefined
											? parseFloat(a.RollNumber) - parseFloat(b.RollNumber)
											: -1
									)
									.map(student => (
										<div className="section" key={student.id}>
											<div className="remove row">
												<label>
													{student.RollNumber ? student.RollNumber : ''}{' '}
													<Link to={`/students/${student.id}/profile`}>
														{student.Name}
													</Link>
												</label>
												<div
													className="button red"
													onClick={() => this.removeStudent(student)}>
													x
												</div>
											</div>

											<div className="marks row space-x-2">
												<input
													type="number"
													className="tw-input"
													{...this.former.super_handle(
														['student_marks', student.id, 'score'],
														() => true,
														() => this.setGrade(student)
													)}
													placeholder="Score"
												/>
												<select
													className="tw-select"
													{...this.former.super_handle([
														'student_marks',
														student.id,
														'grade'
													])}>
													<option value="">Select Grade</option>
													{Object.entries(this.props.grades).map(
														([grade, percent]) => {
															return (
																<option key={grade} value={grade}>
																	{grade}
																</option>
															)
														}
													)}
												</select>

												<select
													className="tw-select"
													{...this.former.super_handle([
														'student_marks',
														student.id,
														'remarks'
													])}
													style={{ width: 'inherit' }}>
													<option value="">Remarks</option>
													{Object.entries(this.props.grades).map(
														([grade, { percent, remarks }]) => {
															return (
																<option key={grade} value={remarks}>
																	{remarks}
																</option>
															)
														}
													)}
													<option value="Absent"> Absent</option>
												</select>
											</div>
										</div>
									))
							}
							<div className="students">
								<div className="row">
									<Dropdown
										className="tw-input"
										items={students}
										toLabel={s => s.Name}
										onSelect={s => this.addStudent(s)}
										toKey={s => s.id}
										placeholder="Student Name"
									/>
								</div>
							</div>
						</div>
						<div className="save-delete">
							{!this.isNew() ? (
								<div
									className="button red"
									onClick={() => this.onDelete(this.exam_id())}>
									Delete
								</div>
							) : (
								false
							)}
							<div className="button save" onClick={this.onSave}>
								Save
							</div>
						</div>
					</div>
				</div>
			</AppLayout>
		)
	}
}

export default connect(
	state => ({
		classes: state.db.classes,
		exams: state.db.exams || {},
		students: state.db.students,
		grades: state.db.settings.exams.grades
	}),
	dispatch => ({
		saveExam: (exam, class_id, section_id) => dispatch(mergeExam(exam, class_id, section_id)),
		removeStudent: (exam_id, student_id) =>
			dispatch(removeStudentFromExam(exam_id, student_id)),
		deleteExam: (students, exam_id) => dispatch(deleteExam(students, exam_id))
	})
)(SingleExam)
