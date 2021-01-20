import React from 'react'
import clsx from 'clsx'

import { Spinner } from 'components/Animation/spinner'

type TCreateClassProps = {}

export const CreateClass: React.FC<TCreateClassProps> = () => {

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

	}

	return (
		<div className="md:w-4/5 md:mx-auto flex flex-col items-center space-y-3 rounded-2xl bg-gray-700 my-4 md:mt-8">

			<div className="text-white text-center text-base my-5">Please Add your First Class</div>

			<form id='admin-account' className="text-white space-y-4 md:w-4/3 px-4" onSubmit={handleSubmit}>
				<div className="">Name*</div>
				<select
					name="class"
					required
					className="tw-select w-full bg-transparent border-blue-brand ring-1" />
				<div className="">Sections*</div>
				<input
					name="section"
					required
					className="tw-input w-full bg-transparent border-blue-brand ring-1" />
				<div className="">Subjects*</div>
				<div className="">Assign Class Teacher*</div>
				<div className="flex">

				</div>
				<div className="flex flex-col justify-center">
					<button className={clsx("inline-flex w-full items-center tw-btn-blue py-3 font-semibold my-4", { "pointer-events-none": true })}>
						{
							false ?
								<>
									<Spinner />
									<span className={"mx-auto animate-pulse"}>Creating Class...</span>
								</>
								:
								<span className={"mx-auto"}>Create Class</span>
						}
					</button>
					<button className="w-3/5 mx-auto tw-btn bg-orange-brand text-white">Skip</button>
				</div>
				<div className="h-1 py-1 text-xs text-red-brand">{ }</div>
			</form>
		</div>
	)
}