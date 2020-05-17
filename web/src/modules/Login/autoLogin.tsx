import React from 'react'
import { connect } from 'react-redux'
import qs from "query-string"
import { autoSchoolLogin } from 'actions'
import { RouteComponentProps, Redirect } from 'react-router'
import { DownloadIcon } from 'assets/icons'


interface P {
	connected: boolean
	initialized: boolean
	auth: RootReducerState["auth"]
	autoSchoolLogin: (id: string, token: string, client_id: string) => void
}

const AutoLogin: React.FC<P & RouteComponentProps> = ({ connected, initialized, auth, autoSchoolLogin, location }) => {

	// mischool.pk/auto-login?id= &key= &cid=
	const params = qs.parse(location.search)

	const id = params.id ? params.id.toString() : ''
	const token = params.key ? params.key.toString() : ''
	const client_id = params.cid ? params.cid.toString() : ''

	if (auth.token) {
		return <Redirect to="/landing" />
	}

	if (connected && !auth.loading && id !== "" && token !== "" && client_id !== "") {
		autoSchoolLogin(id, token, client_id)
	}

	if (connected && !initialized) {
		return <div className="downloading">
			<img className="bounce" src={DownloadIcon} alt="download-icon" />
			<div style={{ marginTop: "10px" }}>Downloading Database, Please wait...</div>
		</div>
	}

	return <div> Connecting...</div>
}

export default connect((state: RootReducerState) => ({
	connected: state.connected,
	auth: state.auth
}), (dispatch: Function) => ({
	autoSchoolLogin: (id: string, token: string, client_id: string) => dispatch(autoSchoolLogin(id, token, client_id))
}))(AutoLogin)