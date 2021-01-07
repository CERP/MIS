import React from 'react'
import { Link } from 'react-router-dom'

import { getTeamMembersInfo } from 'constants/aboutTeam'
import { Package } from 'components/Package'
import { AppLayout } from 'components/Layout/appLayout'
import { CustomerFeedback } from 'components/Feedback'

import iconCall from './assets/call.svg'
import iconCloud from './assets/cloud.svg'
import iconCoin from './assets/coin.svg'
import iconDesktop from './assets/desktop.svg'
import iconGlobe from './assets/globe.svg'
import iconGraduationCap from './assets/graduation_cap.svg'
import iconParent from './assets/parent.svg'
import iconPlug from './assets/plug.svg'
import iconSchool from './assets/school.svg'
import iconTeacher from './assets/teacher.svg'

export const Landing = () => {

	return (
		<AppLayout>
			<div className="w-full mt-20">
				<div className="flex flex-row flex-wrap h-full md:h-96">
					<div className="w-full md:w-1/3 h-full">
						<div className="px-10 md:px-20">
							<div className="text-4xl md:text-5xl font-bold ">We Help Schools thrive.</div>
							<div className="mt-4 text-lg">With <span className="text-red-brand font-bold">MISchool</span> which is a Single solution for all your school management issues.</div>
						</div>
						<div className="px-10 my-10 md:mt-20 md:pl-20 md:pr-0">
							<div className="flex flex-row space-x-2">
								<Link to="/school-login" className="w-full py-3 px-6 rounded-md border-2 text-center text-lg border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-white">Sign in </Link>
								<Link to="/signup" className="w-full py-3 px-6 text-center rounded-md text-lg bg-teal-400 text-white hover:bg-teal-500">Sign up</Link>
							</div>
						</div>
					</div>
					<div className="w-full md:w-2/3 px-10 md:pr-0">
						<iframe src='https://youtube.com/embed/cm73XDWTiNQ?controls=0&rel=0'
							className="bg-gray-500 w-full h-60 md:h-full rounded-3xl md:rounded-tr-none md:rounded-br-none"
							frameBorder='0'
							allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;'
							allowFullScreen
							title='MISchool Intro'
						/>
					</div>
				</div>
				<div className="mt-20 py-10 bg-teal-50 md:min-h-screen">

					<div className=" text-3xl font-semibold text-center">Why Us?</div>
					<div className="flex flex-row flex-wrap mt-10 md:mt-20">
						<div className="w-full md:w-1/3 h-full">
							<div className="px-10 md:pl-20 md:pr-0">
								<div className="text-xl md:text-2xl font-bold ">School Problems</div>
								<div className="mt-5 ml-5">
									<ul className="text-sm md:text-base space-y-2 md:space-y-4  list-decimal">
										<li>
											<div>Keep track of Students and Teachers attendance and sending messsages.</div>
										</li>
										<li>
											<div>Fee challan generation and keeping track of all expenses.</div>
										</li>
										<li>
											<div>Daily and Monthly test result generation and distribution.</div>
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

					<div className="flex flex-row flex-wrap items-center  justify-center px-20 space-y-4 md:space-x-16 md:space-y-0 mt-10">
						<div className="flex flex-col items-center space-y-2">
							<img className="w-24 h-24 m-8 shadow-md rounded-full" src={iconGlobe} alt="city" />
							<div className="text-2xl font-bold">50+</div>
							<div className="text-gray-600">Cities</div>
						</div>
						<div className="flex flex-col items-center space-y-2">
							<img className="w-24 h-24 m-8 shadow-md rounded-full" src={iconSchool} alt="school" />
							<div className="text-2xl font-bold">120+</div>
							<div className="text-gray-600">Schools</div>
						</div>
						<div className="flex flex-col items-center space-y-2">
							<img className="w-24 h-24 m-8 shadow-md rounded-full" src={iconTeacher} alt="teacher" />
							<div className="text-2xl font-bold">3500+</div>
							<div className="text-gray-600">Teachers</div>
						</div>
						<div className="flex flex-col items-center space-y-2">
							<img className="w-24 h-24 m-8 shadow-md rounded-full" src={iconGraduationCap} alt="student" />
							<div className="text-2xl font-bold">120,000+</div>
							<div className="text-gray-600">Students</div>
						</div>
						<div className="flex flex-col items-center space-y-2">
							<div className="h-24 w-24 rounded-full bg-orange-brand mb-4 shadow-md">
								<img className="w-16 h-16 m-4" src={iconParent} alt="parent" />
							</div>
							<div className="text-2xl font-bold">50,000+</div>
							<div className="text-gray-600">Parents</div>
						</div>
					</div>

				</div>

				<div className="mt-20">
					<div className=" text-3xl font-semibold text-center">Our Clients</div>
					<div className="flex flex-row flex-wrap items-center  justify-center space-y-4 md:space-x-16 md:space-y-0 mt-10">
						<div className="h-36 w-36 rounded-full bg-orange-brand mb-4">
							<img className="w-20 h-20 m-8 shadow-md rounded-full" src="favicon.ico" alt="city" />
						</div>

						<div className="h-36 w-36 rounded-full bg-teal-500 mb-4">
							<img className="w-20 h-20 m-8 shadow-md rounded-full" src="favicon.ico" alt="city" />
						</div>
						<div className="h-36 w-36 rounded-full bg-red-brand mb-4">
							<img className="w-20 h-20 m-8 shadow-md rounded-full" src="favicon.ico" alt="city" />
						</div>
						<div className="h-36 w-36 rounded-full bg-teal-500 mb-4">
							<img className="w-20 h-20 m-8 shadow-md rounded-full" src="favicon.ico" alt="city" />
						</div>
						<div className="h-36 w-36 rounded-full bg-orange-brand mb-4">
							<img className="w-20 h-20 m-8 shadow-md rounded-full" src="favicon.ico" alt="city" />
						</div>
					</div>
				</div>

				<div className="mt-20">
					<div className=" text-3xl font-semibold text-center">Features</div>
					<div className="grid mt-10">
						<div className="grid md:gap-12 grid-cols-1 md:grid-cols-5 mx-auto space-y-4 md:space-y-0">
							<div className="px-6 py-14 bg-yellow-300 rounded-xl">
								<img className="w-24 h-24 mx-auto rounded-full shadow-md" src={iconPlug} alt="on-off" />
								<div className="text-white text-lg text-center mt-2">Offline + Online</div>
							</div>

							<div className="px-6 py-14 bg-blue-300 rounded-xl">
								<img className="w-24 h-24 mx-auto rounded-full shadow-md" src={iconDesktop} alt="resp" />
								<div className="text-white text-lg text-center mt-2">Responsive</div>
							</div>

							<div className="px-6 py-14 bg-gray-500 rounded-xl">
								<img className="w-24 h-24 mx-auto rounded-full shadow-md" src={iconCloud} alt="cloud" />
								<div className="text-white text-lg text-center mt-2">Cloud Backup</div>
							</div>

							<div className="px-6 py-14 bg-blue-300 rounded-xl">
								<img className="w-24 h-24 mx-auto rounded-full shadow-md" src={iconCall} alt="call" />
								<div className="text-white text-lg text-center mt-2">Excellent Service</div>

							</div>

							<div className="px-6 py-14 bg-yellow-300 rounded-xl">
								<img className="w-24 h-24 mx-auto rounded-full shadow-md" src={iconCoin} alt="coin" />
								<div className="text-white text-lg text-center mt-2">Best Price</div>
							</div>

						</div>
					</div>
				</div>

				<div className="mt-20 py-10 bg-teal-50 ">
					<div className="text-3xl font-semibold text-center">Our Packages</div>
					<Package />
				</div>

				<div className="my-20 ">
					<div className="text-3xl font-semibold text-center">Our Team</div>
					<div className="mt-10 px-10 md:px-40 grid">
						<div className="grid gap-12 grid-cols-1 md:grid-cols-5 mx-auto">
							{
								getTeamMembersInfo()
									.map((tm, index) => (
										<div key={tm.name + index} className="flex flex-col space-y-2 items-center">
											<div className="w-40 p-1 h-40 rounded-full border-4 border-teal-500">
												<img src={tm.avatar_url} className="rounded-full object-cover" />
											</div>
											<div className="text-lg font-bold">{tm.name}</div>
											<div className="text-sm">{tm.designation}</div>
										</div>
									))
							}
						</div>
					</div>
				</div>

			</div>
		</AppLayout>
	)
}