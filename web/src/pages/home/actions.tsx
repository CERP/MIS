import React from 'react'
import { Link } from 'react-router-dom'

import iconAttendance from './assets/attendance.svg'
import iconFee from './assets/fee.svg'
import iconMarks from './assets/marks.svg'
import iconSms from './assets/sms.svg'
import iconExams from './assets/exams.svg'

const links: CardProps[] = [
	{
		link: "",
		title: "attendance",
		icon: iconAttendance
	},
	{
		link: "",
		title: "fee",
		icon: iconFee
	},
	{
		link: "",
		title: "exams",
		icon: iconExams
	},
	{
		link: "",
		title: "expense",
		icon: "/favicon.ico"
	},
	{
		link: "",
		title: "diary",
		icon: "/favicon.ico"
	},
	{
		link: "",
		title: "SMS",
		icon: iconSms
	},
	{
		link: "",
		title: "Results",
		icon: "/favicon.ico"
	},
	{
		link: "",
		title: "Analytics",
		icon: iconMarks
	},
	{
		link: "",
		title: "TIP",
		icon: "/favicon.ico"
	}

]

export const ActionTab = () => {
	return (
		<div className="p-10 md:w-4/5 mx-auto">

			<div className="text-center text-lg mb-6 md:hidden">What would you like to do?</div>

			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{
					links.map((link, index) => (
						<Card key={link.title + index} {...link} />
					))
				}
			</div>
		</div>
	)
}

type CardProps = {
	link: string
	title: string
	icon: string
}

const Card = ({ title, icon, link }: CardProps) => {
	return (
		<Link to={link}>
			<div className="p-5 border rounded-2xl shadow-md hover:shadow-lg">
				<div className="flex flex-col items-center space-y-4">
					<img className="w-20 h-20 rounded-full" src={icon} alt="icon" />
					<div className="text-lg capitalize">{title}</div>
				</div>
			</div>
		</Link>
	)
}