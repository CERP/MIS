import React, { useLayoutEffect, useState } from 'react'

import { AppLayout } from 'components/Layout/appLayout'
import { getTeamMembersInfo, Team } from 'constants/aboutTeam'
import { TeamMemberCard } from 'components/cards/landing'
import { useMediaPredicate } from 'react-media-hook'
import chunkify from 'utils/chunkify'
import clsx from 'clsx'
import { MISEvents } from 'constants/events'
import { EventCard } from 'components/cards/event'

export const AboutUs = () => {
	return (
		<AppLayout title={'About Us'}>
			<div className="mb-40 md:mb-20">
				<div className="my-5 md:my-14 font-bold text-center text-2xl md:text-3xl">
					Our Story
				</div>
				<div className="flex flex-row flex-wrap h-full md:h-96">
					<div className="w-full md:w-1/3 h-full">
						<div className="px-10 md:px-15 text-justify">
							Sed ut perspiciatis unde omnis iste natus error sit voluptatem
							accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
							illo inventore veritatis et quasi architecto beatae vitae dicta sunt
							explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
							odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
							voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum
							quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam
							eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
							voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam
							corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
						</div>
						<div className="block md:hidden w-full md:w-2/3 px-10 md:pr-0 mt-10">
							<iframe
								src="https://youtube.com/embed/cm73XDWTiNQ?controls=0&rel=0"
								className="bg-gray-500 w-full h-60 md:h-full rounded-3xl md:rounded-tr-none md:rounded-br-none"
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;"
								allowFullScreen
								title="MISchool Intro"
							/>
						</div>
						<div className="px-10 my-10 2xl:mt-8 md:pl-20 md:pr-0"></div>
					</div>
					<div className="hidden md:block w-full md:w-2/3 px-10 md:pr-0">
						<iframe
							src="https://youtube.com/embed/cm73XDWTiNQ?controls=0&rel=0"
							className="bg-gray-500 w-full h-60 md:h-full rounded-3xl md:rounded-tr-none md:rounded-br-none"
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;"
							allowFullScreen
							title="MISchool Intro"
						/>
					</div>
				</div>
				<div className="my-5 md:my-14 font-bold text-center text-2xl md:text-3xl">
					Our Team
				</div>
				<TeamSlider />
				<div className="my-5 md:my-14 font-bold text-center text-2xl md:text-3xl">
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

const members = getTeamMembersInfo()

const TeamSlider = () => {
	const [slideIndex, setSlideIndex] = useState(0)
	const MEMBERS_PER_SLIDE = useMediaPredicate('(min-width: 640px)') ? 5 : 4
	const slides = Math.ceil(members.length / MEMBERS_PER_SLIDE)

	// useLayoutEffect(() => {
	// 	setTimeout(() => {
	// 		const currIndex = slideIndex < slides - 1 ? slideIndex + 1 : 0
	// 		setSlideIndex(currIndex)
	// 	}, 5000)
	// }, [slideIndex])

	return (
		<div className="mt-10 px-10 md:px-40 transition delay-150 duration-300 ease-in-out">
			<div className="grid gap-12 grid-cols-2 md:grid-cols-5 mx-auto">
				{chunkify(members || [], MEMBERS_PER_SLIDE)[slideIndex].map((member: Team) => (
					<TeamMemberCard key={member.name} member={member} />
				))}
			</div>
			<div className="flex flex-row items-center justify-center space-x-4 mt-4">
				{[...new Array(slides)].map((v, index) => (
					<div
						key={index}
						onClick={() => setSlideIndex(index)}
						className={clsx(
							'w-6 h-6 md:h-8 md:w-8 rounded-full cursor-pointer hover:bg-teal-brand border border-teal-brand shadow-md',
							{
								'bg-teal-brand': index === slideIndex
							}
						)}></div>
				))}
			</div>
		</div>
	)
}
