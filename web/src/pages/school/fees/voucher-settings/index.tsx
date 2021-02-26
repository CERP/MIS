import React from 'react'

import { AppLayout } from 'components/Layout/appLayout'
import { SwitchButton } from 'components/input/switch'

export const VoucherSettings = () => {

	// TODO: copy logic from previous fee voucher settings
	// TODO: add RHT

	return (
		<AppLayout title={"Voucher Settings"}>
			<div className="p-5 md:p-10 md:pb-0 relative">
				<div className="text-2xl font-bold mt-4 mb-8 text-center">Voucher Settings</div>
				<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 pb-6 my-4 md:mt-8">
					<div className="text-white text-center text-base my-5">This will appear on student voucher</div>
					<form id='voucher-settings' className="text-white space-y-4 px-4 w-full md:w-3/5">
						<div>Copies per Page</div>
						<input
							name="voucherPerPage"
							type="number"
							placeholder="e.g. 1"
							className="tw-input w-full bg-transparent border-blue-brand ring-1" />

						<div className="font-bold">Bank Account Details</div>
						<div className="space-y-1">
							<div>Bank Name</div>
							<input
								name="bankName"
								type="text"
								placeholder="e.g. The Punjab Bank"
								className="tw-input w-full bg-transparent border-blue-brand ring-1" />
							<div>Account Title</div>
							<input
								name="accountTitle"
								type="text"
								placeholder="e.g. MISchool"
								className="tw-input w-full bg-transparent border-blue-brand ring-1" />
							<div>Account Title</div>
							<input
								name="accountNumber"
								type="text"
								placeholder="IBAN or other"
								className="tw-input w-full bg-transparent border-blue-brand ring-1" />
						</div>

						<div>Due Date</div>
						<input
							name="dueDays"
							type="number"
							placeholder="e.g. 2 (days after first of each month)"
							className="tw-input w-full bg-transparent border-blue-brand ring-1" />

						<div>Late Fine</div>
						<input
							name="lateFeeFine"
							type="number"
							placeholder="amount per day"
							className="tw-input w-full bg-transparent border-blue-brand ring-1" />

						<div>Fee Notice</div>
						<textarea
							name="notice"
							rows={2}
							placeholder="Fee Notice"
							className="tw-input w-full bg-transparent border-blue-brand ring-1" />

						<div className="font-bold">Include on Voucher?</div>
						<div className="space-y-1">
							<SwitchButton title={"Show Bank Details"}
								state={false}
								callback={() => window.alert("hello")} />

							<SwitchButton title={"Show Due Date"}
								state={false}
								callback={() => window.alert("hello")} />

							<SwitchButton title={"Show Fine"}
								state={false}
								callback={() => window.alert("hello")} />

							<SwitchButton title={"Show Notice"}
								state={false}
								callback={() => window.alert("hello")} />
						</div>

						<button type="submit" className={"w-full items-center tw-btn bg-green-brand py-3 font-semibold my-4"}>
							Save Settings
						</button>
					</form>
				</div>
			</div>
		</AppLayout>
	)
}