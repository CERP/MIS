import React, { useState, useMemo } from 'react'
import toast from 'react-hot-toast'

interface PropsType {
	lessons: IlmxLessonVideos
	isLoading: boolean
	onClose: () => void
}

interface S {
	lessonId: string
}

const LessonModal: React.FC<PropsType> = ({ lessons, onClose }) => {
	const [classFilter, setClassFilter] = useState('1')
	const [subjectFilter, setSubjectFilter] = useState('')

	const { classTitles, subjects } = useMemo(() => getClassSubjectsInfo(lessons), [lessons])

	const lessons_data = useMemo(() => getFilteredData(lessons, classFilter, subjectFilter), [
		lessons,
		classFilter,
		subjectFilter
	])

	const copyLink = (link: string) => {
		navigator.clipboard.writeText(link)
		toast.success('Copied')
	}

	const getLink = (link: string) => {
		const manipulatedLink = link.replace(/-/g, '/')
		const finalLink = encodeURI(manipulatedLink.slice(0, -2))
		return finalLink
	}

	return (
		<div className="bg-white p-4 w-full rounded-2xl h-screen">
			<div className="flex items-center my-4">
				<div
					className="focus:shadow-outline text-red-brand rounded-full shadow-sm p-2 border border-gray-200 bg-white cursor-pointer"
					onClick={onClose}>
					<svg
						className="w-6"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor">
						<path
							fillRule="evenodd"
							d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
				<div className="text-l bold ml-4 justify-start">Add Video Lectures to Diary</div>
			</div>
			<div className="form scrollbar">
				<div className="flex w-full video-filter w-full">
					<div className="flex flex-col mr-2 w-1/2">
						<div className="text-xl my-2">Class</div>
						<select
							className="tw-select"
							onChange={e => setClassFilter(e.target.value)}>
							<option value="">Select Class</option>
							{classTitles
								.sort()
								.reverse()
								.sort((a, b) => {
									if (parseInt(a) && parseInt(b)) return +a - +b
									if (parseInt(a) && !parseInt(b)) return 1
									if (parseInt(b) && !parseInt(b)) return -1
									return 0
								})
								.map(c_title => (
									<option key={c_title} value={c_title}>
										Class {c_title}
									</option>
								))}
						</select>
					</div>

					<div className="flex flex-col w-1/2">
						<div className="text-xl my-2">Subject</div>
						<select
							className="tw-select"
							onChange={e => setSubjectFilter(e.target.value)}>
							<option value="">Select Subject</option>
							{subjects.sort().map(subject => (
								<option key={subject}>{subject}</option>
							))}
						</select>
					</div>
				</div>

				<div className="flex flex-col w-full overflow-y-auto my-2 h-screen">
					{Object.entries(lessons_data || ({} as IlmxLessonVideos)).map(
						([lesson_id, lesson_meta]) => (
							<div
								className="flex items-center bg-gray-700 text-white rounded-md p-2 my-1 w-full"
								key={lesson_id}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="w-10"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<div className="flex flex-col w-full ml-2">
									<div className="text-sm">{lesson_meta.name}</div>
									<div
										className="text-gray-400 text-xs"
										style={{ fontSize: '10px' }}>
										Class: {getClassTitleFromLessonId(lesson_id)}-
										{getSubjectTitleFromLessonId(lesson_id)}
									</div>
								</div>

								<div
									className="flex rounded-full bg-blue p-2 max-h-8"
									onClick={() =>
										copyLink(
											`https://ilmexchange.com/library/${getLink(
												lesson_id
											)}/${lesson_meta.chapter_name &&
											encodeURI(lesson_meta.chapter_name)
											}`
										)
									}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
										/>
									</svg>
								</div>
							</div>
						)
					)}
				</div>
			</div>
		</div>
	)
}

export default LessonModal

const getFilteredData = (lessons: IlmxLessonVideos, class_title: string, subject: string) => {
	let lessonVideos

	for (let [id, lessonObj] of Object.entries(lessons || {})) {
		const s_title = getSubjectTitleFromLessonId(id)
		const c_title = getClassTitleFromLessonId(id)

		if (
			(subject ? s_title === subject : true) &&
			(class_title ? c_title === class_title : true)
		) {
			lessonVideos = {
				...(lessonVideos as IlmxLesson),
				[id]: lessonObj
			}
		}
	}
	return lessonVideos
}

const getClassSubjectsInfo = (lessons: IlmxLessonVideos) => {
	let class_titles = new Set<string>()
	let subjects: string[] = []
	for (let [id, lessonObj] of Object.entries(lessons || {})) {
		if (lessonObj.type === 'Video') {
			const class_title = getClassTitleFromLessonId(id)
			const subject = getSubjectTitleFromLessonId(id)
			class_titles.add(class_title)
			if (!subjects.includes(subject.trim())) {
				subjects.push(subject)
			}
		}
	}
	return { classTitles: [...class_titles], subjects: [...subjects] }
}

const getClassTitleFromLessonId = (lessonId: string): string => {
	return lessonId.split('-')[1] || 'nil'
}

const getSubjectTitleFromLessonId = (lessonId: string): string => {
	return lessonId.split('-')[2] || 'nil'
}
