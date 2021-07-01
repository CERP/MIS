import React, { useState } from 'react'
import clsx from 'clsx'
import chunkify from 'utils/chunkify'

import { AppLayout } from 'components/Layout/appLayout'
import { getTeamMembersInfo, Team } from 'constants/aboutTeam'
import { TeamMemberCard } from 'components/cards/landing'
import { useMediaPredicate } from 'react-media-hook'
import { MISEvents } from 'constants/events'
import { EventCard } from 'components/cards/event'
import { Link } from 'react-router-dom'

export const AboutUs = () => {
	return (
		<AppLayout title={'About Us'}>
			<div className="mb-40 md:mb-32">
				<div className="my-5 md:my-10 font-bold text-center text-2xl md:text-3xl">
					Our Story
				</div>
				<div className="flex flex-row flex-wrap h-full">
					<div className="w-full md:w-1/3 h-full">
						<div className="px-10 md:px-15 text-justify">
							<p>
								<a href="https://cerp.org.pk" className="text-teal-brand underline">
									CERP
								</a>{' '}
								has been working to introduce innovative solutions in the field of
								education since the last 15 years. Our researchers have been closely
								working with low-cost private schools and have found that data such
								as attendance, enrollment, fee collection, and grade performance has
								been documented in registers and maintained manually by the school
								administrators and teachers over the years. Manual record keeping
								has proven to be costly, time consuming, and unreliable for school.
								This system of administration and management increases the risk of
								losing information and documenting inaccurate data which may affect
								the schools’ informed decision making and consequently, students’
								education. The CERP education program recognized the need to bridge
								this gap between dadivta and developed MISchool as an ideal
								solution.
							</p>
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
					</div>
					<div className="hidden md:block w-full md:w-2/3 md:pr-0 md:h-96">
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
				<div className="px-10 md:px-15 text-justify mt-8 md:mt-2">
					<p>
						In order to maximize the usefulness and compatibility of MISchool, the CERP
						Education program worked directly with around 50 schools during the
						development phase to iteratively design and prioritize various features with
						school owners, admins and teachers.
					</p>
					<br />
					<p>
						MISchool is a management information system carefully created and designed
						as an application to increase the management capacity of low-cost private
						schools. MISchool enables schools to collect, organize, and store records
						giving schools full control of all academic, financial, and administrative
						information. This application allows users to sync data between different
						school devices in real-time when online, and has the additional feature of
						queueing all changes made offline on the device until internet connectivity
						returns - this ensures that all data being stored is accurate, reliable, and
						secure. The system has been designed to not only save time and effort, but
						has also proved to be a cost effective and eco friendly solution for
						schools.
					</p>
					<br />
					<p>
						In August 2019, the MISchool team entered the market in six districts of
						Punjab - through our sales associates and strong customer support center we
						were successful in introducing 1000+ schools to the world of technology and
						management softwares, and reached over 300 schools in six months.
					</p>
				</div>

				<div className="my-8 md:my-16 font-bold text-center text-2xl md:text-3xl">
					Our Team
				</div>

				<TeamSlider />

				<div className="my-8 md:my-16 font-bold text-center text-2xl md:text-3xl">
					Our Events
				</div>

				<div className="space-y-40 md:space-y-12 px-5 md:px-10">
					{MISEvents.slice(0, 2).map((event, index) => (
						<EventCard key={event.title.length + index} event={event} />
					))}
				</div>
			</div>

			<div className="mx-auto flex justify-center mb-16 px-5">
				<Link
					to="/events"
					className="tw-btn bg-teal-brand text-white w-full md:w-auto text-center  md:px-16">
					View our all Events
				</Link>
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
