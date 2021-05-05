import React, { useState } from 'react'
import clsx from 'clsx'
import { Transition } from '@headlessui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import { feedbacks } from 'constants/feedback'

export const CustomerFeedback = () => {
	const [index, setIndex] = useState(0)

	const feedback = feedbacks[index]

	return (
		<Transition
			enter="transition-opacity duration-75"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="transition-opacity duration-150"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
			as={'div'}
			appear={true}
			show={true}
			className="w-full md:w-2/3 mt-20 md:mt-0 px-10 md:px-20">
			<div className="relative">
				<div className="h-96 bg-red-brand rounded-xl text-center text-white shadow-lg">
					<div className="pt-20 md:pt-28">
						<div className="font-bold">{feedback.name}</div>
						<div>
							{feedback.type} {feedback.school}
						</div>
					</div>
					<p className="mt-4 px-5 md:mt-8 md:px-20 h-32 md:h-24 text-justify leading-5 md:leading-normal text-xs md:text-sm">
						{feedback.body}
					</p>
					<div className="flex justify-center items-center mt-16 md:mt-12 space-x-2">
						{[...new Array(feedbacks.length).keys()].map(v => (
							<div
								key={v + feedback.name}
								onClick={() => setIndex(v)}
								className={clsx(
									'h-5 w-5 rounded-full cursor-pointer',
									v === index ? 'bg-teal-brand' : 'bg-white'
								)}
							/>
						))}
					</div>
				</div>
				<div className="absolute -top-10 md:-top-16 left-0 right-0">
					<img
						src={feedback.avatar}
						className="mx-auto h-28 w-28 md:h-40 md:w-40 rounded-full p-1 bg-white border-4 border-red-brand shadow-md object-cover"
						alt={feedback.name}
					/>
				</div>
				<ChevronRightIcon
					onClick={index < feedbacks.length - 1 ? () => setIndex(index + 1) : undefined}
					className="hidden md:block text-white bg-red-brand hover:text-red-brand hover:bg-gray-100 w-14 cursor-pointer rounded-full p-1 inset-y-40 -right-40 absolute"
				/>
				<ChevronLeftIcon
					onClick={index > 0 ? () => setIndex(index - 1) : undefined}
					className="hidden md:block text-white bg-red-brand hover:text-red-brand hover:bg-gray-100 w-14 cursor-pointer rounded-full p-1 inset-y-40 -left-40 absolute"
				/>
			</div>
		</Transition>
	)
}
