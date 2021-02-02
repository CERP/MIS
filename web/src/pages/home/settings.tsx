import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'


export const SettingTab = () => {

	const { faculty, students, classes } = useSelector((state: RootReducerState) => state.db)

	return (
		<div className="p-10 md:w-2/5 mx-auto">
			<div className="text-center text-lg mb-6">Tap to configure the module</div>

			<div className="space-y-4">
				<Link to="/staff">
					<Card title={"Staff"} total={Object.keys(faculty).length} icon={"/favicon.ico"} />
				</Link>
				<Card title={"Classes"} total={Object.keys(classes).length} icon={"/favicon.ico"} />
				<Card title={"Students"} total={Object.keys(students).length} icon={"/favicon.ico"} />
			</div>

		</div>
	)
}

type TCardProps = {
	title: string
	total: number
	icon: string
}

const Card = ({ title, total, icon }: TCardProps) => {
	return (
		<div className="p-3 rounded-full flex flex-row justify-between border shadow-md items-center">
			<div className="flex flex-row">
				<img className="mr-4 w-12 h-12 rounded-full" src={icon} alt="icon" />
				<div className="flex flex-col">
					<div className="text-gray-900 font-semibold">{title}</div>
					<div className="text-gray-500">Total = {total}</div>
				</div>
			</div>
			<div className="flex items-center w-10 h-10 rounded-full border bg-blue-brand">
				<svg className="w-8 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
				</svg>
			</div>
		</div>
	)
}

