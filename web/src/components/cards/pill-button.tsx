import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/outline'

type CardProps = {
	title: string
	caption?: string
	icon: string
	link: string
}

export const PillCardButton = ({ title, caption, icon, link }: CardProps) => {
	return (
		<Link to={link} className="flex flex-col space-between">
			<div className="p-3 rounded-full flex flex-row justify-between border shadow-md items-center border-gray-50 bg-white">
				<div className="flex flex-row items-center">
					<img className="mr-4 w-12 h-12 rounded-full" src={icon} alt="icon" />
					<div className="flex flex-col overflow-ellipsis truncate w-10/12">
						<div className="text-gray-900 font-semibold">{title}</div>
						{caption && <div className="text-gray-500 text-sm">{caption}</div>}
					</div>
				</div>
				<ChevronRightIcon className="w-10 h-10 p-1 rounded-full border bg-blue-brand text-white" />
			</div>
		</Link>
	)
}

export default PillCardButton
