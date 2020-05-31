import React from "react"

import data from 'constants/ilmexchange.json'

import './style.css'

type PropsType = {

}


type ReduceLessonMap = {
	[id: string]: {
		count: number
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
						count: agg[lesson_id].count + 1,
						duration: agg[lesson_id].duration + duration
					}
				} else {
					agg[lesson_id] = {
						count: 1,
						duration,
						// @ts-ignore
						...lessons_meta[lesson_id]
					}
				}
			}
		})

	return agg
}

const getSortedEntries = (videos_data: ReduceLessonMap) => {
	return Object.entries(videos_data)
		.sort(([, a], [_, b]) => b.count - a.count)
}

const getMostWatchCount = (sorted_entries: any) => {
	const [_, lesson_meta] = sorted_entries[0]
	return lesson_meta ? lesson_meta.count : 0
}

const IlmExchangeAnalytics: React.FC<PropsType> = ({ }) => {

	const computed_videos_data: ReduceLessonMap = computeVideosData()

	const sorted_entries = getSortedEntries(computed_videos_data)
	const most_watch_count = getMostWatchCount(sorted_entries)

	return (
		<div className="section-container">
			<div className="divider">IlmExchange Analytics</div>
			<div className="text-left" style={{ marginTop: 4, marginBottom: 4, fontSize: "1.25rem" }}>Most viewed videos</div>
			<div className="section">
				<table style={{ width: "100%" }}>
					<tbody>
						{
							sorted_entries
								.map(([lesson_id, lesson_meta]) => {
									return <tr key={lesson_id}>
										<td>{lesson_meta.title}</td>
										<td><progress max={most_watch_count} value={lesson_meta.count} /></td>
										<td>{lesson_meta.count} Views</td>
									</tr>
								})
						}
					</tbody>
				</table>

			</div>
		</div>
	)

}

export default IlmExchangeAnalytics