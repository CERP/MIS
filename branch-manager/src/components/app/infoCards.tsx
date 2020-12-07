import React, { FC } from 'react'
import { Spinner } from 'components/animation'
import { IconUserGroupSvg } from 'assets/icon-svg'

interface CardItem {
	title: string
	body: string | number
}

interface InfoCardProps extends CardItem {
	loading: boolean
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, body, loading }) => {

	return (
		<div className="flex items-center p-4 border rounded-lg shadow-xs">
			<div className={`p-3 mr-4 rounded-full text-gray-500 bg-gray-200`}>
				<IconUserGroupSvg className={`${loading ? 'animate-pulse' : ''}`} />
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