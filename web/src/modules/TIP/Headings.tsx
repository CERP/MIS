import React from 'react'

interface P {
	heading?: string
	sub_heading?: string
}

const Headings: React.FC<P> = ({ heading, sub_heading }) => {
	return (
		<div className="w-full print:hidden">
			<div className="text-blue-900 text-2xl text-center">{heading}</div>
			<div className="text-blue-900 text-lg font-thin	text-center">{sub_heading}</div>
		</div>
	)
}

export default Headings
