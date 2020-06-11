import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router-dom'
import { createLogin } from 'actions'
import { RouteComponentProps } from 'react-router'
import Former from 'utils/former'
import Layout from 'components/Layout'
import { openDB } from 'idb'
import { EyeOpenIcon, EyeClosedIcon } from 'assets/icons'

import './style.css'

type PropsType = {
	num_users: number
	unsyncd_changes: number
	users: RootDBState["users"]
	login: (login: UserLogin) => void
} & RootReducerState & RouteComponentProps

type S = {
	login: UserLogin
	loginButtonPressed: boolean
	errorMessage: string
	showPassword: boolean
}

interface UserLogin {
	school: string
	username: string
	name: string
	password: string
}

class Login extends Component<PropsType, S> {

	former: Former
	constructor(props: PropsType) {
		super(props)

		this.state = {
			login: {
				school: "",
				username: "",
				name: "",
				password: ""
			},
			loginButtonPressed: false,
			errorMessage: "",
			showPassword: false
		}

		this.former = new Former(this, ["login"]);
	}

	getPasswordInputType = () => this.state.showPassword ? "text" : "password"
	getShowHideIcon = () => this.state.showPassword ? EyeOpenIcon : EyeClosedIcon

	onLogin = () => {

		const { login } = this.state

		if (login.name === "" || login.password === "") {
			alert("Please select user or enter password")
			return
		}

		this.setState({ loginButtonPressed: true }, () => {
			this.props.login(this.state.login)
		})
	}

	handleKeyDown = (e: React.KeyboardEvent) => {
		// check 'enter' key pressed
		if (e.keyCode === 13) {
			this.onLogin()
		}
	}

	onSwitchSchool = () => {

		if (this.props.unsyncd_changes > 0) {
			const res = window.confirm(`You have ${this.props.unsyncd_changes} pending changes. Please Export Db to file before Switching School. If you switch schools without exporting, this data will be lost. Are you sure you want to continue?`);
			if (!res) {
				return;
			}
		}

		localStorage.removeItem("ilmx")
		openDB('db', 1, {
			upgrade(db) {
				db.createObjectStore('root-state')
			}
		}).then(db => {
			db.get('root-state', "db")
				.then(res => {
					try {
						console.log("BACKING UP TO IDB")
						if (localStorage.getItem('backup')) {
							localStorage.removeItem('backup')
						}
						db.put('root-state', res, 'backup')
					}
					catch {
						console.log("Backup to LocalStorage Failed (on SwitchSchool)")
						if (this.props.unsyncd_changes > 0) {
							try {
								console.log("Backing up unsynced to IDB")
								const state = JSON.parse(res)
								db.put('root-state', JSON.stringify(state.queued), "backup-queued")
							}
							catch {
								console.log("Backup of unsynced to IDB failed")
							}
						}
					}
				})

			db.delete('root-state', 'db')
				.then(res => {

					if (localStorage.getItem('db')) {
						localStorage.removeItem("db")
					}

					window.location.reload()
				})
				.catch(err => console.error(err))
		})
			.catch(err => console.error(err))
	}

	UNSAFE_componentWillReceiveProps(nextProps: PropsType) {
		if (nextProps.auth.name !== undefined && nextProps.auth.name !== this.props.auth.name) {
			this.props.history.push('/landing')
		}

		if (nextProps.auth.attempt_failed && this.state.loginButtonPressed) {
			this.setState({
				login: { ...this.state.login, password: "" },
				loginButtonPressed: false,
				errorMessage: "Password is incorrect!"
			}, () => {
				setTimeout(() => {
					this.setState({
						errorMessage: "",
					})
				}, 2000)
			})
		}
	}

	render() {

		if (!this.props.initialized && this.props.auth.token !== undefined) {
			return <div>Loading Database...</div>
		}

		if (!this.props.auth.token) {
			return <Redirect to="/school-login" />
		}

		if (this.props.auth.faculty_id) {
			return <Redirect to="/landing" />
		}

		if (this.props.num_users === 0) {
			return <Redirect to="/faculty/first" />
		}

		return <Layout history={this.props.history}>
			<div className="login faculty-login">
				<div className="title">Staff Login for {this.props.auth.school_id}</div>
				<div className="form">
					<div className="row">
						<select {...this.former.super_handle(["name"])}>
							<option value="" disabled>Select a User</option>
							{
								Object.entries(this.props.users)
									.filter(([, f]) => f.hasLogin !== false)
									.sort(([, a], [, b]) => a.name.localeCompare(b.name))
									.map(([uid, u]) => <option key={uid} value={u.name}>{u.name}</option>)
							}
						</select>
					</div>
					<div className="row">
						<div style={{ display: "flex", flex: "1" }}>
							<input
								type={`${this.getPasswordInputType()}`}
								{...this.former.super_handle(["password"])}
								placeholder="Password" autoCapitalize="off"
								onKeyDown={this.handleKeyDown}
								style={{ borderRadius: "5px 0px 0px 5px", width: "90%" }}
							/>
							<div className="show-hide-container">
								<img
									src={this.getShowHideIcon()}
									onClick={() => this.setState({ showPassword: !this.state.showPassword })}
									alt="eye-icon" />

							</div>
						</div>
					</div>
					<div className="button blue" onClick={this.onLogin}>Login</div>
					<div className="error">{this.state.errorMessage}</div>
					<div className="info"><b>Note</b>: This login form is only for staff</div>
				</div>

				{this.props.connected ? <div className="button red" onClick={this.onSwitchSchool} style={{ position: "absolute", bottom: "20px", left: "20px" }}>Switch School</div> : false}
			</div>
		</Layout>

	}
}

export default connect((state: RootReducerState) => ({
	auth: state.auth,
	initialized: state.initialized,
	users: state.db.users,
	num_users: Object.keys(state.db.users).length,
	connected: state.connected,
	unsyncd_changes: Object.keys(state.queued.mutations || {}).length
}), (dispatch: Function) => ({
	login: (login: UserLogin): void => dispatch(createLogin(login.name, login.password))
}))(withRouter(Login))