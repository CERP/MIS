import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import { v4 } from 'node-uuid'
import moment from 'moment'

import Former from 'utils/former'
import { mergeExam, updateBulkExams, deleteExam } from 'actions/index'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import calculateGrade from 'utils/calculateGrade'
import toTitleCase from 'utils/toTitleCase'
import { hideScroll, showScroll } from 'utils/helpers'
import toast from 'react-hot-toast'

import { AppLayout } from 'components/Layout/appLayout'
import Modal from 'components/Modal'
import CreateExamModal from './createExamModal'

import months from 'constants/months'
import { ExamTitles } from 'constants/exam'
import { EditIcon, DeleteIcon } from 'assets/icons'

import { ClassResultSheet } from 'components/Printable/ResultCard/classResultSheet'
import chunkify from 'utils/chunkify'
import getStudentExamMarksSheet from 'utils/studentExamMarksSheet'

import './style.css'

type P = {
	grades: RootDBState['settings']['exams']['grades']
	schoolName: string
	createSingleExam: (exam: CreateExam, class_id: string, section_id: string) => void
	updateBulkExams: (marks_sheet: ExamScoreSheet) => void
	deleteExam: (students_ids: string[], exam_id: string) => void
} & RouteComponentProps &
	RootDBState

interface S {
	selectedSection: string
	sections: AugmentedSection[]
	showCreateExam: boolean
	scoreSheet: ExamScoreSheet
	banner: MISBanner
	examFilter: ExamFilter
}

interface CreateExam extends MISExam {
	student_marks: {
		[id: string]: MISStudentExam
	}
}

function blankExam() {
	return {
		id: v4(),
		name: '',
		subject: '',
		total_score: '',
		date: new Date().getTime(),
		student_marks: {}
	}
}

class BulkExam extends Component<P, S> {
	former: Former
	constructor(props: P) {
		super(props)

		const students = this.props.students
		const exams = this.props.exams
		const classes = this.props.classes

		const sections = getSectionsFromClasses(classes).sort(
			(a, b) => (a.classYear || 0) - (b.classYear || 0)
		)

		const pq = queryString.parse(this.props.location.search)

		const section_id = pq.section_id ? pq.section_id.toString() : ''

		const examFilter = this.examFilter()

		const scoreSheet = this.createScoreSheet(students, exams, section_id, examFilter)

		this.state = {
			selectedSection: section_id,
			examFilter,
			sections,
			scoreSheet,
			showCreateExam: false,
			banner: {
				active: false,
				good: true,
				text: ''
			}
		}

		this.former = new Former(this, [])
	}

	examFilter = (): ExamFilter => {
		const pq = queryString.parse(this.props.location.search)

		const exam_title = pq.exam_title ? pq.exam_title.toString() : ''
		const year = pq.year ? pq.year.toString() : moment().format('YYYY')
		const month = pq.month ? pq.month.toString() : ''

		return {
			exam_title,
			year,
			month
		}
	}

	componentDidUpdate(prevProps: P) {
		if (JSON.stringify(prevProps.exams) !== JSON.stringify(this.props.exams)) {
			const { students, exams } = this.props
			const { selectedSection, examFilter } = this.state

			const score_sheet = this.createScoreSheet(students, exams, selectedSection, examFilter)

			this.setState({
				scoreSheet: score_sheet
			})
		}
	}

	getClassIdFromSections = (): string => {
		const { selectedSection, sections } = this.state
		const section = sections.find(section => section.id === selectedSection)

		return section ? section.class_id : undefined
	}

	getSubjects = (): string[] => {
		const { classes } = this.props

		const class_id = this.getClassIdFromSections()
		const subjects = classes[class_id] ? classes[class_id].subjects : {}

		return Object.keys(subjects)
	}

	closeCreateExamModal = () => {
		this.setState({ showCreateExam: false }, () => {
			showScroll()
		})
	}

	toggleCreateExamModal = () => {
		const { selectedSection, examFilter } = this.state

		// section id and exam title are compulsory to create new exam
		if (selectedSection === '' || examFilter.exam_title === '') {
			alert('Please select class and exam title to create new exam')
			return
		}

		this.setState({ showCreateExam: !this.state.showCreateExam }, () => {
			if (this.state.showCreateExam) {
				hideScroll()
			}
		})
	}

	getExamFilterConditions = (
		exam: MISExam,
		section_id: string,
		examFilter: ExamFilter
	): boolean => {
		const { exam_title, year, month } = examFilter

		const is_exam = exam.name === exam_title
		const is_year = moment(exam.date).format('YYYY') === year
		const is_section = exam.section_id === section_id

		const is_month =
			exam_title === 'Test' && month ? moment(exam.date).format('MMMM') === month : true

		return is_exam && is_year && is_section && is_month
	}

	// creating empty exam for each student
	onCreateExam = (subject: string, total_score: number, date: number): void => {
		const { students } = this.props
		const { selectedSection, examFilter } = this.state

		const class_id = this.getClassIdFromSections()

		const student_marks = Object.entries(students)
			.filter(
				([_, student]) =>
					student &&
					student.Active &&
					!student.prospective_section_id &&
					student.Name &&
					student.section_id === selectedSection
			)
			.reduce((agg, [id, _]) => ({ ...agg, [id]: { score: '', grade: '', remarks: '' } }), {})

		const prepare_exam: CreateExam = {
			...blankExam(),
			name: examFilter.exam_title,
			class_id,
			section_id: selectedSection,
			subject,
			total_score,
			date,
			student_marks
		}

		// this action should be simplify because exam object has class_id and section_id
		this.props.createSingleExam(prepare_exam, class_id, selectedSection)
	}

	getFilteredExams = (
		exams: RootDBState['exams'],
		section_id: string,
		examFilter: ExamFilter
	): MISExam[] => {
		return Object.values(exams).filter(exam =>
			this.getExamFilterConditions(exam, section_id, examFilter)
		)
	}

	createScoreSheet = (
		students: RootDBState['students'],
		exams: RootDBState['exams'],
		section_id: string,
		examFilter: ExamFilter
	): ExamScoreSheet => {
		const merge_students_exams = this.getMergeStudentsExams(
			students,
			exams,
			section_id,
			examFilter
		)

		const scoreSheet = merge_students_exams.reduce<ExamScoreSheet>(
			(aggStudents, currStudent) => {
				const exams = currStudent.merge_exams

				// inner reduce for student exams
				const student_exams = exams.reduce((aggExams, currExam) => {
					return {
						...aggExams,
						[currExam.id]: {
							...currExam,
							edited: false
						}
					}
				}, {})

				// outer reduce return
				return {
					...aggStudents,
					[currStudent.id]: {
						...currStudent,
						scoreSheetExams: student_exams
					}
				}
			},
			{}
		)

		return scoreSheet
	}

	getMergeStudentsExams = (
		students: RootDBState['students'],
		exams: RootDBState['exams'],
		section_id: string,
		examFilter: ExamFilter
	): MergeStudentsExams[] => {
		const filtered_exams = this.getFilteredExams(exams, section_id, examFilter)

		const merge_student_exams = Object.values(students)
			.filter(
				student =>
					student && student.Name && student.section_id && student.exams && student.Active
			)
			.reduce<MergeStudentsExams[]>((agg, curr) => {
				const merge_exams: AugmentedMISExam[] = []

				for (const exam of filtered_exams) {
					const stats = curr.exams[exam.id]

					if (stats != null) {
						merge_exams.push({ ...exam, stats })
					}
				}

				// in case there is no exams for the curr student, no need to put into list
				if (merge_exams.length === 0) return agg

				return [...agg, { ...curr, merge_exams }]
			}, [])

		return merge_student_exams
	}

	setScoreSheet = (students: RootDBState['students'], exams: RootDBState['exams']): void => {
		const { examFilter, selectedSection } = this.state

		// set query params on each filter change
		this.setQueryParams(selectedSection, examFilter)

		// do nothing if all filters not selected
		if (selectedSection === '' || examFilter.exam_title === '' || examFilter.year === '') {
			return
		}

		const scoreSheet = this.createScoreSheet(students, exams, selectedSection, examFilter)

		this.setState({ scoreSheet }, () => {
			console.log('state has been updated')
		})
	}

	// accepting score as string here, it is basically for the future use case where we can
	// add options like 'A' for 'Absent' so that when any school print result card, show Absent
	// instead of 0 (zero student got zero in that exam).
	subjectScoreUpdate = (student_id: string, exam_id: string, score: string): void => {
		const { grades } = this.props
		const { scoreSheet } = this.state

		const student = scoreSheet[student_id]
		const exam = student.scoreSheetExams[exam_id]

		// to handle some old exams with total score of type string
		const total_marks = exam ? parseFloat(exam.total_score.toString()) || 0 : 0
		const obtained_marks = parseFloat(score) || 0

		const grade = calculateGrade(obtained_marks, total_marks, grades)
		const remarks = grade && grades && grades[grade] ? grades[grade].remarks : ''

		this.setState({
			scoreSheet: {
				...scoreSheet,
				[student_id]: {
					...student,
					scoreSheetExams: {
						...student['scoreSheetExams'],
						[exam_id]: {
							...exam,
							stats: {
								score: obtained_marks,
								grade,
								remarks
							},
							edited: true
						}
					}
				}
			}
		})
	}

	saveBulkExams = (): void => {
		const { scoreSheet } = this.state
		const students_count = Object.values(scoreSheet).length

		if (students_count === 0) {
			toast.error('There is nothing to save!')
			return
		}

		this.props.updateBulkExams(scoreSheet)

		// this.setState({
		// 	banner: {
		// 		active: true,
		// 		good: true,
		// 		text: 'Exam marks sheet has been saved successfully'
		// 	}
		// })

		// setTimeout(() => {
		// 	this.setState({ banner: { active: false } })
		// }, 3000)
	}

	deleteExam = (exam_id: string): void => {
		if (!window.confirm('Are you sure you want to delete the exam?')) {
			return
		}

		const students = Object.values(this.props.students)
			.filter(s => s && s.exams && s.exams[exam_id])
			.map(s => s.id)

		// this.setState({
		// 	banner: {
		// 		active: true,
		// 		good: false,
		// 		text: 'Exam has been deleted successfully'
		// 	}
		// })

		this.props.deleteExam(students, exam_id)

		toast.success('Exam has been deleted successfully')

		// setTimeout(() => this.setState({ banner: { active: false } }), 3000)
	}

	setQueryParams = (section_id: string, examFilter: ExamFilter) => {
		const { exam_title, year, month } = examFilter

		const url = '/reports/bulk-exams'
		let params = `section_id=${section_id}&exam_title=${exam_title}&year=${year}`

		if (exam_title === 'Test') params = params + `&month=${month}`

		window.history.replaceState(this.state, 'Bulk Exams', `${url}?${params}`)
	}

	renderClassResultSheet = (section: AugmentedSection) => {
		const { selectedSection, examFilter } = this.state
		const { exams, students, grades, schoolName } = this.props

		const chunkSize = 22
		let filtered_exams: MISExam[] = []

		for (const exam of Object.values(exams)) {
			if (
				exam.name === examFilter.exam_title &&
				moment(exam.date).format('YYYY') === examFilter.year &&
				exam.section_id === selectedSection &&
				(examFilter.exam_title === 'Test' && examFilter.month
					? moment(exam.date).format('MMMM') === examFilter.month
					: true)
			) {
				filtered_exams.push(exam)
			}
		}

		const exam_students = Object.values(students)
			.filter(student => student && student.Name && student.section_id && student.exams)
			.reduce<MergeStudentsExams[]>((agg, curr) => {
				const merge_exams: AugmentedMISExam[] = []

				for (const exam of filtered_exams) {
					const stats = curr.exams[exam.id]
					if (stats != null) {
						merge_exams.push({ ...exam, stats })
					}
				}
				// in case there is no exams for the curr student, no need to put into list
				if (merge_exams.length === 0) return agg

				return [...agg, { ...curr, merge_exams }]
			}, [])

		const marks_sheet = getStudentExamMarksSheet(exam_students, grades)

		return chunkify(
			marks_sheet,
			chunkSize
		).map((chunkItems: StudentMarksSheet[], index: number) => (
			<ClassResultSheet
				key={index}
				sectionName={section ? section.namespaced_name : ''}
				relevant_exams={filtered_exams}
				examName={examFilter.exam_title}
				schoolName={schoolName}
				students={chunkItems}
				chunkSize={index === 0 ? 0 : chunkSize * index}
			/>
		))
	}

	render() {
		const { exams, history, students } = this.props

		const { selectedSection, examFilter, showCreateExam, sections, scoreSheet } = this.state

		const { exam_title, year } = examFilter

		const curr_section = sections.find(section => section.id === selectedSection)

		let years = new Set<string>()
		let filtered_exams: MISExam[] = []

		for (const exam of Object.values(exams)) {
			years.add(moment(exam.date).format('YYYY'))

			if (this.getExamFilterConditions(exam, selectedSection, examFilter)) {
				filtered_exams.push(exam)
			}
		}

		const subjects = this.getSubjects()

		return (
			<AppLayout title="Manage Bulk Exams" showHeaderTitle>
				<div className="bulk-exams no-print mt-5">
					{/* {this.state.banner.active && (
						<Banner isGood={this.state.banner.good} text={this.state.banner.text} />
					)} */}
					{/* <div className="title">Manage Bulk Exams</div> */}
					<div className="section-container section">
						<div className="filter-container">
							<div className="row">
								{exam_title === 'Test' && (
									<select
										className="tw-select"
										{...this.former.super_handle(
											['examFilter', 'month'],
											() => true,
											() => this.setScoreSheet(students, exams)
										)}>
										<option value="">Select Month</option>
										{months.map(month => (
											<option key={month} value={month}>
												{month}
											</option>
										))}
									</select>
								)}
								<select
									className="tw-select"
									{...this.former.super_handle(
										['examFilter', 'year'],
										() => true,
										() => this.setScoreSheet(students, exams)
									)}>
									<option value="">Select Year</option>
									{[...years]
										.sort((a, b) => parseInt(b) - parseInt(a))
										.map(year => (
											<option key={year} value={year}>
												{year}
											</option>
										))}
								</select>
								<select
									className="tw-select"
									{...this.former.super_handle(
										['examFilter', 'exam_title'],
										() => true,
										() => this.setScoreSheet(students, exams)
									)}>
									<option value="">Select Exam</option>
									{ExamTitles.map(title => (
										<option key={title} value={title}>
											{title}
										</option>
									))}
								</select>
								<select
									className="tw-select"
									{...this.former.super_handle(
										['selectedSection'],
										() => true,
										() => this.setScoreSheet(students, exams)
									)}>
									<option value="">Select Class</option>
									{sections.map(section => (
										<option key={section.id} value={section.id}>
											{section ? section.namespaced_name : ''}
										</option>
									))}
								</select>
							</div>
						</div>
						{
							<div className="recent-exams">
								<RecentAddedExams
									exams={filtered_exams}
									onDeleteExam={this.deleteExam}
								/>
								<div className="row create-exam">
									<div
										className="button blue"
										onClick={this.toggleCreateExamModal}>
										Create New Exam
									</div>
								</div>
							</div>
						}
					</div>
					{showCreateExam && (
						<Modal>
							<CreateExamModal
								subjects={subjects}
								onCreate={this.onCreateExam}
								onClose={this.closeCreateExamModal}
							/>
						</Modal>
					)}
					{selectedSection && exam_title && year && (
						<ExamScoreSheet
							scoreSheet={scoreSheet}
							exams={filtered_exams}
							onSubjectScoreUpdate={this.subjectScoreUpdate}
							onSaveBulkExams={this.saveBulkExams}
						/>
					)}
				</div>
				{selectedSection && exam_title && year && (
					<div className="print-only">{this.renderClassResultSheet(curr_section)}</div>
				)}
			</AppLayout>
		)
	}
}

export default connect(
	(state: RootReducerState) => ({
		students: state.db.students,
		classes: state.db.classes,
		exams: state.db.exams || {},
		grades: state.db.settings.exams.grades,
		settings: state.db.settings,
		schoolName: state.db.settings.schoolName
	}),
	(dispatch: Function) => ({
		createSingleExam: (exam: CreateExam, class_id: string, section_id: string) =>
			dispatch(mergeExam(exam, class_id, section_id)),
		updateBulkExams: (scoreSheet: ExamScoreSheet) => dispatch(updateBulkExams(scoreSheet)),
		deleteExam: (students: string[], exam_id: string) => dispatch(deleteExam(students, exam_id))
	})
)(BulkExam)

interface ExamScoreSheetProps {
	scoreSheet: ExamScoreSheet
	exams: MISExam[]
	onSubjectScoreUpdate: (student_id: string, exam_id: string, score: string) => void
	onSaveBulkExams: () => void
}

const ExamScoreSheet: React.FC<ExamScoreSheetProps> = ({
	scoreSheet,
	exams,
	onSubjectScoreUpdate,
	onSaveBulkExams
}) => {
	return (
		<div className="mb-10">
			<div className="divider">Exams Marks Sheet</div>
			<div className="section-container section">
				<div className="score-sheet table-wrapper">
					<table>
						<thead>
							<tr>
								<th style={{ width: '10%' }}></th>
								{exams
									.sort((a, b) => a.date - b.date)
									.map(exam => {
										return (
											<th key={exam.id}>
												{' '}
												{exam.subject} <br /> ({exam.total_score}){' '}
											</th>
										)
									})}
							</tr>
						</thead>
						<tbody>
							{Object.values(scoreSheet)
								.sort(
									(a, b) =>
										(parseInt(a.RollNumber) || 0) -
										(parseInt(b.RollNumber) || 0)
								)
								.map(student => (
									<tr key={student.id}>
										<td title={toTitleCase(student.Name)}>
											<Link to={`/students/${student.id}/profile`}>
												{student.RollNumber || ''}{' '}
												{toTitleCase(student.Name)}
											</Link>
										</td>
										{Object.entries(student.scoreSheetExams)
											.sort(([, a], [, b]) => a.date - b.date)
											.map(([exam_id, exam]) => (
												<td
													key={`${exam_id}-${student.id}-${exam.section_id}`}>
													<input
														className="tw-input"
														onBlur={e =>
															onSubjectScoreUpdate(
																student.id,
																exam_id,
																e.target.value
															)
														}
														type="number"
														placeholder="Marks"
														defaultValue={exam.stats.score}
													/>
												</td>
											))}
									</tr>
								))}
						</tbody>
					</table>
				</div>
				<div className="score-sheet row">
					<div
						className="button grey"
						onClick={() => window.print()}
						style={{ marginRight: 5 }}>
						Print Marks Sheet
					</div>
					<div className="button blue" onClick={onSaveBulkExams}>
						Save Marks Sheet
					</div>
				</div>
			</div>
		</div>
	)
}

interface RecentAddedExamsProps {
	exams: MISExam[]
	onDeleteExam: (exam_id: string) => void
}

const RecentAddedExams: React.FC<RecentAddedExamsProps> = ({ exams, onDeleteExam }) => {
	return (
		<div className="recent-exams table-wrapper">
			<table>
				<thead>
					<tr>
						<th>Subject</th>
						<th>Max Score</th>
						<th>Date</th>
						<th>Edit/Delete</th>
					</tr>
				</thead>
				<tbody>
					{exams
						.sort((a, b) => a.date - b.date)
						.map(exam => (
							<tr key={exam.id}>
								<td className="text-left">
									<Link
										to={`/reports/${exam.class_id}/${exam.section_id}/exam/${exam.id}`}>
										{exam.subject}
									</Link>
								</td>
								<td>{exam.total_score}</td>
								<td>{moment(exam.date).format('DD/MM')}</td>
								<td>
									<div className="flex flex-row space-x-4">
										<Link
											to={`/reports/${exam.class_id}/${exam.section_id}/exam/${exam.id}`}>
											<img className="edit-icon" src={EditIcon} alt="edit" />
										</Link>
										<img
											className="delete-icon"
											src={DeleteIcon}
											onClick={() => onDeleteExam(exam.id)}
											alt="delete"
										/>
									</div>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	)
}
