import React from 'react';

interface P {
	setSectionId: (sectionId: string) => any
	sortedSections: AugmentedSection[]
	grades: TIPLevels[]
}

// grades could have TIPLevels, TIPGrades
// for formative, grades will be tiplevels
// for diagnostic, grades will be tipgrades
const Classes: React.FC<P> = ({ setSectionId, sortedSections, grades }) => {

	const index_map = [
		'bg-blue-25',
		'bg-yellow-primary',
		'bg-green-primary',
		'bg-orange-primary',
		'bg-red-primary'
	]

	const grade_map = {
		'1': 'Blue',
		'2': 'Yellow',
		'3': 'Green',
		'4': 'Orange',

		'Level 0': 'Blue',
		'Level 1': 'Yellow',
		'Level 2': 'Green',
		'Level 3': 'Orange'
	}

	// "grade" is misleading as we only deal with TIPLevels here. we map the level to a 
	// TIPGrade inside the map function below (mapped_grade)
	return <div className="flex flex-wrap flex-row justify-around w-full mx-4">
		{
			grades && grades
				.sort((a, b) => a.localeCompare(b))
				.map((grade, index) => {
					console.log(grade)

					return <div
						key={grade}
						className={`${index_map[index]} cursor-pointer flex-wrap container w-2/5 sm:px-8 rounded-lg m-3 h-32 flex items-center justify-center flex-col shadow-lg`}
						onClick={() => setSectionId(grade)}>
						<div className="text-white text-xs font-bold mb-1">{`${grade_map[grade]} Group`}</div>
						<div className="text-xs text-white font-thin">{`Remedial ${grade}`}</div>
					</div>
				})
		}
		{
			sortedSections && sortedSections.map((classObj, index) => (<div
				key={classObj.id}
				className="flex-wrap container w-2/5 sm:px-8 bg-white rounded-lg m-3 h-36 flex items-center justify-start flex-col shadow-lg cursor-pointer"
				onClick={() => setSectionId(classObj.id)}>
				<div className={`text-white font-bold shadow-2xl flex items-center justify-center mt-8 mb-5 rounded-full text-xl h-12 w-12 
                ${index_map[index]}`}>{(classObj.namespaced_name).substring(6)}
				</div>
				<div className="text-blue-900 text-lg font-thin">Class</div>
			</div>
			))
		}
	</div >
}

export default Classes