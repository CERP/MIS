import React, { Component } from 'react'
import moment from 'moment';
import { v4 } from 'node-uuid'
import { connect } from 'react-redux'
import { Redirect, RouteComponentProps } from 'react-router-dom';
import Dynamic from '@cerp/dynamic'
import Former from 'utils/former';
import { createFacultyMerge, deleteFaculty } from 'actions'
import { hash } from 'utils'
import Hyphenator from 'utils/Hyphenator'
import Banner from 'components/Banner'
import checkCompulsoryFields from 'utils/checkCompulsoryFields'
import { isMobile } from 'utils/helpers'

import './style.css'

// this page will have all the profile info for a teacher.
// all this data will be editable.

const blankTeacher = (isFirst = false): MISTeacher => ({
	id: v4(),
	Name: "",
	CNIC: "",
	Gender: "",
	Username: "",
	Password: "",
	Married: false,
	Phone: "",
	Salary: "",
	Active: true,

	ManCNIC: "",
	ManName: "",
	Birthdate: "",
	Address: "",
	StructuredQualification: "",
	Qualification: "",
	Experience: "",
	HireDate: moment().format("MM-DD-YYYY"),
	Admin: isFirst,
	HasLogin: true,
	tags: {},
	attendance: {},
	permissions: {
		fee: false,
		setupPage: false,
		dailyStats: false,
		expense: false,
		prospective: false,
		family: false
	}
})

interface P {
	faculty: RootDBState['faculty']
	user: MISTeacher
	auth: RootReducerState["auth"]

	save: (teacher: MISTeacher, is_first?: boolean) => void
	delete: (faculty_id: string) => void
}

interface S {
	profile: MISTeacher
	redirect: false | string
	banner: {
		active: boolean
		good?: boolean
		text?: string
	}
	tag: string
	toggleMoreInfo: boolean
}

interface RouteInfo {
	id: string
}

type propTypes = P & RouteComponentProps<RouteInfo>

class CreateTeacher extends Component<propTypes, S> {

	former: Former

	constructor(props: propTypes) {
		super(props)

		const id = props.match.params.id
		const faculty = props.faculty[id]

		this.state = {
			profile: {
				...faculty || blankTeacher(this.isFirst()),
				HasLogin: this.isFirst() || this.isNew() ? true : faculty && faculty.HasLogin,
				permissions: this.isFirst() || this.isNew() ? blankTeacher().permissions : faculty && faculty.permissions
			},
			redirect: false,
			banner: {
				active: false,
				good: true,
				text: "Saved!"
			},
			tag: "",
			toggleMoreInfo: false
		}

		this.former = new Former(this, ["profile"])
	}

	isFirst = () => this.props.match.path.indexOf("first") >= 0
	isNew = () => this.props.location.pathname.indexOf("new") >= 0

	onSave = () => {

		let { profile } = this.state

		const compulsoryFileds = checkCompulsoryFields(profile, [
			["Name"],
			["Password"]
		]);

		if (compulsoryFileds) {

			const errorText = "Please Fill " + compulsoryFileds;

			return this.setState({
				banner: {
					active: true,
					text: errorText,
					good: false
				}
			})
		}

		if (profile.Password.length !== 128) { // hack...
			hash(profile.Password).then(hashed => {

				if (this.isFirst()) {
					this.props.save({ ...profile, Password: hashed }, true)
				} else {
					this.props.save({ ...profile, Password: hashed })
				}

				this.setState({
					banner: {
						active: true,
						good: true,
						text: "Saved!"
					}
				})

				setTimeout(() => {
					this.setState({
						redirect: this.isNew() ? `/teacher` : false,
						banner: { active: false }
					})
				}, 1500);

			})
		}
		else {
			this.props.save(profile)

			this.setState({
				banner: {
					active: true,
					good: true,
					text: "Saved!"
				},
				redirect: this.isNew() ? `/teacher` : false
			})

			setTimeout(() => {
				this.setState({ banner: { active: false } })
			}, 3000);

		}
	}

	onDelete = () => {

		const val = window.confirm("Are you sure you want to delete?")
		if (!val)
			return
		this.props.delete(this.state.profile.id)

		this.setState({
			banner: {
				active: true,
				good: false,
				text: "Deleted!"
			}
		})

		setTimeout(() => {
			this.setState({
				banner: {
					active: false
				},
				redirect: `/teacher`
			})
		}, 1000);
	}

	UNSAFE_componentWillReceiveProps(nextProps: propTypes) {
		// this means every time teacher upgrades, we will change the fields to whatever was just sent.
		// this means it will be very annoying for someone to edit the user at the same time as someone else
		// which is probably a good thing. 

		if (this.isFirst() && nextProps.auth.name && nextProps.auth.name !== this.props.auth.name) {
			setTimeout(() => {
				this.setState({
					...this.state,
					redirect: '/landing'
				})
			}, 2000)
		}

		this.setState({
			profile: nextProps.faculty[this.props.match.params.id] || this.state.profile
		})
	}

	addHyphens = (path: string[]) => () => {

		const str = Dynamic.get(this.state, path) as string;
		this.setState(Dynamic.put(this.state, path, Hyphenator(str)) as S)
	}

	addTag = () => {

		const { tag, profile } = this.state

		if (tag.trim() === "") {
			return
		}

		this.setState({
			profile: {
				...profile,
				tags: {
					...(profile.tags || {}),
					[tag.trim()]: true
				}
			}
		})
	}

	removeTag = (tag: string) => () => {

		const { profile } = this.state
		const { [tag]: removed, ...rest } = profile.tags

		this.setState({
			profile: {
				...profile,
				tags: rest
			}
		})
	}

	getUniqueTagsFromFaculty = (): Array<string> => {

		const tags = new Set<string>()

		Object.values(this.props.faculty || {})
			.filter(f => f.id && f.Name)
			.forEach(s => {
				Object.keys(s.tags || {})
					.forEach(tag => tags.add(tag))
			})

		return [...tags]
	}

	toggleMoreInfo = () => {
		this.setState({ toggleMoreInfo: !this.state.toggleMoreInfo })
	}

	changeTeacherPermissions = () => {

		return <>
			{<div className="table">
				<div className="row">
					<label> Allow teacher to view Setup Page ? </label>
					<select {...this.former.super_handle(["permissions", "setupPage"])}>
						<option value="true">Yes</option>
						<option value="false">No</option>
					</select>
				</div>

				<div className="row">
					<label> Allow teacher to view Fee Information ? </label>
					<select {...this.former.super_handle(["permissions", "fee"])}>
						<option value="true">Yes</option>
						<option value="false">No</option>
					</select>
				</div>
				<div className="row">
					<label> Allow teacher to view Daily Statistics ? </label>
					<select {...this.former.super_handle(["permissions", "dailyStats"])}>
						<option value="true">Yes</option>
						<option value="false">No</option>
					</select>
				</div>
				<div className="row">
					<label> Allow teacher to view Expense Information? </label>
					<select {...this.former.super_handle(["permissions", "expense"])}>
						<option value="true">Yes</option>
						<option value="false">No</option>
					</select>
				</div>
				<div className="row">
					<label> Allow teacher to view Family Information? </label>
					<select {...this.former.super_handle(["permissions", "family"])}>
						<option value="true">Yes</option>
						<option value="false">No</option>
					</select>
				</div>
				<div className="row">
					<label> Allow teacher to view Prospective Information? </label>
					<select {...this.former.super_handle(["permissions", "prospective"])}>
						<option value="true">Yes</option>
						<option value="false">No</option>
					</select>
				</div>
			</div>
			}
		</>
	}

	render() {
		if (this.state.redirect) {
			return <Redirect to={this.state.redirect} />
		}

		const admin = this.isFirst() || this.props.user.Admin;
		const canEdit = admin || this.props.user.id === this.state.profile.id;

		return <div className="single-teacher-create">
			{this.state.banner.active ? <Banner isGood={this.state.banner.good} text={this.state.banner.text} /> : false}

			{this.isNew() && !this.state.toggleMoreInfo && <div className="form">
				<div className="divider">Personal Information</div>
				<div className="row">
					<label>Full Name</label>
					<input type="text" {...this.former.super_handle_flex(["Name"], { styles: (val: string) => { return val === "" ? { borderColor: "#fc6171" } : {} } })} placeholder="Full Name" disabled={!canEdit} />
				</div>
				<div className="row">
					<label>Password</label>
					<input type="password" {...this.former.super_handle_flex(["Password"], { styles: (val: string) => { return val === "" ? { borderColor: "#fc6171" } : {} } })} placeholder="Password" disabled={!canEdit} />
				</div>
				<div className="row">
					<label>Phone Number</label>
					<input type="tel" {...this.former.super_handle(["Phone"], (num) => num.length <= 11)} placeholder="Phone Number" disabled={!canEdit} />
				</div>
				<div className="row">
					<label>Admin Status</label>
					<select {...this.former.super_handle(["Admin"])} disabled={!admin}>
						<option value="true">Admin</option>
						<option value="false">Not an Admin</option>
					</select>
				</div>
				{
					!this.state.profile.Admin && this.changeTeacherPermissions()
				}
			</div>
			}

			{
				this.isNew() && <div className="section-container" style={{ marginTop: "1.25rem" }}>
					<div className="button green" onClick={this.toggleMoreInfo}>{this.state.toggleMoreInfo ? "Show Less Fields" : "Show Additional Fields"}</div>
				</div>
			}

			{
				(this.isNew() ? this.state.toggleMoreInfo : true) && <div className="form">
					<div className="divider">Personal Information</div>
					<div className="row">
						<label>Full Name</label>
						<input type="text" {...this.former.super_handle_flex(["Name"], { styles: (val: string) => { return val === "" ? { borderColor: "#fc6171" } : {} } })} placeholder="Full Name" disabled={!canEdit} />
					</div>
					{!this.isFirst() && <>
						<div className="row">
							<label>CNIC</label>
							<input type="tel" {...this.former.super_handle(["CNIC"], (num) => num.length <= 15, this.addHyphens(["profile", "CNIC"]))} placeholder="CNIC" disabled={!canEdit} />
						</div>
						<div className="row">
							<label>Gender</label>
							<select {...this.former.super_handle(["Gender"])} disabled={!canEdit}>
								<option value='' disabled>Please Set a Gender</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
							</select>
						</div>
						<div className="row">
							<label>Married</label>
							<select {...this.former.super_handle(["Married"])} disabled={!canEdit}>
								<option value='' disabled>Please Select Marriage Status</option>
								<option value="false">Not Married</option>
								<option value="true">Married</option>
							</select>
						</div>

						<div className="row">
							<label>Date of Birth</label>
							<input type="date"
								onChange={this.former.handle(["Birthdate"])}
								value={moment(this.state.profile.Birthdate).format("YYYY-MM-DD")}
								placeholder="Date of Birth"
								disabled={!canEdit} />
						</div>

						<div className="row">
							<label>Husband/Father Name</label>
							<input type="text" {...this.former.super_handle(["ManName"])} placeholder="Father/Husband Name" disabled={!canEdit} />
						</div>

						<div className="row">
							<label>Husband/Father CNIC</label>
							<input type="tel" {...this.former.super_handle(["ManCNIC"], num => num.length <= 15, this.addHyphens(["profile", "ManCNIC"]))} placeholder="Father/Husband CNIC" disabled={!canEdit} />
						</div>

						<div className="divider">Account Information</div>
						<div className="row">
							<label>Admin Status</label>
							<select {...this.former.super_handle(["Admin"])} disabled={!admin}>
								<option value="true">Admin</option>
								<option value="false">Not an Admin</option>
							</select>
						</div>
						{
							!this.state.profile.Admin && this.changeTeacherPermissions()
						}
						<div className="row">
							<label>User status</label>
							<select {...this.former.super_handle(["HasLogin"])} disabled={!admin}>
								<option value="true">Has login access</option>
								<option value="false">Does not have login access</option>
							</select>
						</div>
					</>}
					<div className="row">
						<label>Password</label>
						<input type="password" {...this.former.super_handle_flex(["Password"], { styles: (val: string) => { return val === "" ? { borderColor: "#fc6171" } : {} } })} placeholder="Password" disabled={!canEdit} />
					</div>

					{!this.isFirst() && <>
						<div className="divider">Contact Information</div>
						<div className="row">
							<label>Phone Number</label>
							<div className="row" style={{ flexDirection: "row" }}>
								<input style={{ width: "100%" }} type="tel" {...this.former.super_handle(["Phone"], (num) => num.length <= 11)} placeholder="Phone Number" disabled={!canEdit} />
								{isMobile() && !this.isNew() && <a className="button blue call-link" href={`tel:${this.state.profile.Phone}`} > Call</a>}
							</div>
						</div>
						<div className="row">
							<label>Address</label>
							<input type="text" {...this.former.super_handle(["Address"])} placeholder="Address" disabled={!canEdit} />
						</div>

						<div className="divider"> Tags </div>
						<div className="tag-container">
							{
								Object.keys(this.state.profile.tags || {})
									.map(tag =>
										<div className="tag-row" key={tag}>
											<div className="deletable-tag-wrapper" onClick={this.removeTag(tag)}>
												<div className="tag">{tag} </div>
												<div className="cross">×</div>
											</div>
										</div>
									)
							}
						</div>

						<div className="row" style={{ flexDirection: "row" }}>
							<input list="tags" onChange={(e) => this.setState({ tag: e.target.value })} placeholder="Type or Select Tag" style={{ width: "initial" }} />
							<datalist id="tags">
								{
									this.getUniqueTagsFromFaculty()
										.map(tag => <option key={tag} value={tag} />)
								}
							</datalist>
							<div className="button green" style={{ width: "initial", marginLeft: "auto" }} onClick={this.addTag}>+</div>
						</div>


						<div className="divider">School Information</div>

						<div className="row">
							<label>Qualification</label>
							<select {...this.former.super_handle(["StructuredQualification"])} disabled={!admin}>
								<option value='' disabled>Please select a Qualification</option>
								<option value='Matric'>Matric</option>
								<option value='Inter'>Intermediate</option>
								<option value='BS'>Bachelors Degree (BS)</option>
								<option value='MS'>Masters Degree (MS)</option>
								<option value='diploma'>Diploma</option>
							</select>
						</div>

						<div className="row">
							<label>Other Qualification</label>
							<textarea {...this.former.super_handle(["Qualification"])} placeholder="Qualification" disabled={!admin} />
						</div>

						<div className="row">
							<label>Experience</label>
							<textarea {...this.former.super_handle(["Experience"])} placeholder="Experience" disabled={!admin} />
						</div>

						<div className="row">
							<label>Monthly Salary</label>
							<input type="number" {...this.former.super_handle(["Salary"])} placeholder="Monthly Salary" disabled={!admin} />
						</div>

						<div className="row">
							<label>Joining Date</label>
							<input type="date" onChange={this.former.handle(["HireDate"])} value={moment(this.state.profile.HireDate).format("YYYY-MM-DD")} placeholder="Hire Date" disabled={!admin} />
						</div>

						<div className="row">
							<label>Active Status</label>
							<select {...this.former.super_handle(["Active"])} disabled={!admin}>
								<option value='' disabled>Please Select Active Status</option>
								<option value="true">Currently Working in School</option>
								<option value="false">No Longer Working in School</option>
							</select>
						</div>
					</>}
				</div>
			}
			{
				!admin ? false : <div className="section-container" style={{ marginTop: "0.5rem" }}>
					<div className="button blue" style={{ marginBottom: "0.5rem" }} onClick={this.onSave}>Save</div>
					{this.isNew() || this.isFirst() ? false : <div className="button red" onClick={this.onDelete}>Delete</div>}
				</div>
			}
		</div>
	}
}

export default connect((state: RootReducerState) => ({
	auth: state.auth,
	faculty: state.db.faculty,
	user: state.db.faculty[state.auth.faculty_id],
}), (dispatch: Function) => ({
	save: (teacher: MISTeacher, is_first?: boolean) => dispatch(createFacultyMerge(teacher, is_first)),
	delete: (faculty_id: string) => dispatch(deleteFaculty(faculty_id))
}))(CreateTeacher);