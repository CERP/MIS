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
	isInvalidCode: boolean
}

const MISActivation: React.FC<P> = ({ initialized, schoolId, resetTrial, markAsPurchased, history }) => {

	const [stateProps, setStateProps] = useState<S>({
		code: "",
		isInvalidCode: false,
		isVerified: false,
		isPaid: false
	})

	const verifyCode = async (code: string) => {

		const reset_code = await hash(`reset-${schoolId}-${moment().format("MMDDYYYY")}`)
			.then(res => res.substr(0, 4).toLowerCase())

		const purchase_code = await hash(`buy-${schoolId}-${moment().format("MMDDYYYY")}`)
			.then(res => res.substr(0, 4).toLowerCase())

		if (code === reset_code) {
			resetTrial()
			return [true, "RESET"]
		}

		if (code === purchase_code) {
			markAsPurchased()
			return [true, "PURCHASED"]
		}

		return [false, "INVALID"]
	}

	const handleVerifyCode = () => {

		const { code } = stateProps

		if (code.trim().length === 0) {
			return
		}

		verifyCode(code)
			.then(accepted => {
				const [status, type] = accepted
				if (status) {
					setStateProps({
						...stateProps,
						isVerified: true,
						isPaid: type === "PURCHASED" ? true : false
					})
				} else {
					setStateProps({
						...stateProps,
						isInvalidCode: true
					})
				}
			})

		// don't show error message after 3s
		setTimeout(() => {
			if (stateProps.isInvalidCode) {
				setStateProps({
					...stateProps,
					isInvalidCode: false
				})
			}
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
					{!stateProps.isVerified &&
						<div className="section">
							<div className="trial-alert">
								<div className="exclamation-icon">
									<img src={ExclamationIcon} alt="exclamation" />
								</div>
								<div className="trial-text is-danger">Trial has been ended. Please enter <strong>reset trial</strong> or <strong>purchase</strong> code to use MISchool</div>
							</div>
							<div className="activation-code">
								<div className="row">
									<input type="text" onBlur={(e) => setStateProps({ ...stateProps, code: e.target.value })} placeholder="Enter valid code" autoFocus />
								</div>
								<div className="row is-danger">
									{
										stateProps.isInvalidCode && <div>Invalid Code, Enter valid code</div>
									}
								</div>
								<div className="row" style={{ marginTop: "0.375rem" }}>
									<div className="button blue" onClick={handleVerifyCode}>Verify Code</div>
								</div>
							</div>
						</div>
					}
					{stateProps.isVerified &&
						<div className="section">
							<div className="trial-alert">
								<div className="exclamation-icon">
									<img src={HappyEmojiIcon} alt="exclamation" />
								</div>
								<div className="trial-text is-success">
									<div> Hurrah! <strong>{stateProps.isPaid ? "Purchase" : "Reset Trial"}</strong> code has been verified.
										{
											stateProps.isPaid ? <span> You have been marked as Paid User.</span> :
												<span> Your Trial has been reset.</span>
										}
										Thanks for using MISchool!
									</div>
								</div>
							</div>
							<div className="activation-code" style={{ marginTop: 15 }}>
								<div className="row">
									<Link className="button blue" to="/home">Continue to Use MISchool</Link>
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