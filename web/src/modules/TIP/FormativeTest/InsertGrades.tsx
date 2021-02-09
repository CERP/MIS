import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, Link, withRouter } from 'react-router-dom'
import { getStudentsBySectionId, getStudentsByGroup } from 'utils/TIP'
import Card from '../Card'
import { Check } from 'assets/icons'
interface P {
	students: RootDBState["students"]
}

type PropsType = P & RouteComponentProps

//TODO: This is definitely not right.
const class_map: Record<TIPLevels, TIPGrades> = {
	"Level 0": "KG",
	"Level 1": "1",
	"Level 2": "2",
	"Level 3": "3",
	"Oral": "Oral Test"
}

const InsertGrades: React.FC<PropsType> = (props) => {

	const url = props.match.url.split('/')
	const { class_name, subject, section_id, test_id } = props.match.params as Params

	const group = class_map[class_name ? class_name as TIPLevels : 'Oral']

	const mode = url[2] === "diagnostic-test" ? "DIAGNOSTIC" : "OTHER"

	const students = mode === "DIAGNOSTIC" ? useMemo(() => getStudentsBySectionId(section_id, props.students), [section_id]) : useMemo(() => getStudentsByGroup(props.students, group, subject), [subject])

	console.log(students)

	return <div className="flex flex-wrap content-between">
		<Card class_name={class_name ? class_name : 'Oral Test'} subject={subject} />
		{<div className="m-3 flex flex-wrap w-full justify-start">
			{Object.values(students)
				.sort((a, b) => a.Name.localeCompare(b.Name))
				.map((std) => {

					const checked = std.targeted_instruction && std.targeted_instruction.results && std.targeted_instruction.results[test_id]
					return <Link key={std.id} className="relative no-underline h-24 flex flex-col items-center justify-center"
						to={url[2] === "diagnostic-test" ?
							`/${url[1]}/${url[2]}/${section_id}/${class_name}/${subject}/${test_id}/insert-grades/${std.id}/grading` :
							url[2] === "oral-test" ?
								`/${url[1]}/${url[2]}/${subject}/${test_id}/insert-grades/${std.id}/grading` :
								`/${url[1]}/${url[2]}/${class_name}/${subject}/${test_id}/insert-grades/${std.id}/grading`}>
						<img className="border border-solid border-green-primary rounded-full h-14 w-14" src="https://www.atmeplay.com/images/users/avtar/avtar_nouser.png" alt="img" />
						{checked
							&& <img src={Check} className="absolute h-5 right-4 bottom-7" />}
						<div className="text-xs flex items-center justify-center w-24 md:w-28 truncate">{std.Name}</div>
						<div className="text-xs flex items-center justify-center">{std.RollNumber}</div>
					</Link>
				})}
		</div>}
		<div className="w-full my-2">
			<Link
				className="w-full no-underline flex justify-center items-center"
				to={url[2] === "diagnostic-test" ? `/${url[1]}/${url[2]}/${section_id}/${class_name}/${subject}/${test_id}/insert-grades/test-result` :
					`/${url[1]}/${url[2]}/${class_name}/${subject}/${test_id}/insert-grades/test-result`}>
				<button className="bg-blue-primary h-11 font-bold text-lg border-none rounded text-white p-2 w-6/12">Finish</button>
			</Link>
		</div>
	</div>
}

export default connect((state: RootReducerState) => ({
	students: state.db.students
}))(withRouter(InsertGrades))
