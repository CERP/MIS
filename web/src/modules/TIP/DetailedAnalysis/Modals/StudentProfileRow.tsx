import React from 'react'
import clsx from 'clsx'
import { To } from 'assets/icons'
interface P {
	previous_grade: TIPLearningGroups
	current_grade: TIPLearningGroups
	subject: string
	is_oral: boolean
}

const StudentProfileRow: React.FC<P> = ({ is_oral, subject, current_grade, previous_grade }) => {
	return (
		<div className="my-3 flex flex-row justify-between items-center text-xs md:text-base lg:text-lg w-full">
			<div className="w-1/3 flex flex-row justify-around font-bold">
				<div className="w-2/4 flex justify-center items-center">
					{subject === 'English' ? 'Eng' : subject}
				</div>
				<div
					className={clsx('w-2/4 flex justify-center items-center', {
						'text-red-tip-brand': is_oral === true,
						'text-gray-600': is_oral === false
					})}>
					{is_oral ? 'Yes' : 'No'}
				</div>
			</div>
			<div className="w-2/3 flex flex-row justify-around items-center space-x-2 mr-2">
				<div className="w-9/12 flex flex-wrap justify-center">
					<div
						className={clsx(
							'w-full text-white flex flex-wrap justify-center rounded-md items-center shadow-lg cursor-pointer text-xs md:text-xs lg:text-base px-4 py-2',
							{
								'bg-light-blue-tip-brand': previous_grade === 'Blue',
								'bg-yellow-tip-brand': previous_grade === 'Yellow',
								'bg-green-tip-brand': previous_grade === 'Green',
								'bg-orange-tip-brand': previous_grade === 'Orange',
								'bg-gray-400': previous_grade === 'Oral',
								'bg-gray-600': previous_grade === 'Remediation Not Needed'
							}
						)}>
						{previous_grade === 'Remediation Not Needed' ? 'none' : previous_grade}
					</div>
				</div>
				{current_grade !== 'Not Reassigned' ? (
					<img className="h-3 w-3" src={To} />
				) : (
					<div className="h-3 w-3"></div>
				)}
				<div className="w-9/12 flex flex-wrap justify-center items-center">
					<div
						className={clsx(
							`w-full text-white flex flex-wrap justify-center rounded-md items-center shadow-lg cursor-pointer text-xs md:text-xs lg:text-base ${current_grade === 'Not Reassigned'
								? 'py-0 md:py-2 lg:py-2 px-2 text-center'
								: ' px-4 py-2'
							}`,
							{
								'bg-light-blue-tip-brand': current_grade === 'Blue',
								'bg-yellow-tip-brand': current_grade === 'Yellow',
								'bg-green-tip-brand': current_grade === 'Green',
								'bg-orange-tip-brand': current_grade === 'Orange',
								'bg-gray-400': current_grade === 'Oral',
								'bg-gray-600': current_grade === 'Remediation Not Needed',
								'bg-gray-300 text-blue-tip-brand':
									current_grade === 'Not Reassigned'
							}
						)}>
						{current_grade === 'Remediation Not Needed' ? 'none' : current_grade}
					</div>
				</div>
			</div>
		</div>
	)
}

export default StudentProfileRow
