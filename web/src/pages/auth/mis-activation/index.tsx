import React, { useState } from 'react'
import moment from 'moment'
import { Redirect, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { hash } from 'utils'
import { resetTrial, markPurchased } from 'actions'
import { AppLayout } from 'components/Layout/appLayout'
import { EmojiHappyIcon, ShieldExclamationIcon } from '@heroicons/react/outline'

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
		<AppLayout title={'MIS Activation'} showHeaderTitle>
			<div className="px-5 md:px-10 w-full md:w-2/4 mx-auto">
				<div className="text-xl md:text-2xl font-semibold text-center my-4 md:my-8">
					Verify Activation Code
				</div>
				{!stateProps.isVerified && (
					<>
						<div className="md:flex flex-row md:flex-col border border-1 border-gray-500 p-4 md:p-6 rounded-lg">
							<div className="flex">
								<div className="p-2 pt-0 text-red-brand">
									<ShieldExclamationIcon className="w-8 h-8 md:w-12 md:h-12" />
								</div>
								<div className="text-red-brand md:text-xl">
									Trial has been ended. Please enter <strong>reset trial</strong>{' '}
									or <strong>purchase</strong> code to use MISchool
								</div>
							</div>
							<div className="md:px-14">
								<input
									className="tw-input w-full mt-2"
									type="text"
									onBlur={e =>
										setStateProps({
											...stateProps,
											code: e.target.value
										})
									}
									placeholder="Enter valid 4 characters code"
									autoFocus
								/>

								<div className="text-red-brand mt-2">
									{stateProps.isInvalidCode && (
										<div>Invalid Code, Enter valid code</div>
									)}
								</div>
								<button
									className="w-full mt-2 text-center tw-btn-blue"
									onClick={handleVerifyCode}>
									Verify Code
								</button>
							</div>
						</div>
						<div className="mt-2">
							<p>
								<span className="font-semibold">Note:</span> Please contact us at
								helpline for Verification Code.
							</p>
						</div>
					</>
				)}
				{stateProps.isVerified && (
					<div className="space-y-4">
						<div className="flex border border-1 border-gray-500 flex p-4 rounded-lg">
							<div className="p-2 pt-0 text-red-brand">
								<EmojiHappyIcon className="w-8 h-8 md:w-12 md:h-12" />
							</div>
							<div className="text-teal-brand md:text-xl">
								<div>
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
						<div className="w-full">
							<Link to="/home">
								<button className="w-full text-center tw-btn-blue">
									Continue to Use MISchool
								</button>
							</Link>
						</div>
					</div>
				)}
			</div>
		</AppLayout>
	)
}
