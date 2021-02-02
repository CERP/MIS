import React from 'react'
import moment from 'moment'
import VideoWatchGraph from './videoWatchGraph'

interface P {
	events?: RootDBState['ilmx']['events']
}

type GraphData = {
	day: number
	watchCount: number
	watchTime: number
}

const IlmxGraphs: React.FC<P> = ({ events }) => {
	const lessons_data = computeViewedLessonsData(events)
	const graph_data = getGraphData(lessons_data)

	return <VideoWatchGraph graph_data={graph_data} />
}

export default IlmxGraphs

type ReduceEventsData = {
	[day: number]: {
		[lesson: string]: {
			watchCount: number
			watchTime: number
		}
	}
}

function computeViewedLessonsData(events: P['events']) {
	// for any whole week
	let agg: ReduceEventsData = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {} }

	const date_before_week = moment().subtract(6, 'days').unix() * 1000
	const date_for_today = moment.now()

	Object.entries(events || {}).forEach(([, lessons_history]) => {
		for (const [timestamp, item] of Object.entries(lessons_history)) {
			if (item.type === 'VIDEO') {
				const { lesson_id, duration } = item

				const lesson_watch_date = parseInt(timestamp)

				if (lesson_watch_date >= date_before_week && lesson_watch_date <= date_for_today) {
					const day_num = moment(lesson_watch_date).day()
					const day = day_num === 0 ? 7 : day_num

					if (agg[day]) {
						if (agg[day][lesson_id]) {
							agg[day][lesson_id] = {
								watchCount: agg[day][lesson_id].watchCount + 1,
								watchTime: agg[day][lesson_id].watchTime + duration,
							}
						} else {
							agg[day][lesson_id] = {
								watchCount: 1,
								watchTime: duration,
							}
						}
					}
				}
			}
		}
	})

	return agg
}

const getGraphData = (viewed_lesson_data: ReduceEventsData) => {
	return Object.entries(viewed_lesson_data).reduce<GraphData[]>(
		(agg, [day_num, viewed_lessons]) => {
			let counter = { watchCount: 0, watchTime: 0 }

			for (const item of Object.values(viewed_lessons)) {
				counter.watchCount += item.watchCount
				counter.watchTime += item.watchTime
			}

			return [
				...agg,
				{
					day: parseInt(day_num),
					...counter,
					watchTime: Math.floor(counter.watchTime / 60),
				},
			]
		},
		[]
	)
}
