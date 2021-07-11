import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
import { History } from 'history'
import moment from 'moment'
import { hash } from 'utils'
import { resetTrial, markPurchased } from 'actions'
import { AppLayout } from 'components/Layout/appLayout'
import { ExclamationIcon, HappyEmojiIcon } from 'assets/icons'
import { useSelector, useDispatch } from 'react-redux'

interface S {
	code: string
	isVerified: boolean
	isPaid: boolean
	isInvalidCode: boolean
}

export const MISActivation = () => {
	const dispatch = useDispatch()

	const initialized = useSelector((state: RootReducerState) => state.initialized)
	const schoolId = useSelector((state: RootReducerState) => state.auth.school_id)
	const packageInfo = useSelector(
		(state: RootReducerState) =>
			state.db.package_info ?? { date: -1, trial_period: 15, paid: false }
	)

	const [stateProps, setStateProps] = useState<S>({
		code: '',
		isInvalidCode: false,
		isVerified: false,
		isPaid: false
	})

	const verifyCode = async (code: string) => {
		const reset_code = await hash(
			`reset-${schoolId}-${moment().format('MMDDYYYY')}`
		).then(res => res.substr(0, 4).toLowerCase())

		const purchase_code = await hash(
			`buy-${schoolId}-${moment().format('MMDDYYYY')}`
		).then(res => res.substr(0, 4).toLowerCase())

		if (code === reset_code) {
			dispatch(resetTrial())
			return [true, 'RESET']
		}
		if (code === purchase_code) {
			dispatch(markPurchased())
			return [true, 'PURCHASED']
		}
		return [false, 'INVALID']
	}

	const handleVerifyCode = () => {
		const { code } = stateProps

		if (code.trim().length === 0) {
			return
		}

		verifyCode(code).then(accepted => {
			const [status, type] = accepted
			if (status) {
				setStateProps({
					...stateProps,
					isVerified: true,
					isPaid: type === 'PURCHASED' ? true : false
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

	if (!(schoolId && initialized)) {
		return <Redirect to="/school-login" />
	}

	return (
		<AppLayout title={'MIS Activation'} showHeaderTitle={true}>
			<div className="max-w-7xl mx-auto px-16">
				<div className="section-container">
					<div className="title text-center">Verify Activation Code</div>
					{!stateProps.isVerified && (
						<div className="section">
							<div className="flex">
								<div className="m-3">
									<img
										className="w-11 h-11"
										src={ExclamationIcon}
										alt="exclamation"
									/>
								</div>
								<div className="text-red-500 text-xl mt-1 pt-2.5">
									Trial has been ended. Please enter <strong>reset trial</strong>{' '}
									or <strong>purchase</strong> code to use MISchool
								</div>
							</div>
							<div className="px-14">
								<input
									className="tw-input w-full mt-2"
									type="text"
									onBlur={e =>
										setStateProps({
											...stateProps,
											code: e.target.value
										})
									}
									placeholder="Enter valid code"
									autoFocus
								/>

								<div className="text-red-400 mt-2">
									{stateProps.isInvalidCode && (
										<div>Invalid Code, Enter valid code</div>
									)}
								</div>
								<div className="row" style={{ marginTop: '0.375rem' }}>
									<div
										className="w-full mt-2 text-center tw-btn-blue"
										onClick={handleVerifyCode}>
										Verify Code
									</div>
								</div>
							</div>
						</div>
					)}
					{stateProps.isVerified && (
						<div className="max-w-7xl mx-auto px-16">
							<div className="section flex">
								<div className="m-3">
									<img
										className="w-11 h-11"
										src={HappyEmojiIcon}
										alt="exclamation"
									/>
								</div>
								<div className="text-green-400 py-6 text-xl">
									<div>
										{' '}
										Hurrah!{' '}
										<strong>
											{stateProps.isPaid ? 'Purchase' : 'Reset Trial'}
										</strong>{' '}
										code has been verified.
										{stateProps.isPaid ? (
											<span> You have been marked as Paid User.</span>
										) : (
											<span> Your Trial has been reset. </span>
										)}
										Thanks for using MISchool!
									</div>
								</div>
							</div>
							<div className="activation-code" style={{ marginTop: 15 }}>
								<div className="row">
									<Link
										className="w-full mt-2 text-center tw-btn-blue"
										to="/home">
										Continue to Use MISchool
									</Link>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</AppLayout>
	)
}

export default MISActivation
