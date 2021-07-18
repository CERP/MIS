import React from 'react'

import { AppLayout } from 'components/Layout/appLayout'
import { FilterIcon } from '@heroicons/react/outline'
import { useComponentVisible } from 'hooks/useComponentVisible'
import { Popover, Transition } from '@headlessui/react'

//temporary variables to check functionlity
const dataExists = true

export const Datesheet = () => {
	return (
		<AppLayout title="Datesheet" showHeaderTitle>
			<div className="p-5 md:w-4/5 mx-auto md:pt-8 md:pb-0 text-gray-700 relative">
				{/* Visible on Desktop Only, we will map options with the available data here to populate the filters */}
				<div
					key="filtersDesktop"
					className="justify-between space-x-6 hidden lg:flex flex-row">
					<ExamFilters />
				</div>
				{/* Visible on Mobile and Tablets Only, we will map options with the available data here to populate the filters */}
				<Popover key="filtersMobile" className="relative ">
					<Popover.Button className=" lg:hidden tw-btn focus:outline-none py-1 rounded-full shadow-md border-gray-400 border items-center font-medium flex flex-row mx-auto">
						Filters
						<FilterIcon className="h-5 ml-2" />
					</Popover.Button>
					<Transition
						enter="transition duration-100 ease-out"
						enterFrom="transform scale-95 opacity-0"
						enterTo="transform scale-100 opacity-100"
						leave="transition duration-75 ease-out"
						leaveFrom="transform scale-100 opacity-100"
						leaveTo="transform scale-95 opacity-0">
						<Popover.Panel className="absolute w-full mt-4 py-20 px-10 rounded-md border h-96 bg-white shadow-md border-gray-400 z-10 flex flex-col justify-between">
							<ExamFilters />
						</Popover.Panel>
					</Transition>
				</Popover>
				{dataExists ? (
					<h1>Display Cards</h1>
				) : (
					<div className="h-96 md:text-lg w-full justify-center flex items-center">
						<p className="mx-2 text-center">
							No Datesheet/Exam to display,
							<span className="text-teal-brand ml-1 font-medium">
								Create New Test/Exam
							</span>
						</p>
					</div>
				)}
				<button className="tw-btn-blue focus:outline-none block w-full md:w-2/5 m-auto font-medium">
					Create New Test/Exam
				</button>
			</div>
		</AppLayout>
	)
}

const ExamFilters = () => {
	return (
		<>
			{/* Had to use text-xl for symmetry purposes with the select */}
			<div className="flex flex-row items-center lg:w-1/4 w-full space-x-2">
				<p className="text-xl text-gray-700 w-1/3">Class</p>
				<select className="tw-select text-teal-brand flex-1">
					<option value="">Select</option>
				</select>
			</div>
			<div className="flex flex-row items-center lg:w-1/4 w-full space-x-2">
				<p className="text-xl text-gray-700 w-1/3">Section</p>
				<select className="tw-select text-teal-brand flex-1">
					<option value="">Select</option>
				</select>
			</div>
			<div className="flex flex-row items-center lg:w-1/4 w-full space-x-2">
				<p className="text-xl text-gray-700 w-1/3">Exam</p>
				<select className="tw-select text-teal-brand flex-1">
					<option value="">Select</option>
				</select>
			</div>
			<div className="flex flex-row items-center lg:w-1/4 w-full space-x-2">
				<p className="text-xl text-gray-700 w-1/3">Year</p>
				<select className="tw-select text-teal-brand flex-1">
					<option value="">Select</option>
				</select>
			</div>
		</>
	)
}
