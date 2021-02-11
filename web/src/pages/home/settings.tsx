import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import iconClasses from './assets/classes.svg'
import iconTeachers from './assets/teachers.svg'
import iconStudents from './assets/students.svg'

export const SettingTab = () => {

	const { faculty, students, classes } = useSelector((state: RootReducerState) => state.db)

	return (
		<div className="p-10 md:w-2/5 mx-auto">
			<div className="text-center text-lg mb-6">Tap to configure the module</div>

			<Card title={"Staff"} link="/staff" total={Object.keys(faculty).length} icon={iconTeachers} />
			<Card title={"Classes"} link="/classes" total={Object.keys(classes).length} icon={iconClasses} />
			<Card title={"Students"} link="/students" total={Object.keys(students).length} icon={iconStudents} />
		</div>
	)
}

type TCardProps = {
	title: string
	total: number
	icon: string
	link: string
}

const Card = ({ title, total, icon, link }: TCardProps) => {
	return (
		<Link to={link} className="flex flex-col space-between">
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
		</Link>
	)
}

