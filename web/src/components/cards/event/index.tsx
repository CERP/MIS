import React from 'react'

interface EventCardProps {
	event: MISEvent
}

export const EventCard = ({ event }: EventCardProps) => (
	<div className="flex flex-col md:flex-row md:space-x-10 w-full space-y-4 md:space-y-0">
		<div className="space-y-1 md:w-2/5 w-full">
			<div className="font-bold text-lg md:text-xl">{event.title}</div>
			<div className="font-semibold text-gray-500">
				{event.date} - {event.location}
			</div>
			<div className="pt-2 text-justify">{event.body}</div>
		</div>
		<div className="md:w-3/5 w-full relative">
			<div className="relative">
				<img
					className="absolute z-20 w-48 h-32 md:w-80 md:h-56 rounded-lg border-2 border-white shadow-md"
					src={event.images[0]}
					alt="event-img-0"
				/>
				<img
					className="absolute z-10 left-24 md:left-60  w-48 h-32 md:w-80 md:h-56 rounded-lg border-2 border-white shadow-md"
					src={event.images[1]}
					alt="event-img-1"
				/>
				<img
					className="absolute right-0  w-48 h-32 md:w-80 md:h-56 rounded-lg border-2 border-white shadow-md"
					src={event.images[2]}
					alt="event-img-2"
				/>
			</div>
		</div>
	</div>
)
