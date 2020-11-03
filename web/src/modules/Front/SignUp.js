import React, { Component } from 'react'
import former from 'utils/former'
import checkCompulsoryFields from 'utils/checkCompulsoryFields'
import Banner from 'components/Banner'
import { createSignUp } from 'actions'
import { connect } from 'react-redux'
import { getStrategies } from 'constants/generic'
import { Redirect } from 'react-router-dom'
import { getDistricts } from 'constants/locations'
import moment from 'moment'
import toTitleCase from 'utils/toTitleCase'

import './style.css'

function emptyProfile() {
	return {
		name: "",
		phone: "",
		city: "",
		schoolName: "",
		schoolPassword: "",
		packageName: "Free-Trial",
		typeOfLogin: "",			
		referralSchoolName: "",
		ownerEasypaisaNumber: ""
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

		this.former = new former(this, [])
	}

	onSave = () => {
		let compulsoryFields = this.state.profile.typeOfLogin === 'SCHOOL_REFERRAL' ?
			checkCompulsoryFields(this.state.profile, [
				["name"], ["phone"], ['referralSchoolName']
			]):
			checkCompulsoryFields(this.state.profile, [
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
		if(!reason) {
			return "Please contact at our helpline"
		}
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
					{this.state.profile.typeOfLogin === 'SCHOOL_REFERRAL' && <>
						<div className="divider"> Referral School Information </div>
						<div className="row">
							<label>School Name <Span /></label>
							<input list="schl-list" {...this.former.super_handle(["profile", "referralSchoolName"])} placeholder="school name" />
						</div>

						<div className="row">
							<label>Owner Easy Paisa <Span /></label>
							<input type="number" {...this.former.super_handle(["profile", "ownerEasypaisaNumber"])} placeholder="Easy Paisa" />
						</div>
					</>}				
				<div className="button red" onClick={() => this.onSave()}> Create Signup</div>
			</div>
		}
}
export default connect(state => ({
	sign_up_form: state.sign_up_form
}), dispatch => ({
	createSignUp: (profile) => dispatch(createSignUp(profile)),
}))(SignUp);