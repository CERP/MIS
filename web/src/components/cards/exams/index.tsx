import { TrashIcon } from '@heroicons/react/solid'
import React from 'react'

export const ExamCard = () => {
	return (
		<div className="w-full lg:px-8 px-4 py-4 items-center flex flex-col lg:flex-row rounded-md shadow-md border border-gray-100">
			{/* Applied Flex 1 so div takes up the entire available space */}
			<div className="flex flex-1 flex-row justify-between w-full mb-2">
				<div className="space-y-2 flex flex-1 flex-col">
					<p className="text-lg font-medium">Maths Test</p>
					<p className="text-gray-500">05/05/2021</p>
				</div>
				<div className="space-y-2 items-center lg:items-start flex flex-col flex-1">
					<p className="text-lg font-medium">Class 5</p>
					<p className="text-gray-500">Rainbow</p>
				</div>
				<div className="flex flex-col flex-1 lg:hidden justify-center items-center">
					<button className="tw-btn-red rounded-full p-2 lg:hidden">
						<TrashIcon className="h-6 w-6" />
					</button>
				</div>
			</div>
			<div className="flex flex-1 w-full lg:justify-end space-x-4 justify-evenly">
				<button className="tw-btn justify-center flex flex-1 lg:block lg:max-w-max bg-gray-600 text-white">
					Edit
				</button>
				<button className="tw-btn hidden lg:block bg-yellow-400 text-white">Print</button>
				<button className="tw-btn justify-center flex flex-1 lg:max-w-max lg:block bg-teal-brand text-white">
					Send as SMS
				</button>
				<button className="tw-btn-red p-2.5 rounded-full hidden lg:block">
					<TrashIcon className="h-6 w-6" />
				</button>
			</div>
		</div>
	)
}
