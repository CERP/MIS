import React from 'react'
import { useSelector } from 'react-redux'
import { AppState } from 'reducers'

import { AppLayout } from 'components/layout'
import { DailyStats } from 'components/home/dailyStats'
import { PageHeading } from 'components/app/pageHeading'

export const Home = () => {

	const schools = useSelector((state: AppState) => state.user.schools)

	return (
		<AppLayout title={'Home'}>
			<div className="container mx-auto md:ml-64 px-4 sm:px-8">
				<div className="py-8">
					<PageHeading title="Daily Statistics" />
					<div className="flex flex-col">
						{
							Object.keys(schools).sort().map(id => (
								<div key={id} className="w-11/12 mx-auto text-center">
									<div className="font-bold pt-1 pb-5 md:pt-5 md:pb-8 uppercase">
										<p className="text-gray-700">{id}</p>
									</div>
									<DailyStats school_id={id} />
								</div>
							))
						}
					</div>
				</div>
			</div>
		</AppLayout>
	)
}