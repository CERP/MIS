import React, { useLayoutEffect, useState } from 'react'

import { feedback } from 'constants/feedback'

export const CustomerFeedback = () => {

	const [index, setIndex] = useState(0)

	useLayoutEffect(() => {
		setTimeout(() => {
			const currIndex = index < feedback.length - 1 ? index + 1 : 0
			setIndex(currIndex)
		}, 5000)
	}, [index])

	const currFeedback = feedback[index]

	return (
		<div className="w-full md:w-2/3 mt-20 md:mt-0 px-10 md:px-20">
			<div className="relative">
				<div className="h-96 bg-red-brand rounded-xl text-center text-white">
					<div className="pt-28">
						<div className="font-bold">{currFeedback.name}</div>
						<div>{currFeedback.type + " " + currFeedback.school}</div>
					</div>
					<div className="mt-5 px-5 md:mt-10 md:px-20 h-28 md:h-24">{currFeedback.feedback}</div>
					<div className="flex justify-center items-center mt-10 space-x-2">
						{
							[0, 1, 2].map(v => (
								<div key={v + currFeedback.name}
									className={`h-4 w-4 rounded-full ${v === index ? 'bg-green-500' : 'bg-white'}`}></div>
							))
						}
					</div>
				</div>
				<div className="absolute -top-10 md:-top-16 left-0 right-0">
					<img src={currFeedback.avatar} className="mx-auto h-28 w-28 md:h-40 md:w-40 rounded-full p-1 bg-white border-4 border-red-brand shadow-md " alt="school-owner" />
				</div>
			</div>
		</div>
	)
}