import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
import { History } from 'history'
import moment from 'moment'
import { hash } from 'utils'
import { resetTrial, markPurchased } from 'actions'
import Layout from 'components/Layout'
import { ExclamationIcon, HappyEmojiIcon } from 'assets/icons'

import './style.css'

interface P {
	initialized: boolean
	schoolId: string
	packageInfo: MISPackage
	history: History

	resetTrial: () => void
	markAsPurchased: () => void
}

interface S {
	code: string
	isVerified: boolean
	isPaid: boolean
	isValidCode: boolean
}

const MISActivation: React.FC<P> = ({ initialized, schoolId, resetTrial, markAsPurchased, history }) => {

	const [state, setState] = useState<S>({
		code: "",
		isValidCode: false,
		isVerified: false,
		isPaid: false
	})

	const handleStateChange = (prop: keyof S, value: boolean | string) => {
		setState({
			...state,
			[prop]: value
		})
	}

	const verifyCode = async (code: string) => {

		const reset_code = await hash(`reset-${schoolId}-${moment().format("MMDDYYYY")}`)
			.then(res => res.substr(0, 4).toLowerCase())

		const purchase_code = await hash(`buy-${schoolId}-${moment().format("MMDDYYYY")}`)
			.then(res => res.substr(0, 4).toLowerCase())

		if (code === reset_code) {
			resetTrial()
			return true
		}

		if (code === purchase_code) {
			markAsPurchased()
			handleStateChange("isPaid", true)
			return true
		}

		return false
	}

	const handleVerifyCode = () => {

		const { code } = state

		if (code.trim().length === 0) {
			return
		}

		verifyCode(code)
			.then(accepted => {
				if (accepted) {
					handleStateChange("isVerified", true)
				} else {
					handleStateChange("isValidCode", true)
				}
			})

		// don't show error message after 3s
		setTimeout(() => {
			handleStateChange("isValidCode", false)
		}, 3000)
	}

	return <>
		{
			!(schoolId && initialized) && <Redirect to="/school-login" />
		}
		<Layout history={history}>
			<div className="mis-activation">
				<div className="section-container">
					<div className="title">Verify Activation Code</div>
					{!state.isVerified &&
						<div className="section">
							<div className="trial-alert">
								<div className="exclamation-icon">
									<img src={ExclamationIcon} alt="exclamation" />
								</div>
								<div className="trial-text is-danger">Trial has been ended. Please enter <strong>reset trial</strong> or <strong>purchase</strong> code to use MISchool</div>
							</div>
							<div className="activation-code">
								<div className="row">
									<input type="text" onChange={(e) => handleStateChange("code", e.target.value)} placeholder="Enter valid code" autoFocus />
								</div>
								{state.isValidCode &&
									<div className="row is-danger" style={{ marginTop: 10 }}>Invalid code, please enter valid code</div>
								}
								<div className="row" style={{ marginTop: 15 }}>
									<div className="button blue" onClick={handleVerifyCode}>Verify Code</div>
								</div>
							</div>
						</div>
					}
					{state.isVerified &&
						<div className="section">
							<div className="trial-alert">
								<div className="exclamation-icon">
									<img src={HappyEmojiIcon} alt="exclamation" />
								</div>
								<div className="trial-text is-success">
									<div> Hurrah! <strong>{state.isPaid ? "Purchase" : "Reset Trial"}</strong> code has been verified.
											{
											state.isPaid ? <span> You have been marked as Paid User.</span> :
												<span> Your Trial has been reset.</span>
										}
									</div>
								</div>
							</div>
							<div className="activation-code" style={{ marginTop: 15 }}>
								<div className="row">
									<Link className="button blue" to="/landing">Continue to Use MISchool</Link>
								</div>
							</div>
						</div>
					}
				</div>
			</div>
		</Layout>
	</>
}

export default connect((state: RootReducerState) => ({
	initialized: state.initialized,
	schoolId: state.auth.school_id,
	packageInfo: state.db.package_info || { date: -1, trial_period: 15, paid: false },
}), (dispatch: Function) => ({
	resetTrial: () => dispatch(resetTrial()),
	markAsPurchased: () => dispatch(markPurchased())
}))(MISActivation)