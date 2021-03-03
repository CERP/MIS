import React from "react"
import { Link } from "react-router-dom"

type CardProps = {
	title: string
	caption?: string
	icon: string
	link: string
}

export const PillCardButton = ({ title, caption, icon, link }: CardProps) => {
	return (
		<Link to={link} className="flex flex-col space-between">
			<div className="p-3 rounded-full flex flex-row justify-between border shadow-md items-center border-gray-50">
				<div className="flex flex-row items-center">
					<img className="mr-4 w-12 h-12 rounded-full" src={icon} alt="icon" />
					<div className="flex flex-col overflow-ellipsis truncate w-10/12">
						<div className="text-gray-900 font-semibold">{title}</div>
						{caption && <div className="text-gray-500">{caption}</div>}
					</div>
				</div>
				<div className="flex items-center w-10 h-10 rounded-full border bg-blue-brand">
					<svg className="w-8 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
					</svg>
				</div>
			</div>
		</Link>
	)
}

export default PillCardButton
