import React from 'react'
import { useSelector } from 'react-redux'
import { AppState } from 'reducers'

import { AppLayout } from 'components/layout'
import { DailyStats } from 'components/home/dailyStats'

export const Home = () => {

	const schools = useSelector((state: AppState) => state.user.schools)

	return (
		<AppLayout title={'Home'}>
			<div className="pt-8">
				<div className="flex items-center my-5">
					<h1 className="text-2xl font-serif font-bold leading-6 mx-auto">Daily Schools Statistics</h1>
				</div>
				{
					Object.keys(schools).sort().map(id => (
						<div key={id} className="font-serif">
							<div className="text-lg font-bold leading-6 text-center mb-2">{id}</div>
							<DailyStats school_id={id} />
						</div>
					))
				}
				<div className="flex items-center my-5">
					<h1 className="text-2xl font-serif font-bold leading-6 mx-auto">Schools Enrollment Statistcs</h1>
				</div>
			</div>
		</AppLayout>
	)
}