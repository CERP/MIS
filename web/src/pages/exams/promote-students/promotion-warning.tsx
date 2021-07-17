import React from 'react'

interface PromotionWarningProps {
	onPress: () => void
}

export const PromotionWarning = ({ onPress }: PromotionWarningProps) => {
	return (
		<div className="flex-1 flex justify-center flex-col items-center ">
			<p className="w-32 h-32 rounded-full items-center justify-center flex text-6xl bg-blue-brand text-center text-white mt-10">
				!
			</p>
			<p className="font-bold mt-8 mb-4">You are going to </p>
			<p className="font-semibold text-3xl text-blue-brand">Open Promotions</p>
			<p className="font-normal my-4 text-lg text-center">
				You can promote a class only once per academic year
			</p>
			<button onClick={() => onPress()} className=" tw-btn-blue font-semibold">
				Ok, I understand
			</button>
		</div>
	)
}
