import React, { useState, useEffect } from "react"
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import data from 'constants/ilmexchange.json'
import { fetchLessons } from 'actions/core'
import Modal from "components/Modal/index"
import LessonViewerModal from './lessonViewer'
import { PlayIcon } from 'assets/icons'

import './style.css'

interface PropsType {
	dispatch: Function
	students: RootDBState["students"]
	events: RootDBState["ilmx"]["events"]
	lessons: RootDBState["ilmx"]["lessons"]
	isLoading: boolean
	hasError: boolean
}

interface S {
	showViewerModal: boolean
	lessonId: string
}

const IlmExchangeAnalytics: React.FC<PropsType> = ({ students, events, lessons, isLoading, hasError, dispatch }) => {

	// useEffect(() => {
	// 	dispatch(fetchLessons())
	// }, [dispatch])

	const computed_lesson_data: AugmentedIlmxLessons = computeLessonsData(events, lessons)
	const sorted_entries = getSortedEntries(computed_lesson_data)

	const [stateProps, setStateProps] = useState<S>({
		showViewerModal: false,
		lessonId: ""
	})

	const handleClickShowViewers = (lesson_id: string) => {
		setStateProps({
			...stateProps,
			showViewerModal: !stateProps.showViewerModal,
			lessonId: lesson_id
		})
	}

	const handleToggleModal = () => {
		setStateProps({
			...stateProps,
			showViewerModal: !stateProps.showViewerModal,
			lessonId: ''
		})
	}

	return (
		<div className="section-container">
			<div className="divider">IlmExchange Analytics</div>
			<div className="text-left" style={{ marginTop: 4, marginBottom: 4, fontSize: "1.25rem" }}>Most viewed videos</div>
			<div className="section">
				<div className="ilmx-analytics container">
					{
						sorted_entries
							.map(([lesson_id, lesson_meta]) => {
								return <div className="card" key={lesson_id}>
									<div className="card-row">
										<div className="card-row inner">
											<img src={PlayIcon} alt="play-icon" height="24" width="24" />
											<p className="lesson-title">{lesson_meta.title}</p>
										</div>
										<div style={{ marginLeft: "auto" }}>
											<p className="views viewer" onClick={() => handleClickShowViewers(lesson_id)}>{lesson_meta.watchCount} views</p>
										</div>
									</div>
									<div className="card-row">
										<div className="more-detail">
											<p className="hidden-views viewer" onClick={() => handleClickShowViewers(lesson_id)}>{lesson_meta.watchCount} views</p>
											<p>Watch Duration: {getDurationString(lesson_meta.watchDuration)}</p>
										</div>
									</div>
								</div>
							})
					}
					{
						stateProps.showViewerModal && <Modal>
							<LessonViewerModal
								lessonId={stateProps.lessonId}
								lessons={computed_lesson_data}
								students={students}
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
	events: state.db.ilmx.events,
	lessons: state.db.ilmx.lessons,
	isLoading: state.ilmxLessons.isLoading,
	hasError: state.ilmxLessons.hasError
}))(IlmExchangeAnalytics)

type AugmentedIlmxLessons = {
	[id: string]: {
		watchCount: number
		watchDuration: number
		viewers: Array<string>
	} & IlmxLesson
}

function computeLessonsData(events: PropsType["events"], lessons: PropsType["lessons"]) {

	const lessons_meta = data["lessons"]

	let agg: AugmentedIlmxLessons = {}

	Object.entries(data["events"])
		.forEach(([_, lessons]) => {

			for (const item of Object.values(lessons)) {

				const { lesson_id, duration, student_id } = item

				if (agg[lesson_id]) {

					const unique_viewers = [...new Set(agg[lesson_id].viewers).add(student_id)]

					agg[lesson_id] = {
						...agg[lesson_id],
						watchCount: agg[lesson_id].watchCount + 1,
						watchDuration: agg[lesson_id].watchDuration + duration,
						viewers: unique_viewers
					}
				} else {
					agg[lesson_id] = {
						watchCount: 1,
						watchDuration: duration,
						// @ts-ignore
						...lessons_meta[lesson_id],
						viewers: new Array(student_id)
					}
				}
			}
		})

	return agg
}

const getSortedEntries = (videos_data: AugmentedIlmxLessons) => {
	return Object.entries(videos_data)
		.sort(([, a], [_, b]) => b.watchCount - a.watchCount)
}

const getDurationString = (duration: number): string => {

	const duration_in_mins = duration / 60

	if (duration_in_mins === 0) {
		return "0 mins"
	}

	if (duration_in_mins > 0 && duration_in_mins < 1) {
		return "1 mins"
	}

	return `${duration_in_mins.toFixed(0)} mins`
}