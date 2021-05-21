import React from 'react'

import { AppLayout } from 'components/Layout/appLayout'
import Card from 'components/cards/pill-button'

const NavLinks = [
	{
		title: 'Grade Settings',
		link: '/exams/grades',
		icon: ''
	},
	{
		title: 'Promote Students',
		link: '/exams/promote-students',
		icon: ''
	},
	{
		title: 'Manage Datesheets',
		link: '/exams/datesheet',
		icon: ''
	},
	{
		title: 'Marks',
		link: '/exams/marks',
		icon: ''
	},
	{
		title: 'View Results',
		link: '/exams/results',
		icon: ''
	}
]

export const ExamsMenu = () => {
	return (
		<AppLayout title={'Exams Menu'} showHeaderTitle>
			<div className="p-6 mx-auto space-y-4 md:w-2/5">
				{/* <div className="text-2xl font-bold text-center">Exam Menu</div> */}
				<div className="space-y-4">
					{NavLinks.map((link, index) => (
						<Card key={link.link + index} {...link} />
					))}
				</div>
			</div>
		</AppLayout>
	)
}
