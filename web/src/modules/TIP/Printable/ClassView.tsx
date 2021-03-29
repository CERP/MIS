import React from 'react'
import ClassViewCard from '../Printable/ClassViewCard'

interface P {
	students: RootDBState['students']
	section_id: string
}

const ClassViewPrintable: React.FC<P> = ({ students, section_id }) => {
	return (
		<div className="flex flex-wrap content-between hidden print:block">
			<table className="w-11/12 m-auto border border-black">
				<thead>
					<tr>
						<div className="h-10 items-center w-full mt-4 flex flex-row justify-around">
							<div className="w-4/12 md:w-6/12 flex flex-row justify-between px-3 items-center m-2">
								<td className="font-bold text-center text-lg">Name</td>
							</div>
							<div className="flex flex-row justify-between w-8/12 md:w-6/12 text-xs m-4 text-lg">
								{['Urdu', 'Maths', 'English'].map(sub => (
									<td
										key={sub}
										className="font-bold w-2/6 flex justify-center items-center">
										{sub}
									</td>
								))}
							</div>
						</div>
					</tr>
				</thead>
				<tbody>
					<tr>
						{Object.values(students || {})
							.filter(t => t.section_id === section_id)
							.map(std => (
								<ClassViewCard key={std.id} std={std} />
							))}
					</tr>
				</tbody>
			</table>
		</div>
	)
}

export default ClassViewPrintable
