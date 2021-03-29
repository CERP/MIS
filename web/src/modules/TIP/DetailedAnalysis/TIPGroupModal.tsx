import React from 'react'
import clsx from 'clsx'
import { convertLearningLevelToGrade } from 'utils/TIP'

interface P {
	subject: TIPSubjects

	setModalType: (modal_type: string) => void
	setSelectedGrade: (grade: TIPGrades) => void
}

type OrderedGroupItem = {
	group: TIPLevels
	color: TIPLearningGroups
}

const ordered_groups: Array<OrderedGroupItem> = [
	{ group: 'Level KG', color: 'Blue' },
	{ group: 'Level 1', color: 'Yellow' },
	{ group: 'Level 2', color: 'Green' },
	{ group: 'Level 3', color: 'Orange' },
	{ group: 'Remediation Not Needed', color: 'Remediation Not Needed' }
]

const TIPGroupModal: React.FC<P> = ({ subject, setSelectedGrade, setModalType }) => {
	const onClickGrade = (grade: TIPGrades) => {
		setModalType('change_group')
		setSelectedGrade(grade)
	}

	return (
		<div className="flex flex-col rounded-t-xl padding-3 bg-white">
			<div className="text-center rounded-t-lg bg-blue-tip-brand h-12 md:h-16 lg:h-16 text-white flex flex-row justify-around items-center text-sm md:text-lg lg:text-lg">
				Select new group for {subject}
			</div>
			<div className="flex flex-wrap flex-row justify-around w-full">
				{ordered_groups &&
					ordered_groups.map((ordered_group, index) => {
						return (
							<div key={ordered_group.group}>
								<div
									className={clsx(
										'flex flex-wrap p-3 md:px-4 md:py-3 lg:px-10 lg:py-5 rounded-lg m-2 md:m-2 lg:m-4 items-center shadow-lg cursor-pointer text-sm md:text-base lg:text-lg',
										{
											'bg-light-blue-tip-brand': index === 0,
											'bg-yellow-tip-brand': index === 1,
											'bg-green-tip-brand': index === 2,
											'bg-orange-tip-brand': index === 3,
											'bg-gray-600': index === 4
										}
									)}
									onClick={() =>
										onClickGrade(
											convertLearningLevelToGrade(ordered_group.group)
										)
									}>
									<div className="text-white font-bold mb-1">
										{ordered_group.color === 'Remediation Not Needed'
											? ordered_group.color
											: `${ordered_group.color} Group`}
									</div>
								</div>
							</div>
						)
					})}
			</div>
		</div>
	)
}

export default TIPGroupModal
