import React, { Component } from 'react'
import Former from 'former'
import checkCompulsoryFields from 'utils/checkCompulsoryFields'
import {
	getAgentList,
	getDistrictList,
	getAreaManagerList,
	getStrategies
} from 'constants/mislogin'

type PropsType = {
	schoolList: string[]
	schoolLoginInfo: SchoolLoginInfo
	getSchoolInfo: (school_id: string) => void
	updateLoginInfo: (school_id: string, login_info: SchoolLoginInfo) => void
}

type S = {
	schoolId: string
	schoolLoginInfo: SchoolLoginInfo
}

class UpdateLoginInfo extends Component<PropsType, S> {

	former: Former
	constructor(props: PropsType) {
		super(props)

		this.state = {
			schoolId: "",
			schoolLoginInfo: {
				agent_name: "",
				area_manager_name: "",
				association_name: "",
				city: "",
				notes: "",
				office: "",
				owner_easypaisa_number: "",
				owner_name: "",
				owner_phone: "",
				package_name: "",
				school_name: "",
				school_type: "URBAN",
				type_of_login: ""
			}
		}

		this.former = new Former(this, [], [
			{
				path: ["schoolLoginInfo", "school_name"],
				value: "",
				depends: [
					"OR",
					{
						path: ["schoolLoginInfo", "type_of_login"],
						value: "SCHOOL_REFERRAL"
					},
					{
						path: ["schoolLoginInfo", "type_of_login"],
						value: "AGENT_SCHOOL"
					}
				]
			},
			{
				path: ["schoolLoginInfo", "association_name"],
				value: "",
				depends: [
					{
						path: ["schoolLoginInfo", "type_of_login"],
						value: "ASSOCIATION"
					}
				]
			},
			{
				path: ["schoolLoginInfo", "agent_name"],
				value: "",
				depends: [
					"OR",
					{
						path: ["schoolLoginInfo", "type_of_login"],
						value: "AGENT"
					},
					{
						path: ["schoolLoginInfo", "type_of_login"],
						value: "AGENT_SCHOOL"
					}
				]
			}
		])
	}

	componentDidUpdate(prevProps: PropsType) {
		if (JSON.stringify(this.props.schoolLoginInfo) !== JSON.stringify(prevProps.schoolLoginInfo)) {

			this.setState({
				...this.state,
				schoolLoginInfo: this.props.schoolLoginInfo
			})
		}
	}

	updateSchoolLoginInfo = () => {

		const { schoolId, schoolLoginInfo } = this.state

		if (schoolId) {

			const compulsory_fields = checkCompulsoryFields(schoolLoginInfo,
				[
					["area_manager_name"],
					["office"],
					["city"],
					["type_of_login"]
				]
			)

			if (compulsory_fields) {
				const error = `Please Fill ${(compulsory_fields as string[][]).map(x => x[0].replace("_", " ")).join(", ")} !`
				return window.alert(error)
			}

			this.props.updateLoginInfo(schoolId, schoolLoginInfo)
			return
		}

	}

	render() {

		const { schoolList, getSchoolInfo } = this.props

		const { schoolId } = this.state

		return (<>
			<div className="title"> Update School Login</div>
			<div className="section form" style={{ width: "75%" }}>
				<div className="row">
					<label>Select School</label>
					<datalist id="schools">
						{
							schoolList
								.map(school_id => <option value={school_id} key={school_id}>{school_id}</option>)
						}
					</datalist>
					<input list="schools" {...this.former.super_handle(["schoolId"])} placeholder="Type or Select School" />
				</div>

				<div className="button blue" style={{ marginBottom: "0.5rem" }} onClick={() => getSchoolInfo(schoolId)}>Get School Login Info</div>

				<div className="section form">
					<div className="row">
						<label>Area Manager <Span /></label>
						<select {...this.former.super_handle(["schoolLoginInfo", "area_manager_name"])}>
							<option value="">Select Manager</option>
							{
								[...getAreaManagerList()]
									.sort()
									.map(manager => {
										const mgr = manager.replace(' ', "_").toUpperCase()
										return <option key={mgr} value={mgr}>{manager}</option>
									})
							}
						</select>
					</div>
					<div className="row">
						<label>District <Span /></label>
						<select {...this.former.super_handle(["schoolLoginInfo", "office"])}>
							<option value="">Select District</option>
							{
								[...getDistrictList()]
									.sort()
									.map(district => <option key={district} value={district.toUpperCase()}>{district}</option>)
							}
							<option value="OTHER">Other</option>
						</select>
					</div>

					<div className="row">
						<label>District <Span /></label>
						<input type="text" {...this.former.super_handle(["schoolLoginInfo", "city"])} placeholder="city" />
					</div>

					<div className="row">
						<label>Strategy <Span /></label>
						<select {...this.former.super_handle(["schoolLoginInfo", "type_of_login"])}>
							<option value="">Select Strategy</option>
							{
								[...getStrategies()]
									.sort()
									.map(strategy => {
										const str = strategy.replace(' ', "_").toUpperCase()
										return <option key={str} value={str}>{strategy}</option>
									})
							}
						</select>
					</div>
				</div>

				{this.former.check(["schoolLoginInfo", "school_name"]) && <div className="section form">
					<div className="divider"> Referral School Information </div>

					<div className="row">
						<label>School Name <Span /></label>
						<input list="schl-list" {...this.former.super_handle(["schoolLoginInfo", "school_name"])} placeholder="school name" />
						<datalist id="schl-list">
							{
								this.props.schoolList.map(s => <option key={s} value={s} />)
							}
						</datalist>
					</div>

					<div className="row">
						<label>Owner Easy Paisa <Span /></label>
						<input type="number" {...this.former.super_handle(["schoolLoginInfo", "owner_easypaisa_number"])} placeholder="Easy Paisa" />
					</div>
				</div>}

				{this.former.check(["schoolLoginInfo", "association_name"]) && <div className="section form">
					<div className="divider">Association Information</div>
					<div className="row">
						<label>Association <Span /></label>
						<input type="text" {...this.former.super_handle(["schoolLoginInfo", "association_name"])} placeholder="Association Name" />
					</div>
				</div>}

				{this.former.check(["schoolLoginInfo", "agent_name"]) && <div className="section form">
					<div className="divider">Agent Information <Span /></div>
					<div className="row">
						<label>Agent Name</label>
						<select {...this.former.super_handle(["schoolLoginInfo", "agent_name"])}>
							<option value="">Select Agent</option>
							{
								[...getAgentList()]
									.sort()
									.map(agent => <option key={agent} value={agent}>{agent}</option>)
							}

						</select>
					</div>

				</div>}

				<div className="button blue" style={{ marginTop: "0.5rem" }} onClick={() => this.updateSchoolLoginInfo()}>Update School Login Info</div>

			</div>
		</>)
	}
}

export default UpdateLoginInfo

const Span = () => <span style={{ color: "red" }}>*</span>