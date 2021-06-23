import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrashIcon } from '@heroicons/react/outline'
import { useSelector } from 'react-redux'
import moment from 'moment'

import { AppLayout } from 'components/Layout/appLayout'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'
import months from 'constants/months'

type State = {
	year: number
	sectionId: string
	month: string
}

enum ExamTerms {
	FIRST = '1st Term',
	SECOND = '2nd Term',
	MID = 'Mid-Term',
	FINAL = 'Final-Term',
	TEST = 'Test'
}

export const ExamsMarks = () => {
	const classes = useSelector((state: RootReducerState) => state.db.classes)
	const exams = useSelector((state: RootReducerState) => state.db.exams)
	const students = useSelector((state: RootReducerState) => state.db.students)

	const [state, setState] = useState<State>({
		year: Number(moment().format('YYYY')),
		month: moment().format('MMMM'),
		sectionId: undefined
	})

	// TODO: show filters (class-section, exams year)
	// TODO: show all term exams card
	// TODO: show monthly tests in separate section
	// TODO: delete term exam (this will delete from all exams from students and exams object)

	// Steps:
	// Filter all those exams create in a year
	// Filter all those terms exams that happen
	// Filter all those test types exams and display them separately

	const sections = useMemo(() => {
		return getSectionsFromClasses(classes).sort(
			(a, b) => (a.classYear ?? 0) - (b.classYear ?? 0)
		)
	}, [classes])

	const years = useMemo(() => {
		let years = new Set<number>()
		for (const exam of Object.values(exams)) {
			years.add(Number(moment(exam.date).format('YYYY')))
		}

		return [...years].sort((a, b) => b - a)
	}, [exams])

	// At the start user has liberty to create exam with name or title of
	// their own choice, but after sometime we have to restrict them with
	// default titles (terms)
	const deleteExamsByTerm = () => { }

	const getExamsByTerm = () => {
		const { year, sectionId, month } = state

		return Object.values(exams).reduce((agg, exam) => {
			const examYear = Number(moment(exam.date).format('YYYY'))
			const examMonth = moment(exam.date).format('MMMM')

			if (
				exam.section_id === sectionId &&
				examYear === year &&
				(exam.name === ExamTerms.TEST && month ? examMonth === month : true)
			) {
				return {
					...agg,
					[exam.name]: [...(agg[exam.name] ?? []), exam]
				}
			}
			return agg
		}, {} as { [id: string]: MISExam[] })
	}

	const selectedSection = sections.find(section => section.id === state.sectionId)

	const termExams = Object.entries(getExamsByTerm())
	const testExams = termExams.filter(([term, _]) => term === ExamTerms.TEST)

	console.log(state)

	return (
		<AppLayout title="Marks" showHeaderTitle>
			<div className="p-5 md:p-10 md:pt-5 md:pb-0 text-gray-700 relative space-y-4">
				<div className="flex flex-row items-center w-full space-x-8 md:space-x-16 justify-center">
					<select
						id="sectionId"
						className="tw-select md:w-1/4 w-1/2"
						name="sectionId"
						onChange={e => setState({ ...state, sectionId: e.target.value })}>
						<option value="">Class/Section</option>
						{sections.map(section => (
							<option key={section.id} value={section.id}>
								{section.namespaced_name}
							</option>
						))}
					</select>
					<select
						id="examYear"
						className="tw-select md:w-1/4 w-1/2"
						name="examYear"
						value={state.year}
						onChange={e => setState({ ...state, year: Number(e.target.value) })}>
						<option value="">Exam Year</option>
						{years.map(year => (
							<option key={year} value={year}>
								{year}
							</option>
						))}
					</select>
				</div>
				<div>
					{selectedSection ? (
						<p className="text-center">
							Displaying all exams for{' '}
							<span className="text-teal-brand font-semibold">
								{selectedSection.namespaced_name}
							</span>
						</p>
					) : (
						<p className="text-center font-semibold">
							Please select section and year to see exams
						</p>
					)}
				</div>
				<div className="w-full md:w-4/5 mx-auto space-y-2">
					{termExams
						.filter(([term, _]) => term !== ExamTerms.TEST)
						.map(([term, exams]) => (
							<ExamTermCard
								key={term}
								title={term}
								exams={exams}
								year={state.year}
								section={selectedSection}
							/>
						))}
				</div>
				{testExams.length > 0 && (
					<div className="w-full md:w-4/5 mx-auto">
						<h2 className="text-lg font-semibold mb-2">Test Exams</h2>
						<div className="flex justify-end">
							<select
								id="examMonth"
								className="tw-select md:w-1/4 w-1/2 mb-2"
								name="examMonth"
								value={state.month}
								onChange={e => setState({ ...state, month: e.target.value })}>
								<option value="">Test Month</option>
								{months.map(month => (
									<option key={month} value={month}>
										{month}
									</option>
								))}
							</select>
						</div>
						<div className="space-y-2">
							{testExams.map(([term, exams]) => (
								<ExamTermCard
									key={term}
									title={term}
									exams={exams}
									year={state.year}
									section={selectedSection}
								/>
							))}
						</div>
					</div>
				)}
			</div>
		</AppLayout>
	)
}

type ExamTermCardProps = {
	title: string
	exams: MISExam[]
	year: number
	section: AugmentedSection
}

const ExamTermCard = ({ title, exams, year, section }: ExamTermCardProps) => (
	<div className="w-full bg-white border border-gray-100 shadow-md rounded-md px-4 py-2 md:p-4">
		<div className="flex flex-row justify-between">
			<div className="flex flex-col space-y-1">
				<p className="font-semibold">{title}</p>
				<p className="text-sm text-gray-400">{exams.length} Exams</p>
			</div>
			<div className="flex flex-row items-center space-x-2">
				<Link to="/exam">
					<button className="tw-btn bg-teal-brand text-white">View Marks</button>
				</Link>
				<button className="text-white bg-red-brand rounded-full w-10 h-10 text-center">
					<TrashIcon className="w-5 h-5 mx-auto" />
				</button>
			</div>
		</div>
	</div>
)
