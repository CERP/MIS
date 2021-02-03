import React from 'react';

interface P {
	setSectionId: (sectionId: string) => any
	sortedSections: AugmentedSection[]
}

// grades could have TIPLevels, TIPGrades
// for formative, grades will be tiplevels
// for diagnostic, grades will be tipgrades
const Classes: React.FC<P> = ({ setSectionId, sortedSections }) => {

	const index_map = [
		'bg-blue-25',
		'bg-yellow-primary',
		'bg-green-primary',
		'bg-orange-primary',
		'bg-red-primary'
	]

	// "grade" is misleading as we only deal with TIPLevels here. we map the level to a 
	// TIPGrade inside the map function below (mapped_grade)
	return <div className="flex flex-wrap flex-row justify-around w-full mx-4">
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