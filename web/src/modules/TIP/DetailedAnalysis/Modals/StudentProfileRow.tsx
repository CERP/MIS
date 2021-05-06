import React from 'react'
import clsx from 'clsx'

interface P {
	previous_grade: TIPLearningGroups
	current_grade: TIPLearningGroups
	subject: string
	is_oral: string
}

const StudentProfileRow: React.FC<P> = ({ is_oral, subject, current_grade, previous_grade }) => {
	return (
		<div className="text-xs md:text-base lg:text-lg w-full">
			<div className="p-2 flex flex-row justify-between items-center">
				<div className="w-1/4 font-bold flex justify-center items-center">{subject}</div>
				<div
					className={clsx('w-1/4 font-bold flex justify-center items-center', {
						'text-red-tip-brand': is_oral === 'yes',
						'text-gray-600': is_oral === 'No'
					})}>
					{is_oral}
				</div>
				<div className="w-1/4 flex flex-wrap justify-center items-center px-3 py-1">
					<div
						className={clsx(
							'w-11/12 text-white flex flex-wrap justify-center rounded-md items-center shadow-lg cursor-pointer text-xs md:text-sm lg:text-base px-3 py-2',
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
				<div className="w-1/4 flex flex-wrap justify-center items-center px-3 py-1">
					<div
						className={clsx(
							`w-11/12 text-white flex flex-wrap justify-center rounded-md items-center shadow-lg cursor-pointer text-xs md:text-sm lg:text-base ${current_grade === 'Not Reassigned'
								? 'py-0 px-1 text-center'
								: 'py-2 px-3'
							}`,
							{
								'bg-light-blue-tip-brand': current_grade === 'Blue',
								'bg-yellow-tip-brand': current_grade === 'Yellow',
								'bg-green-tip-brand': current_grade === 'Green',
								'bg-orange-tip-brand': current_grade === 'Orange',
								'bg-gray-400': current_grade === 'Oral',
								'bg-gray-600': current_grade === 'Remediation Not Needed',
								'bg-gray-300 text-red-tip-brand': current_grade === 'Not Reassigned'
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
