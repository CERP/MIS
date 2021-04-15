import React from 'react'
import { Link } from 'react-router-dom'

import { getTeamMembersInfo } from 'constants/aboutTeam'
import { PackageList } from 'components/package'
import { AppLayout } from 'components/Layout/appLayout'
import { CustomerFeedback } from 'components/feedback'
import { FeatureCard, ReachCard, TeamMemberCard } from 'components/cards/landing'

import iconCall from './assets/call.svg'
import iconCloud from './assets/cloud.svg'
import iconCoin from './assets/coin.svg'
import iconDesktop from './assets/desktop.svg'
import iconGlobe from './assets/globe.svg'
import iconGraduationCap from './assets/graduation-cap.svg'
import iconParent from './assets/parent.svg'
import iconPlug from './assets/plug.svg'
import iconSchool from './assets/school.svg'
import iconTeacher from './assets/teacher.svg'

export const Landing = () => {
	// TODO: show modal for help button

	return (
		<AppLayout>
			<div className="w-full mt-10 md:mt-20">
				<div className="flex flex-row flex-wrap h-full md:h-96">
					<div className="w-full md:w-1/3 h-full">
						<div className="px-10 md:px-20">
							<div className="text-6xl 2xl:text-7xl font-bold">
								We Help Schools thrive.
							</div>
							<div className="mt-4 text-lg 2xl:text-2xl">
								With <span className="text-red-brand font-bold">MISchool</span>{' '}
								which is a single solution for all your school management issues.
							</div>
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
						<div className="px-10 my-10 2xl:mt-8 md:pl-20 md:pr-0">
							<div className="flex flex-row space-x-2">
								<Link
									to="/school-login"
									className="w-1/2 py-2 md:py-3 px-6 rounded-md border-2 text-center text-lg hover:bg-teal-400 hover:text-white text-teal-brand border-teal-brand">
									Login
								</Link>
								<Link
									to="/signup"
									className="w-full py-2 md:py-3 px-6 text-center rounded-md text-lg text-white bg-teal-brand hover:bg-teal-400">
									Try For Free
								</Link>
							</div>
							<div className="my-2">
								Not sure? Click here to{' '}
								<span className="text-teal-brand cursor-pointer">
									Schedule a demo
								</span>
							</div>
						</div>
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
				<div className="mt-10 md:mt-20 py-10 bg-teal-50 md:min-h-screen">
					<div className=" text-3xl font-semibold text-center">Why Us?</div>
					<div className="flex flex-row flex-wrap mt-10 md:mt-20">
						<div className="w-full md:w-1/3 h-full">
							<div className="px-10 md:pl-20 md:pr-0">
								<div className="text-xl md:text-2xl font-bold ">
									School Problems
								</div>
								<div className="mt-5 ml-5">
									<ul className="text-sm md:text-base space-y-2 md:space-y-4  list-decimal">
										<li>
											<div>
												Keep track of Students and Teachers attendance and
												sending messsages.
											</div>
										</li>
										<li>
											<div>
												Fee challan generation and keeping track of all
												expenses.
											</div>
										</li>
										<li>
											<div>
												Daily and Monthly test result generation and
												distribution.
											</div>
										</li>
										<li>
											<div>Communication with parents.</div>
										</li>
										<li>
											<div>Data analytics to make informed decisions.</div>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<CustomerFeedback />
					</div>

					<div className=" text-3xl font-semibold text-center mt-20">MISchool Reach</div>

					<div className="flex flex-row flex-wrap items-center justify-center px-20 space-y-4 md:space-x-16 md:space-y-0 mt-10">
						<ReachCard icon={iconGlobe} title="Cities" reach="50+" />
						<ReachCard icon={iconSchool} title="Schools" reach="120+" />
						<ReachCard icon={iconTeacher} title="Teachers" reach="3500+" />
						<ReachCard icon={iconGraduationCap} title="Students" reach="120,000+" />
						<div className="flex flex-col items-center space-y-2">
							<div className="w-24 h-24 md:w-28 md:h-28 rounded-full m-8 bg-orange-brand shadow-md">
								<img
									className="w-16 h-16 m-4 md:m-6"
									src={iconParent}
									alt="parent"
								/>
							</div>
							<div className="text-2xl font-bold">50,000+</div>
							<div className="text-gray-600">Parents</div>
						</div>
					</div>
				</div>

				<div className="mt-20 px-20">
					<div className="text-3xl font-semibold text-center">Our Clients</div>
					<div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-10">
						<div className="h-36 w-36 rounded-full bg-orange-brand mb-4 mx-auto">
							<img
								className="w-20 h-20 m-8 shadow-md rounded-full"
								src="favicon.ico"
								alt="a1"
							/>
						</div>

						<div className="h-36 w-36 rounded-full bg-teal-brand mb-4 mx-auto">
							<img
								className="w-20 h-20 m-8 shadow-md rounded-full"
								src="favicon.ico"
								alt="a2"
							/>
						</div>
						<div className="h-36 w-36 rounded-full bg-red-brand mb-4 mx-auto">
							<img
								className="w-20 h-20 m-8 shadow-md rounded-full"
								src="favicon.ico"
								alt="a3"
							/>
						</div>
						<div className="h-36 w-36 rounded-full bg-teal-brand mb-4 mx-auto">
							<img
								className="w-20 h-20 m-8 shadow-md rounded-full"
								src="favicon.ico"
								alt="a4"
							/>
						</div>
						<div className="h-36 w-36 rounded-full bg-orange-brand mb-4 mx-auto">
							<img
								className="w-20 h-20 m-8 shadow-md rounded-full"
								src="favicon.ico"
								alt="a5"
							/>
						</div>
					</div>
				</div>

				<div className="mt-20 px-20">
					<div className=" text-3xl font-semibold text-center">Features</div>
					<div className="mt-10">
						<div className="grid md:gap-12 grid-cols-1 md:grid-cols-5 mx-auto space-y-4 md:space-y-0">
							<FeatureCard
								icon={iconPlug}
								title="Offline + Online"
								className="bg-yellow-300"
							/>
							<FeatureCard
								icon={iconDesktop}
								title="Responsive"
								className="bg-blue-300"
							/>
							<FeatureCard
								icon={iconCloud}
								title="Cloud Backup"
								className="bg-gray-300"
							/>
							<FeatureCard
								icon={iconCall}
								title="Excellent Service"
								className="bg-blue-300"
							/>
							<FeatureCard
								icon={iconCoin}
								title="Best Price"
								className="bg-yellow-300"
							/>
						</div>
					</div>
				</div>

				<div className="mt-20 py-10 bg-teal-50 ">
					<div className="text-3xl font-semibold text-center">Our Packages</div>
					<PackageList />
				</div>

				<div className="my-20 ">
					<div className="text-3xl font-semibold text-center">Our Team</div>
					<div className="mt-10 px-10 md:px-40 grid">
						<div className="grid gap-12 grid-cols-1 md:grid-cols-5 mx-auto">
							{getTeamMembersInfo().map((tm, index) => (
								<TeamMemberCard key={tm.name + index} member={tm} />
							))}
						</div>
					</div>
				</div>
				<div className="fixed z-50 bottom-10 right-5 rounded-full border border-white bg-teal-brand shadow-md p-2 text-white">
					<svg
						className="w-8 h-8"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor">
						<path
							fillRule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
			</div>
		</AppLayout>
	)
}
