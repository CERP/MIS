import React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { LessonPlans } from 'assets/icons'

interface P {
	setSectionId: (sectionId: string) => any
	sortedSections: AugmentedSection[]
}

type PropsType = P & RouteComponentProps

// grades could have TIPLevels, TIPGrades
// for formative, grades will be tiplevels
// for diagnostic, grades will be tipgrades
const Classes: React.FC<PropsType> = ({ setSectionId, sortedSections, match }) => {

	const index_map = [
		'bg-purple-primary',
		'bg-light-blue-primary',
		'bg-yellow-primary',
		'bg-green-primary',
		'bg-orange-primary'
	]

	const url = match.url.split('/')

	// "grade" is misleading as we only deal with TIPLevels here. we map the level to a 
	// TIPGrade inside the map function below (mapped_grade)
	return <div className="flex flex-wrap flex-row justify-around w-full mx-4">
		{
			url[2] === 'diagnostic-test' && <Link className="container sm:px-8 bg-white rounded-2xl m-3 h-44 flex flex-col content-center items-center shadow-lg no-underline"
				to={'/targeted-instruction/oral-test'}>
				<img className="h-24 py-4 w-24" src={LessonPlans} alt="img" />
				<div className="text-blue-900 text-lg font-bold">Oral Test</div>
			</Link>
		}
		{
			sortedSections && sortedSections.map((classObj, index) => {
				const matches = classObj.namespaced_name.match(/[0-9]+/g)
				const class_number = matches.length > 0 ? matches[0] : ''

				const color = class_number ? index_map[parseInt(class_number) % index_map.length] : index_map[index % index_map.length]

				return <div
					key={classObj.id}
					className="flex-wrap container w-2/5 sm:px-8 bg-white rounded-lg m-3 h-36 flex items-center justify-start flex-col shadow-lg cursor-pointer"
					onClick={() => setSectionId(classObj.id)}>
					<div className={`text-white font-bold shadow-2xl flex items-center justify-center mt-8 mb-5 rounded-full text-xl h-12 w-12 
                ${color}`}>{class_number}
					</div>
					<div className="text-blue-900 text-lg font-thin">{classObj.namespaced_name}</div>
				</div>
			})
		}
	</div >
}

export default withRouter(Classes)