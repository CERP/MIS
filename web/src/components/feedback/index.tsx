import React, { useLayoutEffect, useState } from 'react'
import clsx from 'clsx'

import { feedbacks } from 'constants/feedback'

export const CustomerFeedback = () => {
	const [index, setIndex] = useState(0)

	useLayoutEffect(() => {
		setTimeout(() => {
			const currIndex = index < feedbacks.length - 1 ? index + 1 : 0
			setIndex(currIndex)
		}, 5000)
	}, [index])

	const feedback = feedbacks[index]

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
						{[0, 1, 2].map(v => (
							<div
								key={v + feedback.name}
								className={clsx(
									'h-4 w-4 rounded-full',
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
			</div>
		</div>
	)
}
