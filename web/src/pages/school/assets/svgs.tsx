import React from 'react'

export const BackArrowIcon = (props: any) => {
	return (
		<svg
			className="w-6"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			{...props}>
			<path
				fillRule="evenodd"
				d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
				clipRule="evenodd"
			/>
		</svg>
	)
}

export const CopyIcon = (props: any) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="w-4"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			{...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
			/>
		</svg>
	)
}

export const ChainLinkIcon = (props: any) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="w-4"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			{...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
			/>
		</svg>
	)
}

export const CirclePlayIcon = (props: any) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="w-10"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			{...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
			/>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	)
}
