import React from 'react'

import { AppLayout } from 'components/layout'
import { load_auth } from 'helpers'
import { DailyStats } from 'components/home/daily_stats'

const Home = () => {

	const schools = load_auth().schools

	return (
		<AppLayout title={'Home'}>
			<div className="pt-8">
				<div className="flex items-center my-5">
					<h1 className="text-2xl font-serif font-bold leading-6 mx-auto">Daily Schools Statistics</h1>
				</div>
				{
					schools?.sort().map(id => (
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

export { Home }