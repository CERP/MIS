import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Dynamic from '@cerp/dynamic'
import toast from 'react-hot-toast'

import { AppLayout } from 'components/Layout/appLayout'
import { SwitchButton } from 'components/input/switch'
import { mergeSettings } from 'actions'

type State = {
	vouchersPerPage: string
} & MISSettings["classes"]["feeVoucher"]

const getBlankFeeVoucherSetings = (): MISSettings["classes"]["feeVoucher"] => {
	return {
		dueDays: "",
		feeFine: "",
		notice: "",
		bankInfo: {
			name: "",
			accountTitle: "",
			accountNo: ""
		},
		options: {
			showDueDays: false,
			showFine: false,
			showNotice: false,
			showBankInfo: false
		}
	}
}

export const VoucherSettings = () => {
	const dispatch = useDispatch()
	const { settings } = useSelector((state: RootReducerState) => state.db)

	const feeVoucher = settings?.classes?.feeVoucher || getBlankFeeVoucherSetings()
	const { vouchersPerPage } = settings

	// TODO: change string to number
	const [state, setState] = useState<State>({
		vouchersPerPage: vouchersPerPage || "1",
		...feeVoucher
	})

	const saveFeeVoucher = (): void => {

		const { dueDays, feeFine, notice, bankInfo, options, vouchersPerPage } = state

		let modified_settings: MISSettings

		if (settings?.classes) {
			modified_settings = {
				...settings,
				classes: {
					...settings.classes,
					feeVoucher: {
						dueDays,
						feeFine,
						notice,
						bankInfo,
						options
					}
				},
				vouchersPerPage
			}
		} else {
			modified_settings = {
				...settings,
				classes: {
					defaultFee: {},
					feeVoucher: {
						dueDays,
						feeFine,
						notice,
						bankInfo,
						options
					}
				},
				vouchersPerPage
			}
		}

		// updating MISSettings
		dispatch(mergeSettings(modified_settings))

		toast.success("Voucher settings has been saved.")

	}

	// TODO: replace this with generic handler
	const handleInputByPath = (path: string[], value: any) => {
		const updatedState = Dynamic.put(state, path, value)
		setState(updatedState)
	}

	return (
		<AppLayout title={"Voucher Settings"}>
			<div className="p-5 md:p-10 md:pb-0 relative">
				<div className="text-2xl font-bold mt-4 mb-8 text-center">Voucher Settings</div>
				<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 pb-6 my-4 md:mt-8">
					<div className="text-white text-center text-base my-5">This will appear on student voucher</div>
					<form id='voucher-settings' className="text-white space-y-4 px-4 w-full md:w-3/5">
						<div>Copies per Page</div>
						<input
							name="vouchersPerPage"
							value={state.vouchersPerPage}
							onChange={(e) => handleInputByPath(["vouchersPerPage"], e.target.value)}
							type="number"
							placeholder="e.g. 1"
							className="tw-input w-full bg-transparent border-blue-brand ring-1" />

						<div className="font-bold">Bank Account Details</div>
						<div className="space-y-1">
							<div>Bank Name</div>
							<input
								name="bankName"
								value={state.bankInfo?.name}
								onChange={(e) => handleInputByPath(["bankInfo", "name"], e.target.value)}
								type="text"
								placeholder="e.g. The Punjab of Bank"
								className="tw-input w-full bg-transparent border-blue-brand ring-1" />
							<div>Account Title</div>
							<input
								name="accountTitle"
								value={state.bankInfo.accountTitle}
								onChange={(e) => handleInputByPath(["bankInfo", "accountTitle"], e.target.value)}
								type="text"
								placeholder="e.g. MISchool"
								className="tw-input w-full bg-transparent border-blue-brand ring-1" />
							<div>Account Title</div>
							<input
								name="accountNo"
								value={state.bankInfo.accountNo}

								onChange={(e) => handleInputByPath(["bankInfo", "accountNo"], e.target.value)}
								type="text"
								placeholder="IBAN or other"
								className="tw-input w-full bg-transparent border-blue-brand ring-1" />
						</div>

						<div>Due Date</div>
						<input
							name="dueDays"
							value={state.dueDays}
							onChange={(e) => handleInputByPath(["dueDays"], e.target.value)}
							type="number"
							placeholder="e.g. 2 (days after first of each month)"
							className="tw-input w-full bg-transparent border-blue-brand ring-1" />

						<div>Late Fine</div>
						<input
							name="feeFine"
							value={state.feeFine}
							onChange={(e) => handleInputByPath(["feeFine"], e.target.value)}
							type="number"
							placeholder="amount per day"
							className="tw-input w-full bg-transparent border-blue-brand ring-1" />

						<div>Fee Notice</div>
						<textarea
							name="notice"
							value={state.notice}
							onChange={(e) => handleInputByPath(["notice"], e.target.value)}
							rows={2}
							placeholder="Fee Notice"
							className="tw-input w-full bg-transparent border-blue-brand ring-1" />

						<div className="font-bold">Include on Voucher?</div>
						<div className="space-y-2 text-sm">
							<SwitchButton title={"Show Bank Details"}
								state={state.options.showBankInfo}
								callback={() => handleInputByPath(["options", "showBankInfo"], !state.options.showBankInfo)} />

							<SwitchButton title={"Show Due Date"}
								state={state.options.showDueDays}
								callback={() => handleInputByPath(["options", "showDueDays"], !state.options.showDueDays)} />

							<SwitchButton title={"Show Fine"}
								state={state.options.showFine}
								callback={() => handleInputByPath(["options", "showFine"], !state.options.showFine)} />

							<SwitchButton title={"Show Notice"}
								state={state.options.showNotice}
								callback={() => handleInputByPath(["options", "showNotice"], !state.options.showNotice)} />
						</div>

						<button
							onClick={saveFeeVoucher}
							type="button" className={"w-full items-center tw-btn bg-green-brand py-3 font-semibold my-4"}>
							Save Settings
						</button>
					</form>
				</div>
			</div>
		</AppLayout>
	)
}