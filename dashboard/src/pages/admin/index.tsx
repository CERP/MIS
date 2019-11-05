import React, { Component } from 'react'
import { connect } from 'react-redux'
import { schoolInfo } from 'actions'
import { RouteComponentProps } from 'react-router'
import Former from 'former'
import { hash } from 'utils'
import moment from 'moment'


interface P {
	schoolList: string[]
	schoolInfo: () => any
}

interface S {
	selectedSchool: string
	purchasePassword: string
	resetPassword: string
}

interface routeInfo {

}

type propTypes = RouteComponentProps<routeInfo> & P

class AdminActions extends Component <propTypes,S> {

	former: Former
	constructor(props: propTypes) {
		super(props)
	
		this.state = {
			selectedSchool: "",
			purchasePassword: "",
			resetPassword: ""
		}

		this.former = new Former(this,[])
	}
	
	componentDidMount() {
		this.props.schoolInfo()
	}

	getCodes = async () => {

		const { selectedSchool} = this.state

		const resetPassword = await hash(`reset-${selectedSchool}-${moment().format("MMDDYYYY")}`)
			.then(res => res.substr(0,4).toLowerCase())

		const purchasePassword = await hash(`buy-${selectedSchool}-${moment().format("MMDDYYYY")}`)
			.then(res => res.substr(0, 4).toLowerCase())
		
		this.setState({
			resetPassword,
			purchasePassword
		})
	}

	render() {

		const { schoolList } = this.props
		const { selectedSchool, resetPassword, purchasePassword} = this.state
		
		return <div className="page admin-actions">
			<div className="title"> Admin Actions</div>
			
			<div className="section form"style={{width: "75%"}}>
				<div className="divider">Reset/Purchase Code</div>
				<div className="row">
					<label>Select School</label>
					<select {...this.former.super_handle(["selectedSchool"], () => true, () => this.getCodes())}>
						<option value="">Select School</option>
						{
							schoolList.map(s => <option value={s} key={s}>{s}</option>)
						}
					</select>
				</div>

				{ selectedSchool && <div className="row">
					<label>Reset Password:</label>
					<div>{resetPassword}</div>
				</div>}
				{selectedSchool && <div className="row">
					<label>Purchase Password:</label>
					<div> {purchasePassword} </div>
				</div>}
			</div>
		</div>
	}
}
export default connect((state: RootReducerState) => ({
	schoolList: state.school_Info.school_list
}), (dispatch: Function) => ({
	schoolInfo: () => dispatch(schoolInfo())
}))(AdminActions)