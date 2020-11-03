import React, { Component } from 'react'
import checkCompulsoryFields from 'utils/checkCompulsoryFields'
import Banner from 'components/Banner'
import { createSignUp } from 'actions'
import { connect } from 'react-redux'
import { getStrategies, getAgents, getReferrals } from 'constants/generic'
import { Redirect } from 'react-router-dom'
import { getDistricts } from 'constants/locations'
import moment from 'moment'
import toTitleCase from 'utils/toTitleCase'
import Former from '@cerp/former';
import { _getSchoolList } from 'actions/index'
import './style.css'

function emptyProfile() {
	return {
		name: "",
		phone: "",
		city: "",
		schoolName: "",
		schoolPassword: "",
		packageName: "Free-Trial",
		typeOfLogin: ""
	}
}

class SignUp extends Component {

	constructor(props) {
		super(props)

		this.state = {
			profile: emptyProfile(),
			banner: {
				active: false,
				good: true,
				text: "Saved!"
			},
			otherLogin: '',
			redirect: false
		}

		this.former = new Former(this, [], getReferrals() )
	}

	// componentDidMount() {
	// 	this.props.getSchoolList()
	// }

	onSave = () => {

		if (this.former.check(["value", "school_name"])) {
			const compulsory_fields = checkCompulsoryFields(this.state.value,
				[
					["school_name"],
					["owner_easypaisa_number"]
				]
			)
			if (compulsory_fields) {
				const erroText = `Please Fill ${(compulsory_fields).map(x => x[0] === "agent_name" ? "Agent Name" : x[0]).join(", ")} !`
				return window.alert(erroText)
			}
		}
		else if (this.former.check(["value", "association_name"])) {
			const compulsory_fields = checkCompulsoryFields(this.state.value,
				[
					["association_name"],
				]
			)
			if (compulsory_fields) {
				const erroText = `Please Fill ${(compulsory_fields).map(x => x[0] === "agent_name" ? "Agent Name" : x[0]).join(", ")} !`
				return window.alert(erroText)
			}
		}

		const compulsoryFields = checkCompulsoryFields(this.state.profile, [
			["name"], ["phone"]
		]);

		if (compulsoryFields) {
			const errorText = "Please Fill " + compulsoryFields + " !!!";

			return this.setState({
				banner: {
					active: true,
					good: false,
					text: errorText
				}
			})
		}

		if (this.state.otherLogin) {
			const signup = { ...this.state.profile, typeOfLogin: this.state.otherLogin, date: moment.now() }
			this.props.createSignup(signup)
		} else {
			this.props.createSignUp({ ...this.state.profile, date: moment.now() })
		}
	}

	checkNumberExistReason = (reason) => {
		return reason.includes(this.state.profile.phone) ?
			this.state.profile.phone + " already exist. Please login or contact at our helpline" : reason
	}

	UNSAFE_componentWillReceiveProps(props) {
		const sign_up_form = props.sign_up_form

		if (sign_up_form.loading === false &&
			sign_up_form.succeed === false &&
			sign_up_form.reason !== "") {
			this.setState({
				banner: {
					active: true,
					good: false,
					text: "Sign-up failed! " + this.checkNumberExistReason(sign_up_form.reason)
				}
			})
			setTimeout(() => {
				this.setState({
					banner: {
						active: false,
						good: true,
					}
				})
			}, 3000)
		}
		if (sign_up_form.loading === true) {
			this.setState({
				banner: {
					active: true,
					good: true,
					text: "LOADING"
				}
			})
		}
		if (sign_up_form.loading === false &&
			sign_up_form.succeed === true &&
			sign_up_form.reason === "") {
			this.setState({
				banner: {
					active: true,
					good: true,
					text: "Your account has been created."
				}
			})

			setTimeout(() => {
				this.setState({
					banner: {
						active: false,
						good: true,
					},
					redirect: true
				})
			}, 2000)
		}
	}

	render() {

	const Span = () => <span style={{ color: "red" }}>*</span>

		if (this.state.redirect){
			return <Redirect to="/school-login" />	
		}
		return	<div className="section-container section card sign-up">
				{ this.state.banner.active ? <Banner isGood={this.state.banner.good} text={this.state.banner.text} /> : false}
				<div className="row">
					<label> Name </label>
					<input type="text" {...this.former.super_handle(["profile", "name"])} placeholder='Enter full-name'></input>
				</div>
				<div className="row">
					<label> Mobile # (School ID)</label>
					<input type="text" {...this.former.super_handle(["profile", "phone"])} placeholder='Enter mobile # e.g 0301xxxxxxx'></input>
				</div>
				<div className="row">
					<label> City/District </label>
					<select {...this.former.super_handle(["profile", "city"])}>
						<option value="">Select District</option>
						{
								getDistricts().sort().map((dist)=> {
									return <option key={dist} value={dist}>{toTitleCase(dist)}</option>
								})
						}
					</select>
				</div>
				<div className="row">
					<label> School Name </label>
					<input type="text" {...this.former.super_handle(["profile", "schoolName"])} placeholder='Enter school-name'></input>
				</div>
				<div className="row">
					<label> School Password </label>
					<input type="password" {...this.former.super_handle(["profile", "schoolPassword"])} placeholder='Enter password'></input>
				</div>
				<div className="row">
					<label>How did you hear about MISchool?</label>
					<select {...this.former.super_handle(["profile", "typeOfLogin"])}>
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
				{ this.state.profile.typeOfLogin === 'OTHER' &&
					<div className="row">
						<label> Other </label>
						<input type="text" {...this.former.super_handle(["otherLogin"])}></input>
					</div>
				}
				<div className="row">
					<label> Select Package </label>
					<select style={{ marginTop: 5 }} {...this.former.super_handle(["profile", "packageName"])}>
						<option value="Free-Trial">Free-Trial</option>
					</select>
				</div>
					{this.former.check(["profile", "school_name"]) && <div className="section form referrals">
						<div className="divider"> Referral School Information </div>

						<div className="row">
							<label>School Name <Span /></label>
							<input list="schl-list" {...this.former.super_handle(["value", "school_name"])} placeholder="school name" />
							<datalist id="schl-list">
								{
									this.props.schoolList && this.props.schoolList.map(s => <option key={s} value={s} />)
								}
							</datalist>
						</div>

						<div className="row">
							<label>Owner Easy Paisa <Span /></label>
							<input type="number" {...this.former.super_handle(["value", "owner_easypaisa_number"])} placeholder="Easy Paisa" />
						</div>
					</div>}
					{this.former.check(["profile", "association_name"]) && <div className="section form referrals">
						<div className="divider">Association Information</div>
						<div className="row">
							<label>Association <Span /></label>
							<input type="text" {...this.former.super_handle(["value", "association_name"])} placeholder="Association Name" />
						</div>
					</div>}
					{this.former.check(["profile", "agent_name"]) && <div className="section form referrals">
						<div className="divider">Agent Information <Span /></div>
						<div className="row">
							<label>Agent Name</label>
							<select {...this.former.super_handle(["value", "agent_name"])}>
								<option value="">Select Agent</option>
								{
									getAgents()
										.map(name => <option key={name} value={name}>{name}</option>)
								}

							</select>
						</div>

					</div>}
				<div className="section form">
					<div className="divider">School Information</div>
					<div className="row">
						<label>Owner Name:<Span /></label>
						<input type="text" {...this.former.super_handle(["value", "owner_name"])} placeholder="name" />
					</div>
					<div className="row">
						<label>Owner Phone <Span /></label>
						<input type="number" placeholder="number" {...this.former.super_handle(["value", "owner_phone"])} />
					</div>
					<div className="row">
						<label>School Type <Span /></label>
						<select {...this.former.super_handle(["value", "school_type"])}>
							<option value="">Select</option>
							<option value="RURAL">Rural</option>
							<option value="URBAN">Urban</option>
						</select>
					</div>
					<div className="row">
						<label>Does the school owner have another job? (where he invest time instead of school) <Span /></label>
						<select {...this.former.super_handle(["value", "owner_other_job"])}>
							<option value="">Select</option>
							<option value="YES">Yes</option>
							<option value="NO">No</option>
						</select>
					</div>
					<div className="row">
						<label>Is there any computer operator in the school responsible to use MISchool (any specific teacher or person who act as a computer operator) <Span /></label>
						<select {...this.former.super_handle(["value", "computer_operator"])}>
							<option value="">Select</option>
							<option value="YES">Yes</option>
							<option value="NO">No</option>
						</select>
					</div>
					<div className="row">
						<label>What was their previous management system? <Span /></label>
						<select {...this.former.super_handle(["value", "previous_management_system"])}>
							<option value="">Select</option>
							<option value="REGISTER">Register</option>
							<option value="EXCEL">Excel</option>
							<option value="SOFTWARE">Software</option>
						</select>
					</div>
					{this.former.check(["profile", "previous_software_name"]) && <div className="row">
						<label>Please mention the name of the previous software</label>
						<input type="text" placeholder="name" {...this.former.super_handle(["value", "previous_software_name"])} />
					</div>}

					<div className="row">
						<label>Notes:</label>
						<textarea {...this.former.super_handle(["value", "notes"])} placeholder="Additional Info (If Any)" />
					</div>
				</div>
				<div className="button red" onClick={() => this.onSave()}> Create Signup</div>
			</div>
		}
}
export default connect(state => ({
	sign_up_form: state.sign_up_form,
	// schoolList: state.school_Info.school_list
}), dispatch => ({
	// getSchoolList: () => dispatch(getSchoolList()),
	createSignUp: (profile) => dispatch(createSignUp(profile)),
}))(SignUp);