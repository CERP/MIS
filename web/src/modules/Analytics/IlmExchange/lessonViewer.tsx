import React from 'react'
import { StudentIcon } from 'assets/icons'
import { getTimeString } from 'utils/helpers'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'

interface PropsType {
	students: RootDBState["students"]
	classes: RootDBState["classes"]
	lessonId: string
	lessons: {
		[id: string]: AugmentedIlmxLesson
	}
	onClose: () => void
}

type LessonViewer = {
	watchCount: number
	watchDuration: number
} & MISStudent & { section_info: AugmentedSection }

const LessonViewerModal: React.FC<PropsType> = ({ students, lessonId, lessons, classes, onClose }) => {

	const students_who_watched = getStudents(students, lessonId, lessons, classes)

	return (
		<div className="ilmx-analytics modal-container inner">
			<div className="close button red" onClick={onClose}>✕</div>
			<div className="title">Lesson Viewers</div>
			<div className="form scrollbar">
				{
					students_who_watched
						.sort((a, b) => (b.watchDuration + b.watchCount) - (a.watchDuration + b.watchCount))
						.map((student: LessonViewer) => (<div className="card" key={student.id}>
							<div className="card-row">
								<div className="card-row inner">
									<ProfilePicture student={student} />
									<p className="card-title">{student.Name}</p>
								</div>
								<div style={{ marginLeft: "auto" }}>
									<p className="views viewer">{student.watchCount} views</p>
								</div>
							</div>
							<div className="card-row">
								<p className="student-class-title">Class: {student.section_info ? student.section_info.namespaced_name : 'nil'}</p>
							</div>
							<div className="card-row">
								<div className="more-detail">
									<p>watch time: {getTimeString(student.watchDuration)}</p>
									<p className="hidden-views viewer" style={{ marginLeft: "auto" }}>{student.watchCount} views</p>
								</div>
							</div>
						</div>))
				}
			</div>
		</div>
	)
}

export default LessonViewerModal

type PictureProps = {
	student: LessonViewer
}

const ProfilePicture: React.FC<PictureProps> = ({ student }) => {
	const avatar = student.ProfilePicture ? student.ProfilePicture.url || student.ProfilePicture.image_string : ""
	const imgSrc = avatar || StudentIcon
	return <img src={imgSrc} alt="play-icon" height="24" width="24" style={{ borderRadius: 12 }} />
}

interface GetStudent {
	(students: PropsType["students"],
		lessonId: string,
		lessons: PropsType["lessons"],
		classes: PropsType["classes"]
	): LessonViewer[]
}

const getStudents: GetStudent = (students, lessonId, lessons, classes) => {

	if (lessonId && lessons && lessons[lessonId]) {

		const sections = getSectionsFromClasses(classes)

		const { viewers } = lessons[lessonId]

		const students_who_watched: LessonViewer[] = []

		for (const [sid, vmeta] of Object.entries(viewers)) {

			if (students && students[sid]) {
				students_who_watched.push({
					...students[sid],
					...vmeta,
					section_info: getStudentSectionInfo(students[sid].section_id, sections)
				})
			}
		}

		return students_who_watched
	}

	return [] as LessonViewer[]
}

const getStudentSectionInfo = (section_id: string, sections: AugmentedSection[]): AugmentedSection => {
	return sections.find(section => section.id === section_id)
}