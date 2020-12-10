import React, { FC } from 'react'
import { Spinner } from 'components/animation'
import { IconUserGroupSvg } from 'assets/icon-svg'

interface CardItem {
	title: string
	body: string | number
	logoType?: "user" | "cash"
}

interface InfoCardProps extends CardItem {
	loading: boolean
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, body, loading, logoType }) => {

	return (
		<div className="flex items-center p-4 border rounded-lg shadow-xs">
			<div className={`p-3 mr-4 rounded-full text-gray-500 bg-gray-100`}>
				{!logoType && <IconUserGroupSvg className={`${loading ? 'animate-pulse' : ''}`} />}
				{
					logoType === "cash" &&
					<svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
					</svg>
				}
			</div>
			{
				loading ?
					<div className="mx-auto pr-12 h-14 pt-4">
						<Spinner className="w-6 h-6 mx-auto" />
					</div>
					:
					<div>
						<p className="mb-2 text-sm font-medium text-gray-600 ">{title}</p>
						<p className="text-lg font-semibold text-gray-700">{body}</p>
					</div>
			}
		</div>
	)
}