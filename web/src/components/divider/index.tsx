import React from 'react'
import clsx from 'clsx'

type P = {
	text?: string
	dividerColor?: string
	textBgColor?: string
	textColor?: string
}

export const TextDivider: React.FC<P> = ({ text, dividerColor, textBgColor, textColor }) => {
	return (
		<div className={clsx("relative my-8 h-px bg-white", dividerColor)}>
			<div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
				<span className={clsx("bg-gray-700 px-4 text-xs text-white uppercase", textBgColor, textColor)}>{text || 'or'}</span>
			</div>
		</div>
	)
}