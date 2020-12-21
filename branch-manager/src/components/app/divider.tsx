import React from 'react'

type P = {
	text?: string
}

export const TextDivider: React.FC<P> = ({ text }) => {
	return (
		<div className="relative my-8 h-px bg-gray-300">
			<div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
				<span className="bg-white px-4 text-xs text-gray-500 uppercase">{text || 'or'}</span>
			</div>
		</div>
	)
}