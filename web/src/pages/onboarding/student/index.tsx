import React from 'react'
import clsx from 'clsx'

import { Spinner } from 'components/Animation/spinner'

import UserIconSvg from 'assets/svgs/user.svg'

type TAddStudentProps = {

}

export const AddStudent: React.FC<TAddStudentProps> = ({ }) => {

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

	}

	return (
		<div className="md:w-4/5 md:mx-auto flex flex-col items-center rounded-2xl bg-gray-700 my-4 md:mt-8">

			<div className="text-white text-center text-base my-5">Adding Students to Class 5</div>

			<div className="w-4/5 flex items-center flex-row my-4">
				<img className="w-20 h-20 rounded-full" src={UserIconSvg} alt="user-logo" />
				<div className="flex flex-col space-y-1 text-sm text-white ml-10">
					<div className="text-semibold">Rohullah</div>
					<div>Class 5</div>
					<div>Rainbow Section</div>
				</div>
			</div>

			<div className="w-full space-y-4 md:w-4/3 px-4 my-4">
				<button className="w-full tw-btn bg-orange-brand text-white">Download Template</button>
				<button className="w-full tw-btn text-white bg-teal-500">Upload Excel File</button>
			</div>



			<form id='admin-account' className="text-white space-y-4 md:w-4/3 px-4" onSubmit={handleSubmit}>
				<div className="">Name*</div>
				<input
					name="name"
					required
					placeholder="e.g. John Doe"
					className="tw-input w-full bg-transparent border-blue-brand ring-1" />
				<div className="">Father Name*</div>
				<input
					name="fname"
					required
					placeholder="e.g. John Doe"
					className="tw-input w-full bg-transparent border-blue-brand ring-1" />
				<div className="">Contact Number*</div>
				<input
					name="phone"
					required
					placeholder="e.g. 03xxxxxxxx"
					className="tw-input w-full bg-transparent border-blue-brand ring-1" />

				<div className="flex flex-col justify-center">
					<button className={clsx("inline-flex w-full items-center tw-btn-blue py-3 font-semibold my-4", { "pointer-events-none": true })}>
						{
							false ?
								<>
									<Spinner />
									<span className={"mx-auto animate-pulse"}>Adding Student...</span>
								</>
								:
								<span className={"mx-auto"}>Add Student</span>
						}
					</button>
					<div className="flex flex-row items-center space-x-2">
						<button className="w-full tw-btn bg-orange-brand text-white">Skip</button>
						<button className="w-full tw-btn bg-teal-500 text-white">Submit</button>
					</div>
				</div>
				<div className="h-1 py-1 text-xs text-red-brand">{ }</div>
			</form>
		</div>
	)
}