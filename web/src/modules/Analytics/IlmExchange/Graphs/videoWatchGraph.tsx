import React from 'react'
import {
	LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label
} from 'recharts'

interface P {
	graph_data: GraphData[]
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

type GraphData = {
	day: number
	watchCount: number
	watchTime: number
}

const VideoWatchGraph: React.FC<P> = ({ graph_data }) => {

	const max_watched_lesson_time = getMaxWatchTime(graph_data)

	return (
		<div style={{ fontSize: "0.95rem" }}>
			<ResponsiveContainer width={"100%"} height={280} >
				<LineChart
					data={graph_data}
					margin={{
						top: 10, right: 30, left: 10, bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="day">
						<Label value="Days" offset={0} position="insideBottom" />
					</XAxis>
					<YAxis type="number" domain={[0, max_watched_lesson_time]} allowDecimals={false}>
						<Label value="Time(m)" offset={0} position="left" angle={-90} />
					</YAxis>
					<Tooltip content={PointLabel} />
					<Line isAnimationActive={false} type="monotone" strokeWidth={2} fill="#1bb4bb" stroke="#1bb4bb" dataKey="watchTime"
						activeDot={{ fill: '#1bb4bb', stroke: '#fff', strokeWidth: 3, r: 8 }}
						dot={{ fill: '#1bb4bb', stroke: '#fff', strokeWidth: 2, r: 6 }}
					/>

				</LineChart>
			</ResponsiveContainer>
		</div>
	)
}

export default VideoWatchGraph


interface PointLabelProps {
	payload: { payload: GraphData }[]
	active: boolean
}

const PointLabel: React.FC<PointLabelProps> = ({ payload, active }) => {

	if (active) {
		const item = payload[0].payload
		return <div className="ilmx custom-tooltip">
			<div className="row" style={{ width: "100%" }}>
				<label>Day:</label>
				<div>{days[item.day - 1]}</div>
			</div>
			<div className="row" style={{ width: "100%" }}>
				<label>Views:</label>
				<div>{item.watchCount}</div>
			</div>
			<div className="row" style={{ width: "100%" }}>
				<label>Watch Time:</label>
				<div>{item.watchTime}m</div>
			</div>
		</div>
	}
}


const getMaxWatchTime = (graph_data: GraphData[]) => {
	const most_watched_lesson = graph_data.slice(-1)[0]
	return most_watched_lesson ? most_watched_lesson.watchTime : 0
}
