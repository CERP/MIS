import React from 'react'

interface P {
	title: string
}

export const PageHeading: React.FC<P> = ({ title }) => {
	return (
		<div className="text-center text-gray-700 md:text-left">
			<h2 className="text-2xl font-semibold leading-tight">{title}</h2>
		</div>
	)
}

export const PageSubHeading: React.FC<P> = ({ title }) => {
	return (
		<div className="text-center text-gray-700 md:text-left">
			<h2 className="text-xl font-semibold leading-tight">{title}</h2>
		</div>
	)
}