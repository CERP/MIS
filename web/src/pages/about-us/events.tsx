import React from 'react'

import { AppLayout } from 'components/Layout/appLayout'
import { EventCard } from 'components/cards/event'
import { MISEvents } from 'constants/events'

export const Events = () => {
	return (
		<AppLayout title={'Events'}>
			<div className="mb-40 md:mb-32">
				<div className="my-8 md:my-10 font-bold text-center text-2xl md:text-3xl">
					Our Events
				</div>

				<div className="space-y-40 md:space-y-12 px-5 md:px-10">
					{MISEvents.map((event, index) => (
						<EventCard key={event.title.length + index} event={event} />
					))}
				</div>
			</div>
		</AppLayout>
	)
}
