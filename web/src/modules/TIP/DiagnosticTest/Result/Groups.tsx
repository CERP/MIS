import clsx from 'clsx'
import React from 'react'

interface P {
	color: TIPLearningGroups
	level: string
	students: RootDBState['students']
}

const getTIPGroup = (group: TIPLearningGroups) => {
	if (group === 'Oral') return `${group} Test Needed`
	if (group === 'Remediation Not Needed') return group
	if (group === 'Not Graded') return 'Not Graded'
}

const Groups: React.FC<P> = ({ students, color, level }) => {
	return (
		<div className="flex flex-wrap flex-col justify-between w-full">
			<div
				className={clsx('flex flex-row justify-between py-1 items-center text-white px-3', {
					'bg-gray-400': color === 'Oral',
					'bg-gray-600': color === 'Remediation Not Needed',
					'bg-red-tip-brand': color === 'Not Graded',
					'bg-blue-tip-brand': color === 'Blue',
					'bg-yellow-tip-brand': color === 'Yellow',
					'bg-green-tip-brand': color === 'Green',
					'bg-orange-tip-brand': color === 'Orange'
				})}>
				<div className="capitalize text-sm mr-1">
					{color === 'Remediation Not Needed' ||
						color === 'Oral' ||
						color === 'Not Graded'
						? getTIPGroup(color)
						: `${color} Group`}
				</div>
				<div className="capitalize text-sm">
					{color !== 'Oral' &&
						color !== 'Remediation Not Needed' &&
						color !== 'Not Graded' &&
						`Remedial Level ${level}`}
				</div>
			</div>
			{
				<div className="flex flex-wrap w-full justify-start">
					{Object.values(students)
						.sort((a, b) => a.Name.localeCompare(b.Name))
						.map(std => (
							<div
								key={std.id}
								className="relative no-underline h-24 flex flex-col flex items-center justify-center">
								<img
									className="border border-solid border-green-tip-brand rounded-full h-14 w-14"
									src="https://www.atmeplay.com/images/users/avtar/avtar_nouser.png"
									alt="img"
								/>
								<div className="text-xs flex items-center justify-center w-24 md:w-28 truncate">
									{std.Name}
								</div>
							</div>
						))}
				</div>
			}
		</div>
	)
}

export default Groups
