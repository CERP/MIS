import React, { useState, useEffect } from "react"
import { connect } from 'react-redux'

import { fetchLessons } from 'actions/core'
import { getTimeString } from "utils/helpers"
import Modal from "components/Modal/index"
import LessonViewerModal from './lessonViewer'
import { PlayIcon } from 'assets/icons'

import './style.css'

interface PropsType {
	students: RootDBState["students"]
	classes: RootDBState["classes"]
	events: RootDBState["ilmx"]["events"]
	lessons: RootDBState["ilmx"]["lessons"]
	isLoading: boolean
	hasError: boolean
	fetchLessons: () => void
}

interface S {
	showViewerModal: boolean
	lessonId: string
	scrollY: number
}

const IlmExchangeAnalytics: React.FC<PropsType> = ({ students, events, lessons, fetchLessons, classes }) => {

	useEffect(() => {
		fetchLessons()
	}, [fetchLessons])

	const computed_lessons_data: AugmentedIlmxLessons = computeLessonsData(events, lessons)
	const sorted_entries = getSortedEntries(computed_lessons_data)

	const [stateProps, setStateProps] = useState<S>({
		showViewerModal: false,
		lessonId: "",
		scrollY: 0,
	})

	const handleClickShowViewers = (lesson_id: string) => {

		const scrollY = window.pageYOffset

		setStateProps({
			...stateProps,
			showViewerModal: !stateProps.showViewerModal,
			lessonId: lesson_id,
			scrollY: scrollY
		})

		document.body.style.position = 'fixed'
	}

	const handleToggleModal = () => {
		setStateProps({
			...stateProps,
			showViewerModal: !stateProps.showViewerModal,
			lessonId: ''
		})

		document.body.style.position = ''
		window.scrollTo(0, stateProps.scrollY)
	}

	return (
		<div className="section-container">
			<div className="divider">IlmExchange Analytics</div>
			<div className="text-left" style={{ marginTop: 4, marginBottom: 4, fontSize: "1.25rem" }}>Most viewed videos</div>
			<div className="section">
				<div className="ilmx-analytics container">
					{
						sorted_entries
							.map(([lesson_id, lesson_meta]) => (
								<div className="card" key={lesson_id}>
									<div className="card-row">
										<div className="card-row inner">
											<img src={PlayIcon} alt="play-icon" height="24" width="24" />
											<p className="card-title">{lesson_meta.name}</p>
										</div>
										<div style={{ marginLeft: "auto" }}>
											<p className="views viewer" onClick={() => handleClickShowViewers(lesson_id)}>{lesson_meta.watchCount} views</p>
										</div>
									</div>
									<div className="card-row">
										<p className="student-class-title">Class: {getClassTitleFromLessonId(lesson_id)}-{getBookTitleFromLessonId(lesson_id)}</p>
									</div>
									<div className="card-row">
										<div className="more-detail">
											<p>watch time: {getTimeString(lesson_meta.watchDuration)}</p>
											<p className="hidden-views viewer"
												style={{ marginLeft: "auto" }}
												onClick={() => handleClickShowViewers(lesson_id)}>{lesson_meta.watchCount} views</p>
										</div>
									</div>
								</div>
							))
					}
					{
						stateProps.showViewerModal && computed_lessons_data && <Modal>
							<LessonViewerModal
								lessonId={stateProps.lessonId}
								lessons={computed_lessons_data}
								students={students}
								classes={classes}
								onClose={handleToggleModal} />
						</Modal>
					}
				</div>
			</div>
		</div>
	)

}

export default connect((state: RootReducerState) => ({
	students: state.db.students,
	classes: state.db.classes,
	events: state.db.ilmx.events,
	lessons: state.db.ilmx.lessons,
	isLoading: state.ilmxLessons.isLoading,
	hasError: state.ilmxLessons.hasError
}), (dispatch: Function) => ({
	fetchLessons: () => dispatch(fetchLessons())
}))(IlmExchangeAnalytics)

type AugmentedIlmxLessons = {
	[id: string]: AugmentedIlmxLesson
}

function computeLessonsData(events: PropsType["events"], lessons: PropsType["lessons"]) {

	let agg: AugmentedIlmxLessons = {}

	const lessons_meta = lessons || {}

	if (!lessons_meta) {
		return agg
	}

	Object.entries(events || {})
		.forEach(([_, lessons_history]) => {

			for (const item of Object.values(lessons_history)) {
				if (item.type === "VIDEO") {

					const { lesson_id, duration, student_id } = item

					if (agg[lesson_id]) {

						agg[lesson_id] = {
							...agg[lesson_id],
							watchCount: agg[lesson_id].watchCount + 1,
							watchDuration: agg[lesson_id].watchDuration + duration,
							viewers: {
								...agg[lesson_id].viewers,
								[student_id]: {
									watchCount: agg[lesson_id].viewers[student_id] ? agg[lesson_id].viewers[student_id].watchCount + 1 : 1,
									watchDuration: agg[lesson_id].viewers[student_id] ? agg[lesson_id].viewers[student_id].watchDuration + duration : duration
								}
							}
						}
					} else {
						agg[lesson_id] = {
							watchCount: 1,
							watchDuration: duration,
							// @ts-ignore
							...lessons_meta[lesson_id],
							viewers: {
								[student_id]: {
									watchCount: 1,
									watchDuration: duration
								}
							}
						}
					}
				}
			}
		})

	return agg
}

const getSortedEntries = (lessons_data: AugmentedIlmxLessons) => {
	return Object.entries(lessons_data)
		.sort(([, a], [_, b]) => b.watchCount - a.watchCount)
}

const getClassTitleFromLessonId = (lessonId: string): string => {
	return lessonId.split("-")[1] || "nil"
}
const getBookTitleFromLessonId = (lessonId: string): string => {
	return lessonId.split("-")[2] || "nil"
}