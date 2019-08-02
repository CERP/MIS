import * as React from 'react'
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line } from 'recharts'

import '../style.css'
import { getEndPointResource } from '../../../utils/getEndPointResource';
import { loadAuth } from '../../../utils/localStorage';

interface P {
	school_id: string
	start_date: string
	end_date: string
}

interface DataRow {
	teachers_marked: number
	school_id: string
	date: string
}

interface S {
	data: DataRow[],
	loading: boolean
}

class SMS extends React.Component<P, S> {

	constructor(props: P) {
		super(props);

		this.state = {
			data: [],
			loading: false
		}
	}

	componentDidMount() {

		const {school_id, start_date, end_date } = this.props

		getEndPointResource("sms",school_id, start_date,end_date)
			.then(res => res.json())
			.then(parsed => {
				this.setState({
					data: parsed.data
				})
			})
			.catch(err => {
				console.error(err)
			})
	}

	componentWillReceiveProps (newProps: P) {

		const {school_id, start_date, end_date } = newProps

		if(school_id !== this.props.school_id) {
			this.setState({
				data: [],
				loading: true
			})
		}

		getEndPointResource("sms",school_id, start_date,end_date)
			.then(res => res.json())
			.then(parsed => {
				this.setState({
					data: parsed.data,
					loading: false
				})
			})
			.catch(err => {
				console.error(err)
			})
	}

	render() {

		return <div className="stat-card">
			{ this.state.loading && <div> Loading....</div> }
			<ResponsiveContainer width="90%" height={300}>
				<LineChart data={this.state.data}>
					<XAxis dataKey="date" />
					<YAxis />
					<Tooltip />

					<Line dataKey="sms_usage" />
				</LineChart>

			</ResponsiveContainer>
		</div>
	}
}

export default SMS;