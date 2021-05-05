import React from 'react'
import clsx from 'clsx'
import { Team } from 'constants/aboutTeam'

interface ReachItemCardProps {
	icon: string
	title: string
	reach: string
}
export const ReachItemCard = ({ icon, title, reach }: ReachItemCardProps) => (
	<div className="flex flex-col items-center space-y-2">
		<img
			className="w-24 h-24 md:w-28 md:h-28 m-8 shadow-md rounded-full"
			src={icon}
			alt={title}
		/>
		<div className="text-2xl font-bold">{reach}</div>
		<div className="text-gray-600">{title}</div>
	</div>
)

interface SolutionCardProps {
	icon: string
	title: string
}
export const SolutionCard = ({
	icon,
	title,
	className
}: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLDivElement>, HTMLDivElement> &
	SolutionCardProps) => (
	<div className={clsx('px-6 py-14 rounded-xl', className)}>
		<img className="w-24 h-24 mx-auto rounded-full shadow-md" src={icon} alt={title} />
		<div className="text-white text-lg text-center mt-2">{title}</div>
	</div>
)

interface TeamMemberCardProps {
	member: Team
}
export const TeamMemberCard = ({ member }: TeamMemberCardProps) => (
	<div className="flex flex-col items-center">
		<div className="mb-2 w-40 p-1 h-40 rounded-full border-4 border-teal-brand">
			<img src={member.avatar_url} className="rounded-full object-cover" />
		</div>
		<div className="font-semibold">{member.name}</div>
		<div className="text-xs text-gray-500">{member.designation}</div>
	</div>
)

interface FeatureItemCardProps {
	title: string
	body: string
	icon: string
}

export const FeatureItemCard = ({ title, body, icon }: FeatureItemCardProps) => (
	<div className="flex flex-row items-center md:items-start">
		<img className="rounded-full w-20 h-20" src={icon} />
		<div className="flex flex-col ml-4">
			<div className="text-lg font-semibold">{title}</div>
			<p>{body}</p>
		</div>
	</div>
)
