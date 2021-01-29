import React from 'react';

interface P {
	setSectionId: (sectionId: string) => any
	sortedSections: AugmentedSection[]
	grades: string[]
}

const Classes: React.FC<P> = ({ setSectionId, sortedSections, grades }) => {
	return <div className="flex flex-wrap flex-row justify-around w-full mx-4">
		{
			grades && grades
				.sort((a, b) => a.localeCompare(b))
				.map((grade, index) => (<div
					key={grade}
					className={`${index === 0 ? "bg-blue-25" :
						index === 1 ? "bg-yellow-primary" :
							index === 2 ? "bg-green-primary" :
								index === 3 ? "bg-orange-primary" :
									"bg-red-primary"} flex-wrap container w-2/5 sm:px-8 rounded-lg m-3 h-32 flex items-center justify-center flex-col shadow-lg`}
					id={grade}
					onClick={(e: any) => setSectionId(e.target.id)}>
					<div className="text-white text-xs font-bold mb-1">{`${grade === '1' ? "Blue" : grade === '2' ? "Yellow" : grade === '3' ? "Green" : "Orange"} Group`}</div>
					<div className="text-xs text-white font-thin">{`Remedial Level ${grade}`}</div>
				</div>
				))
		}
		{
			sortedSections && sortedSections.map((classObj, index) => (<div
				key={classObj.id}
				className="flex-wrap container w-2/5 sm:px-8 bg-white rounded-lg m-3 h-36 flex items-center justify-start flex-col shadow-lg cursor-pointer"
				id={classObj.id}
				onClick={(e: any) => setSectionId(e.target.id)}>
				<div className={`text-white font-bold shadow-2xl flex items-center justify-center mt-8 mb-5 rounded-full text-xl h-12 w-12 
                ${index === 0 ? "bg-blue-25" :
						index === 1 ? "bg-yellow-primary" :
							index === 2 ? "bg-green-primary" :
								index === 3 ? "bg-orange-primary" :
									"bg-purple-primary"}`}>{(classObj.namespaced_name).substring(6)}
				</div>
				<div className="text-blue-900 text-lg font-thin">Class</div>
			</div>
			))
		}
	</div >
}

export default Classes