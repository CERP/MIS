import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getSchoolList, updateSchoolInfo, getSchoolInfo, giveTipAccess, giveTipPilotAccess } from 'actions'
import { RouteComponentProps } from 'react-router'
import Former from 'former'
import { hash } from 'utils'
import moment from 'moment'


interface P {
	schoolList: string[]
	trial_info: RootReducerState["school_Info"]["trial_info"]
	student_info: RootReducerState["school_Info"]["student_info"]
	meta: RootReducerState["school_Info"]["meta"]
	targeted_instruction_access: RootReducerState["school_Info"]["targeted_instruction_access"]
	tip_pilot: RootReducerState["school_Info"]["tip_pilot"]

	giveTipAccess: (school_id: string, TIP_access: boolean) => any
	giveTipPilotAccess: (school_id: string, tip_pilot: boolean) => any
	getSchoolList: () => any
	updateSchoolInfo: (school_id: string, student_limit: number, paid: boolean, trial_period: number, date: number) => any
	getSchoolInfo: (school_id: string) => any
}

interface S {
	selectedSchool: string
	purchasePassword: string
	resetPassword: string
	misPackage: "" | "TALEEM1" | "TALEEM2" | "UNLIMITED"
	trial_period: string
	paid: string
	date: number
	student_limit: number
	updateMenu: boolean
	infoMenu: boolean
	TIP_access: boolean
	tip_pilot: boolean
}

interface routeInfo {

}

type propTypes = RouteComponentProps<routeInfo> & P

class AdminActions extends Component<propTypes, S> {

	former: Former
	constructor(props: propTypes) {
		super(props)

		this.state = {
			selectedSchool: "",
			purchasePassword: "123",
			resetPassword: "456",
			misPackage: "",
			trial_period: "0",
			paid: "",
			date: 0,
			student_limit: 0,
			updateMenu: false,
			infoMenu: false,
			TIP_access: false,
			tip_pilot: false
		}

		this.former = new Former(this, [])
	}

	getLimitFromPackage = (package_name: string) => {
		switch (package_name) {
			case "TALEEM1":
				return 150
			case "TALEEM2":
				return 300
			default:
				return -1
		}
	}

	getPackageFromLimit = (limit: number) => {
		switch (limit) {
			case 150:
				return "TALEEM1"
			case 300:
				return "TALEEM2"
			case -1:
				return "UNLIMITED"
			default:
				return ""
		}
	}

	componentDidMount() {
		this.props.getSchoolList()
	}

	getCodes = async () => {

		const { selectedSchool } = this.state

		const resetPassword = await hash(`reset-${selectedSchool}-${moment().format("MMDDYYYY")}`)
			.then(res => res.substr(0, 4).toLowerCase())

		const purchasePassword = await hash(`buy-${selectedSchool}-${moment().format("MMDDYYYY")}`)
			.then(res => res.substr(0, 4).toLowerCase())

		this.setState({
			resetPassword,
			purchasePassword
		})
	}

	getSetStuff = () => {
		this.getCodes()

		this.props.getSchoolInfo(this.state.selectedSchool)
	}

	componentWillReceiveProps = (nextProps: propTypes) => {
		if (nextProps.meta) {
			this.setState({
				infoMenu: true,
				TIP_access: nextProps.targeted_instruction_access,
				tip_pilot: nextProps.tip_pilot
			})
		}
	}

	onSave = () => {

		const { selectedSchool, misPackage, paid, trial_period, date } = this.state

		if (misPackage === "" || paid === "" || !date) {
			window.alert("Please Fill All info")
			return
		}

		this.props.updateSchoolInfo(selectedSchool, this.getLimitFromPackage(misPackage), paid === "true" ? true : false, parseFloat(trial_period), date)
	}

	onSaveTipInfo = () => {

		const { selectedSchool, TIP_access } = this.state
		this.props.giveTipAccess(selectedSchool, TIP_access)
	}

	onSaveTipPilotInfo = () => {
		const { selectedSchool, tip_pilot } = this.state
		this.props.giveTipPilotAccess(selectedSchool, tip_pilot)
	}

	render() {

		const student_info = this.props.student_info
		const trial_info = this.props.trial_info
		const meta = this.props.meta

		const trial_period = (trial_info && trial_info.trial_period) || 0
		const paid = trial_info && trial_info.paid ? "true" : "false"
		const date = (trial_info && trial_info.date) || -1
		const student_limit = (student_info && student_info.max_limit) || 0

		const { schoolList } = this.props
		const { selectedSchool, resetPassword, purchasePassword } = this.state

		return <div className="page admin-actions">
			<div className="title"> Admin Actions</div>

			<div className="section form" style={{ width: "75%" }}>
				<div className="divider">Reset/Purchase Code</div>
				<div className="row">
					<label>Select School</label>
					<datalist id="schools">
						{
							schoolList.map(s => <option value={s} key={s}>{s}</option>)
						}
					</datalist>
					<input list="schools" {...this.former.super_handle(["selectedSchool"])} />
				</div>
				<div className="button blue" onClick={() => this.getSetStuff()}>LOAD</div>
			</div>

			{this.state.infoMenu && <div className="section form" style={{ width: "75%" }}>
				<div className="divider"> Field Info </div>
				<div className="row">
					<label> Field Manager</label>
					<div>{meta && meta.area_manager_name}</div>
				</div>
				<div className="row">
					<label> Agent Name </label>
					<div>{meta && meta.agent_name}</div>
				</div>
				<div className="row">
					<label> City</label>
					<div>{meta && meta.office}</div>
				</div>
				<div className="row">
					<label> Strategy</label>
					<div>{meta && meta.type_of_login}</div>
				</div>
				<div className="row">
					<label> Notes</label>
					<div>{meta && meta.notes}</div>
				</div>
				<div className="divider">School Info</div>
				<div className="row">
					<label>Trial Start Date</label>
					<div>{date !== -1 ? moment(date).format("MM-DD-YYYY") : "Not Set"}</div>
				</div>
				<div className="row">
					<label>Status</label>
					<div>{paid === "true" ? "PAID Customer" : "Trial User"}</div>
				</div>
				<div className="row">
					<label>Student Limit</label>
					<div>{student_limit === -1 ? "Unlimited" : this.state.student_limit}</div>
				</div>
				<div className="row">
					<label>Trial Period</label>
					<div>{trial_period} Days</div>
				</div>
				<div className="divider"> Codes </div>
				<div className="row">
					<label>Reset Code:</label>
					<div>{resetPassword}</div>
				</div>
				<div className="row">
					<label>Purchase Code:</label>
					<div> {purchasePassword} </div>
				</div>
				{selectedSchool && !this.state.updateMenu && <div className="button blue" onClick={() => this.setState({ updateMenu: !this.state.updateMenu })}>Update</div>}
			</div>}
			{selectedSchool && this.state.updateMenu && <div className="section form" style={{ width: "75%" }}>
				<div className="button red" onClick={() => this.setState({ updateMenu: !this.state.updateMenu })}>Cancel Update</div>
				<div className="divider">Update Info</div>
				<div className="row">
					<label>Status</label>
					<select {...this.former.super_handle(["paid"])}>
						<option value="">Not Set</option>
						<option value="true">Paid</option>
						<option value="false">Not Paid</option>
					</select>
				</div>
				<div className="row">
					<label>Package</label>
					<select {...this.former.super_handle(["misPackage"])}>
						<option value="">Not Set</option>
						<option value="TALEEM1">Taleem 1</option>
						<option value="TALEEM2">Taleem 2</option>
						<option value="UNLIMITED">Taleem 3</option>
					</select>
				</div>
				<div className="row">
					<label>Trial Period(days)</label>
					<input type="number" onChange={this.former.handle(["trial_period"])} />
				</div>
				<div className="row">
					<label>Trial Start Date</label>
					<input type="date" onChange={this.former.handle(["date"])} />
				</div>
				<div className="button save" onClick={() => this.onSave()}> Save </div>
			</div>}
			{selectedSchool && this.state.updateMenu && <div className="section form" style={{ width: "75%" }}>
				<div className="divider"> Targeted Instruction </div>
				<div className="row">
					<label>Access:</label>
					<div>
						<label className="switch">
							<input type="checkbox" checked={this.state.TIP_access} onChange={() => this.setState({ TIP_access: !this.state.TIP_access })} />
							<span className="toggleSlider round"></span>
						</label>
					</div>
				</div>
				<div className="button save" onClick={() => this.onSaveTipInfo()}> Save </div>
			</div>}
			{selectedSchool && this.state.updateMenu && <div className="section form" style={{ width: "75%" }}>
				<div className="divider"> TIP Pilot </div>
				<div className="row">
					<label>Access:</label>
					<div>
						<label className="switch">
							<input type="checkbox" checked={this.state.tip_pilot} onChange={() => this.setState({ tip_pilot: !this.state.tip_pilot })} />
							<span className="toggleSlider round"></span>
						</label>
					</div>
				</div>
				<div className="button save" onClick={() => this.onSaveTipPilotInfo()}> Save </div>
			</div>}
		</div>
	}
}
export default connect((state: RootReducerState) => ({
	schoolList: state.school_Info.school_list,
	trial_info: state.school_Info.trial_info,
	student_info: state.school_Info.student_info,
	meta: state.school_Info.meta,
	targeted_instruction_access: state.school_Info.targeted_instruction_access,
	tip_pilot: state.school_Info.tip_pilot
}), (dispatch: Function) => ({
	getSchoolList: () => dispatch(getSchoolList()),
	giveTipAccess: (school_id: string, TIP_access: boolean) => dispatch(giveTipAccess(school_id, TIP_access)),
	giveTipPilotAccess: (school_id: string, tip_pilot: boolean) => dispatch(giveTipPilotAccess(school_id, tip_pilot)),
	getSchoolInfo: (school_id: string) => dispatch(getSchoolInfo(school_id)),
	updateSchoolInfo: (school_id: string, student_limit: number, paid: boolean, trial_period: number, date: number) => dispatch(updateSchoolInfo(school_id, student_limit, paid, trial_period, date))
}))(AdminActions)