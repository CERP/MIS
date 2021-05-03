import React from 'react'

import { PlusIcon } from '@heroicons/react/outline'
import clsx from 'clsx'

interface PlusButtonProps {
	handleClick: () => void
	className?: string
}

export const PlusButton = ({ handleClick, className }: PlusButtonProps) => (
	<PlusIcon
		onClick={handleClick}
		className={clsx(
			'w-10 p-2 rounded-full cursor-pointer bg-blue-brand hover:text-blue-brand hover:bg-white',
			className
		)}
	/>
)
