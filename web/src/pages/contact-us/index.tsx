import React, { useState } from 'react'

import { PhoneIcon, LocationMarkerIcon, MailIcon } from '@heroicons/react/solid'

import SiteConfig from 'constants/siteConfig.json'
import { AppLayout } from 'components/Layout/appLayout'

import ContactForm from 'components/Forms/ContactForm'

export const ContactUs = () => {
	return (
		<AppLayout title={'Contact Us'}>
			<div className="min-h-screen p-5 pb-10 md:p-10 md:pb-0 bg-gray-900">
				<div className="flex flex-col md:flex-row md:w-4/5 space-y-4 md:space-y-0 md:space-x-8 mx-auto mt-10">
					<div className="w-full md:w-2/5 flex flex-col space-y-4 md:space-y-8 text-white">
						<div className="text-2xl md:text-3xl font-bold text-center md:text-left">
							Contact Us
						</div>
						<div className="flex flex-row items-center">
							<a href={'tel:' + SiteConfig.helpLineIlmx.phone}>
								<PhoneIcon className="w-10 h-10 p-2 rounded-full bg-white shadow-md mr-4 text-teal-brand" />
							</a>
							<div>{SiteConfig.helpLineIlmx.phoneInt}</div>
						</div>
						<div className="flex flex-row items-center justify-between">
							<div>
								<LocationMarkerIcon className="w-10 h-10 p-2 rounded-full bg-white shadow-md mr-4 text-teal-brand" />
							</div>
							<div>29-P Mustaq Ahmed Gurmani Road, Block P, Gulberg III, Lahore</div>
						</div>
						<div className="flex flex-row items-center">
							<div>
								<MailIcon className="w-10 h-10 p-2 rounded-full bg-white shadow-md mr-4 text-teal-brand" />
							</div>
							<div>mischool@cerp.org.pk</div>
						</div>
						<div className="space-y-2 hidden md:block">
							<div>Follow us on</div>
							<div className="flex flex-row space-x-2">
								<div className="rounded w-6 h-6 bg-white"></div>
								<div className="rounded w-6 h-6 bg-white"> </div>
								<div className="rounded w-6 h-6 bg-white" />
							</div>
						</div>
					</div>
					<div className="w-full md:w-3/5 bg-white rounded-2xl p-6 md:p-8">
						<ContactForm />
					</div>
					<div className="space-y-2 block md:hidden">
						<div className="text-white">Follow us on</div>
						<div className="flex flex-row space-x-2">
							<div className="rounded w-6 h-6 bg-white"></div>
							<div className="rounded w-6 h-6 bg-white"> </div>
							<div className="rounded w-6 h-6 bg-white" />
						</div>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
