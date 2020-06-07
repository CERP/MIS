import React from 'react'

interface PropsType {
	students?: RootDBState["students"]
	lessonId?: string
	lessons?: {
		[id: string]: AugmentedIlmxLesson
	}
	onClose: () => void
}

type AugmentedIlmxLesson = {
	watchCount: number
	watchDuration: number
	viewers: Array<string>
} & IlmxLesson

const LessonViewerModal: React.FC<PropsType> = ({ students, lessonId, lessons, onClose }) => {

	const students_who_watched = getStudents(students, lessonId, lessons)

	console.log(students)

	return (
		<div className="modal-container inner">
			<div className="close button red" onClick={onClose}>✕</div>
			<div className="title">Lesson Viewers</div>
			<div className="form scrollbar">
				{
					students_who_watched.map((student: MISStudent) => (
						<div className="row" key={student.id}>{student.Name}</div>
					))
				}
			</div>
		</div>
	)
}

export default LessonViewerModal

interface GetStudent {
	(students: PropsType["students"], lessonId: string, lessons: PropsType["lessons"]): MISStudent[]
}

const getStudents: GetStudent = (students, lessonId, lessons) => {

	if (lessonId && lessons && lessons[lessonId]) {

		const { viewers } = lessons[lessonId]

		const students_who_watched: MISStudent[] = []

		for (const vid of viewers) {
			if (students && students[vid]) {
				students_who_watched.push(students[vid])
			}
		}

		return students_who_watched
	}

	return [] as MISStudent[]

}