import React from 'react'

import { packages } from 'constants/landing'
import { NavbarPublic } from 'components/navbar/public'
import { getTeamMembersInfo } from 'constants/aboutTeam'


export const HomePage = () => {

	return (<>

		<NavbarPublic />

		<div className="w-full mt-20">
			<div className="flex flex-row flex-wrap h-full md:h-96">
				<div className="w-full md:w-1/3 h-full">
					<div className="px-10 md:px-20">
						<div className="text-4xl md:text-5xl font-bold text-gray-700">We Help Schools thrive.</div>
						<div className="mt-4 text-lg">With <span className="text-red-brand font-bold">MISchool</span> which is a Single solution for all your school management issues.</div>
					</div>
					<div className="px-10 my-10 md:mt-20 md:pl-20 md:pr-0">
						<div className="flex flex-row space-x-2">
							<button className="w-full py-3 px-6 rounded-md border-2 text-lg border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-white">
								Sign in
						</button>
							<button className="w-full py-3 px-6 rounded-md text-lg bg-teal-400 text-white hover:bg-teal-500">
								Sign up
						</button>
						</div>
					</div>
				</div>
				<div className="w-full md:w-2/3 px-10 md:pr-0">
					<iframe src='https://youtube.com/embed/cm73XDWTiNQ'
						className="bg-gray-500 w-full h-60 md:h-full rounded-3xl md:rounded-tr-none md:rounded-br-none"
						frameBorder='0'
						allowFullScreen
						title='MISchool Intro'
					/>
				</div>
			</div>

			<div className="mt-20 py-10 bg-teal-100 md:min-h-screen">

				<div className="text-gray-700 text-3xl font-semibold text-center">Why Us?</div>
				<div className="flex flex-row flex-wrap mt-10 md:mt-20">
					<div className="w-full md:w-1/3 h-full">
						<div className="px-10 md:pl-20 md:pr-0">
							<div className="text-xl md:text-2xl font-bold text-gray-700">School Problems</div>
							<div className="mt-5 ml-5">
								<ul className="text-sm md:text-base space-y-2 md:space-y-4 text-gray-700 list-decimal">
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
					<div className="w-full md:w-2/3 px-10 md:px-20">
						<div className="relative">
							<div className="h-96 bg-red-brand rounded-xl text-center text-white">
								<div className="pt-28">
									<div className="font-bold">Taimur Shah</div>
									<div>Principal Sarkar School</div>
								</div>
								<div className="mt-10 px-20">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum leo nisi, vitae efficitur risus porta a. Nulla lacus ipsum, iaculis ut bibendum in, porta ut quam. Duis iaculis metus varius auctor condimentum. Praesent efficitur id ex a sagittis. Vestibulum finibus egestas purus ut gravida.
								</div>
								<div className="flex justify-center items-center mt-10 space-x-2">
									<div className="h-4 w-4 bg-white rounded-full"></div>
									<div className="h-4 w-4 bg-white rounded-full"></div>
									<div className="h-4 w-4 bg-white rounded-full"></div>
								</div>
							</div>
							<div className="absolute -top-20 inset-x-52 md:inset-x-72">
								<img src="/images/taimur.jpg" className="h-40 w-40 rounded-full p-1  bg-white border-4 border-red-brand shadow-xl" alt="school-owner" />
							</div>
						</div>
					</div>
				</div>

				<div className="text-gray-700 text-3xl font-semibold text-center mt-20">MISchool Reach</div>

				<div className="flex flex-row flex-wrap items-center text-gray-700 justify-center px-20 space-y-4 md:space-x-16 md:space-y-0 mt-10">
					<div className="flex flex-col items-center space-y-2">
						<div className="h-36 w-36 rounded-full bg-orange-brand mb-4">
							<img className="w-20 h-20 m-8 shadow-md rounded-full" src="favicon.ico" alt="city" />
						</div>
						<div className="text-2xl font-bold">50+</div>
						<div className="text-gray-600">Cities</div>
					</div>
					<div className="flex flex-col items-center space-y-2">
						<div className="h-36 w-36 rounded-full bg-teal-500 mb-4">
							<img className="w-20 h-20 m-8 shadow-md rounded-full" src="favicon.ico" alt="city" />
						</div>
						<div className="text-2xl font-bold">120+</div>
						<div className="text-gray-600">Schools</div>
					</div>
					<div className="flex flex-col items-center space-y-2">
						<div className="h-36 w-36 rounded-full bg-red-brand mb-4">
							<img className="w-20 h-20 m-8 shadow-md rounded-full" src="favicon.ico" alt="city" />
						</div>
						<div className="text-2xl font-bold">3500+</div>
						<div className="text-gray-600">Teachers</div>
					</div>
					<div className="flex flex-col items-center space-y-2">
						<div className="h-36 w-36 rounded-full bg-teal-500 mb-4">
							<img className="w-20 h-20 m-8 shadow-md rounded-full" src="favicon.ico" alt="city" />
						</div>
						<div className="text-2xl font-bold">120,000+</div>
						<div className="text-gray-600">Students</div>
					</div>
					<div className="flex flex-col items-center space-y-2">
						<div className="h-36 w-36 rounded-full bg-orange-brand mb-4">
							<img className="w-20 h-20 m-8 shadow-md rounded-full" src="favicon.ico" alt="city" />
						</div>
						<div className="text-2xl font-bold">50,000+</div>
						<div className="text-gray-600">Parents</div>
					</div>
				</div>

			</div>

			<div className="mt-20">
				<div className="text-gray-700 text-3xl font-semibold text-center">Our Clients</div>
				<div className="flex flex-row flex-wrap items-center text-gray-700 justify-center space-y-4 md:space-x-16 md:space-y-0 mt-10">
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
				<div className="text-gray-700 text-3xl font-semibold text-center">Features</div>
				<div className="grid mt-10">
					<div className="grid gap-6 grid-cols-1 md:grid-cols-5 mx-auto">
						<div className="p-8 pt-12 relative bg-yellow-300 rounded-3xl">
							<div className="h-36 w-36 rounded-full bg-yellow-200 mb-4 relative">
								<img className="absolute h-20 inset-0 m-auto rounded-full shadow-md w-20" src="favicon.ico" alt="city" />
							</div>
							<div className="text-white text-lg text-center">Offline + Online</div>
						</div>

						<div className="p-8 pt-12 relative bg-blue-300 rounded-3xl">
							<div className="h-36 w-36 rounded-full bg-blue-200 mb-4 relative">
								<img className="absolute h-20 inset-0 m-auto rounded-full shadow-md w-20" src="favicon.ico" alt="city" />
							</div>
							<div className="text-white text-lg text-center">Responsive</div>
						</div>

						<div className="p-8 pt-12 relative bg-gray-600 rounded-3xl">
							<div className="h-36 w-36 rounded-full bg-gray-700 mb-4 relative">
								<img className="absolute h-20 inset-0 m-auto rounded-full shadow-md w-20" src="favicon.ico" alt="city" />
							</div>
							<div className="text-white text-lg text-center">Cloud Backup</div>
						</div>

						<div className="p-8 pt-12 relative bg-blue-300 rounded-3xl">
							<div className="h-36 w-36 rounded-full bg-blue-200 mb-4 relative">
								<img className="absolute h-20 inset-0 m-auto rounded-full shadow-md w-20" src="favicon.ico" alt="city" />
							</div>
							<div className="text-white text-lg text-center">Excellent Service</div>

						</div>

						<div className="p-8 pt-12 relative bg-yellow-300 rounded-3xl">
							<div className="h-36 w-36 rounded-full bg-gray-700 mb-4 relative">
								<img className="absolute h-20 inset-0 m-auto rounded-full shadow-md w-20" src="favicon.ico" alt="city" />
							</div>
							<div className="text-white text-lg text-center">Best Price</div>
						</div>

					</div>
				</div>
			</div>

			<div className="mt-20 py-10 bg-teal-100 min-h-screen text-gray-700">
				<div className="text-3xl font-semibold text-center">Our Packages</div>
				<div className="mt-10 px-10 md:px-40 grid">
					<div className="grid gap-12 grid-cols-1 md:grid-cols-3">

						{
							(packages || []).map((pkg, index) => (
								<div key={pkg.title + index} className={"rounded-3xl bg-white"}>
									<div className={`m-1 py-5 px-3 rounded-3xl flex flex-col items-center ${pkg.popular ? 'bg-gray-700 text-white' : ''}`}>
										<div className="font-semibold text-lg">{pkg.title}</div>
										{
											pkg.popular ? <div className="my-2 px-2 text-xs rounded-full uppercase bg-purple-700 text-white">Popular</div>
												:
												<div className="my-4" />
										}
										<div className="relative mt-4">
											<div className="font-bold text-2xl">{pkg.price}</div>
											<div className="absolute top-0 -right-6 text-xs">{pkg.currency}</div>
										</div>
										<div className="text-gray-500">Annual {pkg.annual_charge}</div>
										<div className="font-lg font-semibold mt-4">{pkg.limit} Students</div>
										<div className="mt-4 py-3 text-center w-full bg-teal-500 cursor-pointer hover:bg-teal-600 text-white rounded-md">Choose Plan</div>
									</div>
								</div>
							))
						}
					</div>
				</div>
				<div className="mt-10">
					<div className="flex flex-col items-center justify-center space-y-2">
						<div className="text-lg">Or want to try before you buy?</div>
						<div className="px-8 py-3 bg-blue-brand rounded-md text-white cursor-pointer hover:bg-blue-400">Signup up for 15 days Free Trial</div>
					</div>
				</div>
			</div>


			<div className="my-20 text-gray-700">
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

	</>)
}