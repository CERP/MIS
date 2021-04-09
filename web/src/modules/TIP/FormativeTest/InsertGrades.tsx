import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, Link, withRouter } from 'react-router-dom'
import { getStudentsBySectionId, getStudentsByGroup, convertLearningLevelToGrade } from 'utils/TIP'
import Card from '../Card'
import { Check } from 'assets/icons'
interface P {
	students: RootDBState['students']
}

type PropsType = P & RouteComponentProps

const InsertGrades: React.FC<PropsType> = props => {
	const url = props.match.url.split('/')
	const { class_name, subject, section_id, test_id } = props.match.params as Params

	const group = convertLearningLevelToGrade(class_name ? (class_name as TIPLevels) : 'Oral')

	const mode = url[2] === 'diagnostic-test' ? 'DIAGNOSTIC' : 'OTHER'

	const students =
		mode === 'DIAGNOSTIC'
			? useMemo(() => getStudentsBySectionId(section_id, props.students), [section_id])
			: useMemo(() => getStudentsByGroup(props.students, group, subject), [subject])

	console.log(students)

	return (
		<div className="flex flex-wrap content-between mt-20">
			<Card
				class_name={class_name ? class_name : 'Oral Test'}
				subject={subject}
				lesson_name=""
				lesson_no=""
			/>
			{
				<div className="m-3 w-full grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12">
					{Object.values(students)
						.sort((a, b) => a.Name.localeCompare(b.Name))
						.map(std => {
							const checked =
								std.targeted_instruction &&
								std.targeted_instruction.results &&
								std.targeted_instruction.results[test_id]
							return (
								<Link
									key={std.id}
									className="relative no-underline flex flex-col items-center justify-between mb-1"
									to={
										url[2] === 'diagnostic-test'
											? `/${url[1]}/${url[2]}/${section_id}/${class_name}/${subject}/${test_id}/insert-grades/${std.id}/grading`
											: url[2] === 'oral-test'
												? `/${url[1]}/${url[2]}/${subject}/${test_id}/insert-grades/${std.id}/grading`
												: `/${url[1]}/${url[2]}/${class_name}/${subject}/${test_id}/insert-grades/${std.id}/grading`
									}>
									<img
										className="relative border border-solid border-sea-green-tip-brand rounded-full h-14 w-14"
										src="https://www.atmeplay.com/images/users/avtar/avtar_nouser.png"
										alt="img"
									/>
									{checked && (
										<div className="relative">
											<img
												src={Check}
												className="h-5 bottom-1 -right-9 absolute"
											/>
										</div>
									)}
									<div className="text-xs flex items-center justify-center w-24 md:w-28 overflow-ellipsis">
										{std.Name}
									</div>
									<div className="text-xs flex items-center justify-center">
										{std.RollNumber}
									</div>
								</Link>
							)
						})}
				</div>
			}
			<div className="w-full my-2">
				<Link
					className="w-full no-underline flex justify-center items-center"
					to={
						url[2] === 'diagnostic-test'
							? `/${url[1]}/${url[2]}/${section_id}/${class_name}/${subject}/${test_id}/insert-grades/test-result`
							: `/${url[1]}/${url[2]}/${class_name}/${subject}/${test_id}/insert-grades/test-result`
					}>
					<button className="bg-blue-tip-brand h-11 font-bold text-lg border-none rounded text-white p-2 w-6/12">
						Finish
					</button>
				</Link>
			</div>
		</div>
	)
}

export default connect((state: RootReducerState) => ({
	students: state.db.students
}))(withRouter(InsertGrades))
