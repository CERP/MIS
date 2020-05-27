import React, { Component } from 'react'
import Former from 'former'

type PropsType = {
	schoolList: string[]
	schoolLoginInfo: TrialsDataRow["value"]
	onGetSchoolInfo?: (school_id: string) => void
	onUpdateLoginStrategy?: (school_id: string, login_info: TrialsDataRow["value"]) => void
}

type S = {
	schoolId: string
	loginInfo: TrialsDataRow["value"]
}

class UpdateLoginStrategy extends Component<PropsType, S> {

	former: Former
	constructor(props: PropsType) {
		super(props)

		const loginInfo = this.props.schoolLoginInfo

		this.state = {
			schoolId: "",
			loginInfo
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
			</div>
		</>)
	}
}

export default UpdateLoginStrategy