import React from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { DownloadIcon } from '@heroicons/react/outline'

import { isMobile } from 'utils/helpers'
import iconFee from 'assets/svgs/fee.svg'
import iconMarks from 'assets/svgs/marks.svg'
import iconSms from 'assets/svgs/sms.svg'
import iconExams from 'assets/svgs/exams.svg'
import iconAttendance from 'assets/svgs/attendance.svg'
import iconDiary from 'assets/svgs/diary.svg'
import iconExpense from 'assets/svgs/expense.svg'
import { TIP } from 'assets/icons'

import { checkPermission } from 'utils'

const links: CardProps[] = [
	{
		link: '/attendance',
		title: 'attendance',
		icon: iconAttendance
	},
	{
		link: '/diary',
		title: 'diary',
		icon: iconDiary
	},
	{
		link: '/sms',
		title: 'SMS',
		icon: iconSms
	},
	{
		link: '/fees',
		title: 'fees',
		icon: iconFee
	},
	{
		link: '/exams',
		title: 'exams',
		icon: iconExams
	},
	{
		link: '/expenses',
		title: 'expenses',
		icon: iconExpense
	},
	{
		link: '/reports-menu',
		title: 'results',
		icon: iconExams
	},
	{
		link: '/analytics',
		title: 'analytics',
		icon: iconMarks
	}
]

type PropTypes = {
	permissions: {
		fee: boolean
		dailyStats: boolean
		setupPage: boolean
		expense: boolean
		family: boolean
		prospective: boolean
	}
	admin: boolean
	subAdmin: boolean
}

const tipLink = {
	link: '/targeted-instruction',
	title: 'TIP',
	icon: TIP
}

export const ActionTab = ({ permissions, admin, subAdmin }: PropTypes) => {
	const isActiveInternetConnection = useSelector((state: RootReducerState) => state.connected)
	const tip_access = useSelector(
		(state: RootReducerState) => state.db.targeted_instruction_access
	)

	const sortedLinks = tip_access ? [tipLink, ...links] : links

	return (
		<div className="p-10 pt-6 mx-auto mb-10 md:w-full">
			<div className="mb-6 text-lg text-center md:hidden">What would you like to do?</div>
			<div className="grid grid-cols-2 gap-4">
				{sortedLinks.map((link, index) => (
					<Card
						key={link.title + index}
						{...link}
						disabled={
							!checkPermission(permissions, link.title, subAdmin, admin, tip_access)
						}
					/>
				))}
			</div>
			{isMobile() && isActiveInternetConnection && (
				<a
					href="https://github.com/CERP/MIS/raw/master/android/app/release/app-release.apk"
					target="_blank"
					rel="noreferrer">
					<div className="flex items-center fixed z-50 bottom-4 right-4 rounded-full bg-blue-brand text-white lg:hidden py-2 px-4 w-11/12 text-sm mr-0.5">
						<DownloadIcon className="w-4 h-4" />
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
	disabled?: boolean
}

const Card = ({ title, icon, link, disabled = false }: CardProps) => {
	return (
		<Link to={disabled ? '#' : link}>
			<div
				onClick={() => {
					disabled ? toast.error("You don't have permission to access!") : {}
				}}
				className={clsx(
					'p-4 border shadow-md border-gray-50 rounded-2xl hover:shadow-lg',
					disabled ? 'bg-gray-200 opacity-75 cursor-not-allowed' : 'bg-white'
				)}>
				<div className="flex flex-col items-center space-y-4">
					<img className="w-20 h-20 rounded-full" src={icon} alt="icon" />
					<div className="text-lg capitalize">{title}</div>
				</div>
			</div>
		</Link>
	)
}
