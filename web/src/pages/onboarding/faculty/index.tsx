import React, { useState } from 'react'
import clsx from 'clsx'

import { Spinner } from 'components/Animation/spinner'
import { EyePassword } from 'components/Password'

import UserIconSvg from 'assets/svgs/user.svg'
import { SwitchButton } from 'components/input/switch'

type TProps = {

}

export const AddStaffForm: React.FC<TProps> = ({ }) => {

	const [openEye, setOpenEye] = useState(false)

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

	}

	return (
		<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 my-4 md:mt-8">
			<div className="text-white text-center text-base my-5">Please Add Info to add Staff</div>
			<div className="w-24 h-24">
				<img className="rounded-full" src={UserIconSvg} alt="school-logo" />
			</div>
			<form id='admin-account' className="text-white space-y-4 md:w-4/3 px-4" onSubmit={handleSubmit}>
				<div className="">Name*</div>
				<input
					name="name"
					required
					placeholder="e.g. John Doe"
					className="tw-input w-full bg-transparent border-blue-brand ring-1" />
				<div className="">Personal Number*</div>
				<input
					name="phone"
					required
					placeholder="e.g. 03xxxxxxxx"
					className="tw-input w-full bg-transparent border-blue-brand ring-1" />
				<div className="">Password*</div>
				<div className="w-full relative">
					<input
						name="password"
						required
						type={openEye ? 'text' : 'password'}
						autoCapitalize="off"
						autoCorrect="off"
						autoComplete="off"
						placeholder="Enter password"
						className="tw-input w-full bg-transparent border-blue-brand ring-1" />
					<div
						onClick={() => setOpenEye(!openEye)}
						className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
						{
							<EyePassword open={openEye} />
						}
					</div>
				</div>

				<div className="">Staff Type</div>
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<input
							name="staff_type"
							type="radio"
							className="mr-2" />
						<div className="text-sm">Teaching Staff</div>
					</div>
					<div className="flex items-center">
						<input
							name="staff_type"
							type="radio"
							className="mr-2" />
						<div className="text-sm">Non-Teaching Staff</div>
					</div>
				</div>

				<SwitchButton title={"Admin Status"} state={true} onChange={(str: boolean) => str} />
				<SwitchButton title={"Allow Setup View"} state={false} onChange={(str: boolean) => str} />
				<SwitchButton title={"Allow Fee Info View"} state={false} onChange={(str: boolean) => str} />
				<SwitchButton title={"Allow Exams View"} state={false} onChange={(str: boolean) => str} />

				<div className="">
					<button className={clsx("inline-flex w-full items-center tw-btn-blue py-3 font-semibold my-4", { "pointer-events-none": true })}>
						{
							false ?
								<>
									<Spinner />
									<span className={"mx-auto animate-pulse"}>Adding Staff...</span>
								</>
								:
								<span className={"mx-auto"}>Add Staff</span>
						}
					</button>
				</div>
				<div className="h-1 py-1 text-xs text-red-brand">{ }</div>
			</form>
		</div>
	)
}