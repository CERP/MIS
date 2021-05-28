import React, { Fragment, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
	LocationMarkerIcon,
	MailIcon,
	PhoneIcon,
	QuestionMarkCircleIcon,
	XIcon
} from '@heroicons/react/outline'
import { Transition } from '@headlessui/react'

import { PackageList } from 'components/package'
import { AppLayout } from 'components/Layout/appLayout'
import { CustomerFeedback } from 'components/feedback'
import { SolutionCard, ReachItemCard, FeatureItemCard } from 'components/cards/landing'

import iconFee from 'assets/svgs/fee.svg'
import iconSms from 'assets/svgs/sms.svg'
import iconExams from 'assets/svgs/exams.svg'
import iconAttendance from 'assets/svgs/attendance.svg'
import iconDiary from 'assets/svgs/diary.svg'
import iconExpense from 'assets/svgs/expense.svg'

import iconCall from './assets/call.svg'
import iconCloud from './assets/cloud.svg'
import iconDesktop from './assets/desktop.svg'
import iconGlobe from './assets/globe.svg'
import iconGraduationCap from './assets/graduation-cap.svg'
import iconParent from './assets/parent.svg'
import iconPlug from './assets/plug.svg'
import iconSchool from './assets/school.svg'
import iconTeacher from './assets/teacher.svg'

import SiteConfig from 'constants/siteConfig.json'
import ContactForm from 'components/Forms/ContactForm'

export const Landing = () => {
	const [formOpened, setFormOpened] = useState<boolean>(false)
	const formRef = useRef(null)
	return (
		<AppLayout>
			<div className="w-full mt-10 md:mt-16">
				<div className="flex flex-row flex-wrap h-full md:h-96">
					<div className="w-full h-full md:w-1/3">
						<div className="px-8 md:px-12">
							<div className="text-5xl font-bold">
								The Best Management Software for schools.
							</div>
							<div className="mt-4 text-lg">
								With <span className="font-bold text-red-brand">MISchool</span>{' '}
								which is a single solution for all your school management issues.
							</div>
						</div>
						<div className="block w-full px-8 mt-10 md:hidden md:w-2/3 md:pr-0">
							<iframe
								src="https://youtube.com/embed/cm73XDWTiNQ?controls=0&rel=0"
								className="w-full bg-gray-500 h-60 md:h-full rounded-3xl md:rounded-tr-none md:rounded-br-none"
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;"
								allowFullScreen
								title="MISchool Intro"
							/>
						</div>
						<div className="px-8 my-10 md:mt-16 md:pl-12 md:pr-0">
							<div className="flex flex-row space-x-2">
								<Link
									to="/school-login"
									className="w-1/2 px-6 py-2 text-lg text-center border-2 rounded-md md:py-3 hover:bg-teal-brand hover:text-white text-teal-brand border-teal-brand hover:shadow-md">
									Login
								</Link>
								<Link
									to="/signup?package=FREE_TRIAL"
									className="w-full px-6 py-2 text-lg text-center text-white rounded-md md:py-3 bg-teal-brand hover:shadow-md">
									Try For Free
								</Link>
							</div>
							<div className="my-2">
								Not sure? Click here to{' '}
								<Link
									to="/contact-us"
									className="cursor-pointer text-teal-brand hover:underline hover:text-blue-brand">
									Schedule a demo
								</Link>
							</div>
						</div>
					</div>
					<div className="hidden w-full px-8 md:block md:w-2/3 md:pr-0 h-96">
						<iframe
							src="https://youtube.com/embed/cm73XDWTiNQ?controls=0&rel=0"
							className="w-full bg-gray-500 h-96 md:h-full rounded-3xl md:rounded-tr-none md:rounded-br-none"
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;"
							allowFullScreen
							title="MISchool Intro"
						/>
					</div>
				</div>

				<div className="px-12 mt-10 md:mt-20">
					<div className="text-3xl font-semibold text-center">Our Solutions</div>
					<div className="mt-10">
						<div className="grid grid-cols-1 mx-auto space-y-4 md:gap-12 md:grid-cols-4 md:space-y-0">
							<SolutionCard
								icon={iconPlug}
								title="Offline + Online"
								className="bg-yellow-300"
							/>
							<SolutionCard
								icon={iconDesktop}
								title="Responsive"
								className="bg-blue-300"
							/>
							<SolutionCard
								icon={iconCloud}
								title="Cloud Backup"
								className="bg-gray-300"
							/>
							<SolutionCard
								icon={iconCall}
								title="Excellent Service"
								className="bg-blue-300"
							/>
						</div>
					</div>
				</div>

				<div className="mt-10 md:mt-20 bg-teal-50 py-10">
					<div className="text-3xl font-semibold text-center">Features</div>
					<div className="grid grid-col-1 md:grid-cols-2 gap-16 px-10 md:px-20 mt-10">
						{Features.map(feature => (
							<FeatureItemCard key={feature.title} {...feature} />
						))}
					</div>
				</div>

				<div className="mt-10 md:mt-20">
					<div className="text-3xl font-semibold text-center">MISchool Reach</div>

					<div className="flex flex-row flex-wrap items-center justify-center px-20 mt-10 space-y-4 md:space-x-16 md:space-y-0">
						<ReachItemCard icon={iconGlobe} title="Cities" reach="50+" />
						<ReachItemCard icon={iconSchool} title="Schools" reach="800+" />
						<ReachItemCard icon={iconTeacher} title="Teachers" reach="4000+" />
						<ReachItemCard icon={iconGraduationCap} title="Students" reach="90,000+" />
						<div className="flex flex-col items-center space-y-2">
							<div className="w-24 h-24 m-8 rounded-full shadow-md md:w-28 md:h-28 bg-orange-brand">
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

					<div className="mt-16 text-3xl font-semibold text-center">Testimonials</div>
					<div className="flex items-center justify-center mt-10 md:mt-24">
						<CustomerFeedback />
					</div>
				</div>

				<div className="px-12 mt-20">
					<div className="text-3xl font-semibold text-center">Our Clients</div>
					<div className="grid grid-cols-1 gap-6 mt-10 md:grid-cols-5">
						<div className="mx-auto mb-4 rounded-full h-36 w-36 bg-orange-brand">
							<img
								className="w-20 h-20 m-8 rounded-full shadow-md"
								src="favicon.ico"
								alt="a1"
							/>
						</div>

						<div className="mx-auto mb-4 rounded-full h-36 w-36 bg-teal-brand">
							<img
								className="w-20 h-20 m-8 rounded-full shadow-md"
								src="favicon.ico"
								alt="a2"
							/>
						</div>
						<div className="mx-auto mb-4 rounded-full h-36 w-36 bg-red-brand">
							<img
								className="w-20 h-20 m-8 rounded-full shadow-md"
								src="favicon.ico"
								alt="a3"
							/>
						</div>
						<div className="mx-auto mb-4 rounded-full h-36 w-36 bg-teal-brand">
							<img
								className="w-20 h-20 m-8 rounded-full shadow-md"
								src="favicon.ico"
								alt="a4"
							/>
						</div>
						<div className="mx-auto mb-4 rounded-full h-36 w-36 bg-orange-brand">
							<img
								className="w-20 h-20 m-8 rounded-full shadow-md"
								src="favicon.ico"
								alt="a5"
							/>
						</div>
					</div>
				</div>

				<div className="py-10 mt-20 bg-teal-50">
					<div className="text-3xl font-semibold text-center">Our Packages</div>
					<PackageList />
				</div>

				<div className="fixed z-50 p-2 text-white rounded-full shadow-md bottom-10 right-5 bg-teal-brand">
					{formOpened ? (
						<XIcon
							ref={formRef}
							onClick={() => setFormOpened(false)}
							className="w-8 h-8 cursor-pointer"
						/>
					) : (
						<QuestionMarkCircleIcon
							onClick={() => setFormOpened(true)}
							className="w-8 h-8 cursor-pointer"
						/>
					)}
				</div>
			</div>
			<footer className="flex justify-center px-4 text-gray-100 bg-gray-800">
				<div className="container py-6">
					<h1 className="text-center text-lg font-bold lg:text-2xl">
						Join 800+ other schools and never miss <br /> out an oppurtunity to digitize
						your school at affordable cost.
					</h1>

					<hr className="h-px mt-6 bg-gray-700 border-none" />

					<div className="flex flex-col items-center justify-between mt-6 md:flex-row lg:flex-1">
						<div className="flex flex-1 lg:mx-5 flex-col items-center">
							<div className="text-xl items-center  justify-startflex flex-col font-bold">
								<img
									className="w-20	h-20 image hidden md:block"
									src="/favicon.ico"
									alt="brand-logo"
								/>
								<div className="text-base hidden md:inline-block font-normal mt-2">
									<span className="font-semibold">MISchool</span> is a management
									information system for schools. MISchool enables school to
									collect, organize, and store records giving your school full
									control of all academic, finance, wellbeing, and administrative
									information.
								</div>
							</div>
							<div className="text-base md:hidden block">
								<span className="font-semibold">MISchool </span> - A School
								Management Software
							</div>
						</div>
						<div className="flex mt-4 lg:justify-center md:m-0 lg:flex-1">
							<div className="-mx-4 lg:flex lg:mx-4 lg:space-y-4 lg:flex-col">
								<Link to="/pricing" className="px-2 text-base hover:underline">
									Pricing
								</Link>
								<Link to="/about-us" className="px-2 text-base hover:underline">
									About
								</Link>
								<Link to="/contact-us" className="px-2 text-base hover:underline">
									Contact
								</Link>
								<Link to="/events" className="px-2 text-base hover:underline">
									Events
								</Link>
								<Link
									to="/privacy-policy"
									className="px-2 text-base hover:underline">
									Privacy Policy
								</Link>
							</div>
						</div>
						<div className="lg:flex mt-4 lg:mx-5 md:m-0 lg:flex-1 hidden">
							<div className="-mx-4 lg:flex  lg:space-y-4 lg:flex-col">
								<h1 className="font-semibold">Contact Us</h1>
								<div className="flex flex-row items-center">
									<a href={'tel:' + SiteConfig.helpLine.phone}>
										<PhoneIcon className="w-10 h-10 p-2 rounded-full bg-white shadow-md mr-4 text-teal-brand" />
									</a>
									<div>{SiteConfig.helpLine.phoneInt}</div>
								</div>
								<div className="flex flex-row items-center justify-between">
									<div>
										<LocationMarkerIcon className="w-10 h-10 p-2 rounded-full bg-white shadow-md mr-4 text-teal-brand" />
									</div>
									<div>
										29-P Mustaq Ahmed Gurmani Road, Block P, Gulberg III, Lahore
									</div>
								</div>
								<div className="flex flex-row items-center">
									<div>
										<MailIcon className="w-10 h-10 p-2 rounded-full bg-white shadow-md mr-4 text-teal-brand" />
									</div>
									<div>mischool@cerp.org.pk</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</footer>
			<Transition
				as={Fragment}
				show={formOpened}
				enter="transform transition duration-[400ms]"
				enterFrom="opacity-0 rotate-[-120deg] scale-50"
				enterTo="opacity-100 rotate-0 scale-100"
				leave="transform duration-200 transition ease-in-out"
				leaveFrom="opacity-100 rotate-0 scale-100 "
				leaveTo="opacity-0 scale-95 ">
				<div className="w-9/12 bottom-24 right-4 fixed md:w-3/12 space-y-4 bg-gray-100 shadow-2xl rounded-2xl p-4 md:p-8 ">
					<h1 className="font-semibold text-center">Contact Us</h1>
					<ContactForm />
				</div>
			</Transition>
		</AppLayout>
	)
}

const Features = [
	{
		title: 'Attendance',
		body: 'Manual or Cards scanning process for staff and student attendance',
		icon: iconAttendance
	},
	{
		title: 'Fee Management',
		body: 'Computerized vouchers, Automatic calculations, Safe record keeping and SMS receipts',
		icon: iconFee
	},
	{
		title: 'Exams',
		body:
			'Automatic grade calculations, Print result card of all your students in one click, or send via SMS to parents',
		icon: iconExams
	},
	{
		title: 'Expenses',
		body: 'Now manage all of your school expenses with Mischools expense module',
		icon: iconExpense
	},
	{
		title: 'Daily Diary',
		body:
			'Allows multiple users to write the daily diary and easily send to parents every day.',
		icon: iconDiary
	},
	{
		title: 'SMS Announcements',
		body:
			'Easily communicate with students and parents by sending SMS using your own SMS package - no need to buy separately.',
		icon: iconSms
	},
	{
		title: 'Analytics',
		body:
			'Graphical representation of your data, Make informed decisions by comparing data month by month',
		icon: '/favicon.ico'
	},
	{
		title: 'Datesheet',
		body: 'You can easily create a date-sheet, and even more easily send as SMS or print.',
		icon: '/favicon.ico'
	}
]
