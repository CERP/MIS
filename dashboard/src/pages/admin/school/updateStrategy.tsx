import React, { useState, Component } from 'react'
import Former from 'former'

type PropsType = {
	schoolList: string[]
	onGetSchoolInfo?: (school_id: string) => void
	onUpdateLoginStrategy?: (school_id: string, password: string) => void
}

type S = {
	schoolId: string
}

class UpdateLoginStrategy extends Component<PropsType, S> {

	former: Former
	constructor(props: PropsType) {
		super(props)

		this.state = {
			schoolId: ""
		}

		this.former = new Former(this, [])
	}

	render() {

		const { schoolList, onGetSchoolInfo, onUpdateLoginStrategy } = this.props

		const { schoolId } = this.state

		return (<>
			<div className="title"> Update Login Strategy</div>
			<div className="section form" style={{ width: "75%" }}>
				<div className="row">
					<label>Select School</label>
					<datalist id="schools">
						{
							schoolList.map(s => <option value={s} key={s}>{s}</option>)
						}
					</datalist>
					<input list="schools" {...this.former.super_handle(["schoolId"])} placeholder="Type or Select School" />
				</div>
				<div className="button blue">Get School Info</div>
			</div>
		</>)
	}
}

export default UpdateLoginStrategy