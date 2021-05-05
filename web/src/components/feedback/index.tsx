import React, { useState } from 'react'
import clsx from 'clsx'

import { feedbacks } from 'constants/feedback'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'

export const CustomerFeedback = () => {
	const [index, setIndex] = useState(0)

	// useLayoutEffect(() => {
	// 	setTimeout(() => {
	// 		const currIndex = index < feedbacks.length - 1 ? index + 1 : 0
	// 		setIndex(currIndex)
	// 	}, 5000)
	// }, [index])

	const feedback = feedbacks[index]

	const nextIndex = index + 1
	const prevIndex = index - 1

	return (
		<div className="w-full md:w-2/3 mt-20 md:mt-0 px-10 md:px-20">
			<div className="relative">
				<div className="h-96 bg-red-brand rounded-xl text-center text-white">
					<div className="pt-28">
						<div className="font-bold">{feedback.name}</div>
						<div>
							{feedback.type} {feedback.school}
						</div>
					</div>
					<p className="mt-5 px-5 md:mt-10 md:px-20 h-28 md:h-24 text-justify">
						{feedback.body}
					</p>
					<div className="flex justify-center items-center mt-10 space-x-2">
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
						className="mx-auto h-28 w-28 md:h-40 md:w-40 rounded-full p-1 bg-white border-4 border-red-brand shadow-md"
						alt={feedback.name}
					/>
				</div>
				<ChevronRightIcon
					onClick={
						nextIndex <= feedbacks.length - 1 ? () => setIndex(nextIndex) : undefined
					}
					className="hidden md:block text-white bg-red-brand hover:text-red-brand hover:bg-gray-100 w-14 cursor-pointer rounded-full p-2 inset-y-40 -right-40 absolute"
				/>
				<ChevronLeftIcon
					onClick={
						nextIndex >= feedbacks.length - 1 ? () => setIndex(prevIndex) : undefined
					}
					className="hidden md:block text-white bg-red-brand hover:text-red-brand hover:bg-gray-100 w-14 cursor-pointer rounded-full p-2 inset-y-40 -left-40 absolute"
				/>
			</div>
		</div>
	)
}
