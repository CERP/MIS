import React, { useState, useMemo } from 'react'
import { ArrowLeftIcon, ClipboardCopyIcon, PlayIcon } from '@heroicons/react/outline'

interface LessonModalProps {
	lessons: IlmxLessonVideos
	isLoading: boolean
	onClose: () => void
}

const LessonModal: React.FC<LessonModalProps> = ({ lessons, onClose }) => {
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
		window.alert('Copied')
	}

	const getLink = (link: string) => {
		const manipulatedLink = link.replace(/-/g, '/')
		const finalLink = encodeURI(manipulatedLink.slice(0, -2))
		return finalLink
	}

	return (
		<div className="bg-white p-4 w-full rounded-2xl">
			<div className="flex items-center justify-between flex-row my-4">
				<ArrowLeftIcon
					onClick={onClose}
					className="text-red-brand bg-white w-8 h-8 p-1 border-2 border-red-brand shadow-sm rounded-full cursor-pointer"
				/>
				<div className="text-lg font-semibold ml-4 text-center">
					Add Video Lectures to Diary
				</div>
				<div />
			</div>
			<div className="form scrollbar">
				<div className="flex w-full video-filter">
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

				<div className="flex flex-col w-full overflow-y-auto my-2">
					{Object.entries(lessons_data ?? ({} as IlmxLessonVideos)).map(
						([lesson_id, lesson_meta]) => (
							<div
								className="flex items-center bg-gray-700 text-white rounded-md p-2 my-1 w-full"
								key={lesson_id}>
								<PlayIcon className="w-10" />
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
									className="flex rounded-full bg-blue p-2 max-h-8 cursor-pointer"
									onClick={() =>
										copyLink(
											`https://ilmexchange.com/library/${getLink(
												lesson_id
											)}/${lesson_meta.chapter_name &&
											encodeURI(lesson_meta.chapter_name)
											}`
										)
									}>
									<ClipboardCopyIcon className="h-4 w-4" />
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

	for (let [id, lessonObj] of Object.entries(lessons ?? {})) {
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
	for (let [id, lessonObj] of Object.entries(lessons ?? {})) {
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
	return lessonId.split('-')[1] ?? 'nil'
}

const getSubjectTitleFromLessonId = (lessonId: string): string => {
	return lessonId.split('-')[2] ?? 'nil'
}
