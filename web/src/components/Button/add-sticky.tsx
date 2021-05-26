import React from 'react'
import { PlusIcon } from '@heroicons/react/outline'

interface AddStickyButtonProps {
	handleClick?: () => void
	label?: string
	className?: string
}

export const AddStickyButton = ({ label, handleClick }: AddStickyButtonProps) => {
	return (
		<div
			onClick={handleClick}
			className="flex items-center justify-between fixed z-50 bottom-4 right-4 md:right-8 rounded-full bg-teal-brand md:w-1/4 text-white py-3 px-6 w-11/12 text-lg mr-0.5">
			<div>{label}</div>
			<PlusIcon className="w-6" />
		</div>
	)
}
