import clsx from 'clsx'
import React from 'react'
import { PhoneIcon } from '@heroicons/react/solid'

type PhoneCallProps = {
	phone: string
}

const PhoneCall = ({ phone }: PhoneCallProps) => (
	<a
		className={clsx(
			'md:hidden ml-2 text-white h-10 w-10 rounded-md flex items-center justify-center',
			phone ? 'bg-blue-brand' : 'pointer-events-none bg-gray-500 text-gray-300'
		)}
		href={`tel:${phone}`}>
		<PhoneIcon className="w-6 h-6" />
	</a>
)

export default PhoneCall
