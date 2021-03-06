import React from 'react'
import { BlackAvatar, Smile, Sad, Serious } from 'assets/icons'
import clsx from 'clsx'

interface P {
	student: MISStudent
	class_name: TIPLevels
	subject: TIPSubjects
	quiz_id: string
	total_marks: number
}

const getProgress = (obtained_marks: number) => {
	const percentage = (obtained_marks / 10) * 100
	if (percentage > 60) {
		return 'Mastered'
	} else if (percentage >= 40) {
		return 'Working'
	} else if (percentage < 0) {
		return 'Absent'
	} else if (isNaN(percentage)) {
		return 'Not Graded'
	} else {
		return 'Struggling'
	}
}

const SingleStdResult: React.FC<P> = ({ student, class_name, subject, quiz_id, total_marks }) => {
	const quiz_result = student?.targeted_instruction?.quiz_result
	const obtained_marks = quiz_result?.[class_name]?.[subject]?.[quiz_id]?.obtained_marks
	const progress = getProgress(obtained_marks)

	const getSmileyFromProgress = (progress: string) => {
		if (progress === 'Mastered') {
			return Smile
		} else if (progress === 'Working') {
			return Serious
		} else if (progress === 'Absent') {
			return ''
		} else {
			return Sad
		}
	}

	const getObtainedMarksText = () => {
		if (obtained_marks === -1) {
			return 'Absent'
		} else if (obtained_marks > -1) {
			return `${obtained_marks || 0}/${total_marks}`
		} else {
			return 'Not Graded'
		}
	}

	return (
		<div className="mb-3 bg-white w-ful text-sm md:text-base lg:text-lg flex flex-row justify-around md:justify-around lg:justify-around">
			<div className="w-1/3 flex justify-center">
				<div className="w-full md:w-1/2 lg:w-1/2 flex flex-row justify-center items-center">
					<img className="h-8 w-8" src={BlackAvatar} />
					<div>{student.Name}</div>
				</div>
			</div>
			<div className="flex items-center w-1/3 justify-center font-bold">
				{getObtainedMarksText()}
			</div>
			<div className="flex items-center w-1/3 justify-center">
				<div className="w-full md:w-1/2 lg:w-1/3 flex flex-row justify-center items-center">
					{progress !== 'Absent' && progress !== 'Not Graded' && (
						<img className="w-5 h-5 mr-2" src={getSmileyFromProgress(progress)} />
					)}
					<div
						className={clsx('font-bold', {
							'fontColor:#3efd45': progress === 'Mastered',
							'text-yellow-tip-brand': progress === 'Working',
							'text-red-tip-brand': progress === 'Struggling',
							'text-black': progress === 'Absent' || progress === 'Not Graded'
						})}
						style={progress === 'Mastered' ? { color: '#3efd45' } : {}}>
						{progress}
					</div>
				</div>
			</div>
		</div>
	)
}

export default SingleStdResult
