import React from 'react'
import { connect, useSelector } from 'react-redux'
import { WhiteAvatar } from 'assets/icons'
import { convertLearningGradeToGroupName, convertLearningLevelToGrade } from 'utils/TIP'

interface P {
	class_name?: string
	subject?: string
	lesson_name?: string
	lesson_no?: string
	student_id: string
}

const StudentCard: React.FC<P> = ({ class_name, subject, lesson_name, lesson_no, student_id }) => {
	const { Name } = useSelector((state: RootReducerState) => state.db.students[student_id])
	const school_name = useSelector((state: RootReducerState) => state.db.settings.schoolName)

	const class_num = class_name?.substring(class_name.length - 2).trim()
	const color =
		class_num === 'KG'
			? 'light-blue'
			: class_num === '1'
			? 'yellow'
			: class_num === '2'
			? 'green'
			: class_num === '3'
			? 'orange'
			: 'sea-green'

	const group_name = convertLearningGradeToGroupName(
		convertLearningLevelToGrade(class_name as TIPLevels)
	)

	return (
		<div className="w-full flex justify-center print:hidden">
			<div
				className={`${
					class_name?.substring(0, 5) === 'Level'
						? `bg-${color}-tip-brand`
						: `bg-sea-green-tip-brand`
				} container sm:px-8 rounded-md h-20 mb-6 mt-0 w-11/12 md:w-13/12`}>
				<div className="flex flex-row justify-start">
					<img className="w-12 h-12 rounded-full p-4" src={WhiteAvatar} alt="img" />
					<div className="flex flex-row justify-between w-full">
						<div className="flex flex-col justify-center">
							<div className="text-white text-lg">{Name}</div>
							<div className="text-white text-base capitalize">
								{class_name?.substring(0, 5) === 'Level'
									? `${group_name} Group`
									: class_name
									? class_name
									: school_name}
								{subject && ` | ${subject}`}
								{lesson_name &&
									lesson_no &&
									` | ${lesson_name?.replace(/['"]+/g, '')} | ${lesson_no.replace(
										/['"]+/g,
										''
									)}`}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default StudentCard
