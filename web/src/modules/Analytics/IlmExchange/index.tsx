import React from "react"
import { connect } from 'react-redux'

import { PlayIcon } from 'assets/icons'

import data from 'constants/ilmexchange.json'

import './style.css'

type PropsType = {

}

type ReduceLessonMap = {
	[id: string]: {
		watchCount: number
		duration: number
		title: string
		type: string
		utl: string
		chapter_name: string
	}
}

function computeVideosData() {

	const lessons_meta = data["lessons"]

	let agg: ReduceLessonMap = {}

	Object.entries(data["events"])
		.forEach(([_, lessons]) => {

			for (const item of Object.values(lessons)) {

				const { lesson_id, duration } = item

				if (agg[lesson_id]) {
					agg[lesson_id] = {
						...agg[lesson_id],
						watchCount: agg[lesson_id].watchCount + 1,
						duration: agg[lesson_id].duration + duration
					}
				} else {
					agg[lesson_id] = {
						watchCount: 1,
						duration,
						// @ts-ignore
						...lessons_meta[lesson_id]
					}
				}
			}
		})

	return agg
}

const IlmExchangeAnalytics: React.FC<PropsType> = () => {

	const computed_videos_data: ReduceLessonMap = computeVideosData()

	const sorted_entries = getSortedEntries(computed_videos_data)

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
											<p className="views">{lesson_meta.watchCount} views</p>
										</div>
									</div>
									<div className="card-row">
										<div className="more-detail">
											<p className="hidden-views">{lesson_meta.watchCount} views</p>
											<p>Watch Duration: {getDurationString(lesson_meta.duration)}</p>
										</div>
									</div>
								</div>
							})
					}

				</div>
			</div>
		</div>
	)

}

export default connect((state: RootReducerState) => ({

}))(IlmExchangeAnalytics)


const getSortedEntries = (videos_data: ReduceLessonMap) => {
	return Object.entries(videos_data)
		.sort(([, a], [_, b]) => b.watchCount - a.watchCount)
}

const getDurationString = (duration: number): string => {

	const duration_mins = duration / 60

	if (duration_mins === 0) {
		return "0 min"
	}

	if (duration_mins > 0 && duration_mins < 1) {
		return "approx 1 min"
	}

	return `${duration_mins.toFixed(0)} mins`
}