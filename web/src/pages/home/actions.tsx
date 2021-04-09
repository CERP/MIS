import React from 'react'
import { Link } from 'react-router-dom'
import { isMobile } from 'utils/helpers'

import iconFee from './assets/fee.svg'
import iconMarks from './assets/marks.svg'
import iconSms from './assets/sms.svg'
import iconExams from './assets/exams.svg'
import iconAttendance from './assets/attendance.svg'
import iconDiary from './assets/diary.svg'
import iconExpense from './assets/expense.svg'

const links: CardProps[] = [
	{
		link: '/school/attendance',
		title: 'attendance',
		icon: iconAttendance
	},
	{
		link: '/school/fees',
		title: 'fees',
		icon: iconFee
	},
	{
		link: '/school/exams',
		title: 'exams',
		icon: iconExams
	},
	{
		link: '/school/expenses',
		title: 'expense',
		icon: iconExpense
	},
	{
		link: '/school/diary',
		title: 'diary',
		icon: iconDiary
	},
	{
		link: '/sms',
		title: 'SMS',
		icon: iconSms
	},
	{
		link: '',
		title: 'Results',
		icon: '/favicon.ico'
	},
	{
		link: '/school/analytics',
		title: 'Analytics',
		icon: iconMarks
	},
	{
		link: '/targeted-instruction',
		title: 'TIP',
		icon: '/favicon.ico'
	}
]

export const ActionTab = () => {
	return (
		<div className="p-10 md:w-4/5 mx-auto mb-10">
			<div className="text-center text-lg mb-6 md:hidden">What would you like to do?</div>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{links.map((link, index) => (
					<Card key={link.title + index} {...link} />
				))}
			</div>
			{isMobile() && (
				<a
					href="https://github.com/CERP/MIS/raw/master/android/app/release/app-release.apk"
					target="_blank"
					rel="noreferrer">
					<div className="flex items-center fixed z-50 bottom-4 right-4 rounded-full bg-blue-brand text-white lg:hidden py-2 px-4 w-11/12 text-sm mr-0.5">
						<svg
							className="w-4 h-4"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
							/>
						</svg>
						<span className="ml-4">Tap here to Download Companion App</span>
					</div>
				</a>
			)}
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
			<div className="p-5 border border-gray-50 rounded-2xl shadow-md hover:shadow-lg bg-white">
				<div className="flex flex-col items-center space-y-4">
					<img className="w-20 h-20 rounded-full" src={icon} alt="icon" />
					<div className="text-lg capitalize">{title}</div>
				</div>
			</div>
		</Link>
	)
}
