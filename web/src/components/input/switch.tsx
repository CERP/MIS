import React from "react"
import { Switch } from "@headlessui/react"

interface SwitchButtonProps {
	title?: string
	state: boolean
	callback: () => void
}

export const SwitchButton: React.FC<SwitchButtonProps> = ({ title, state, callback }) => {

	const handleToggle = (flag: boolean) => {
		callback()
	}

	return (
		<div className="flex items-center justify-center">
			<div className="w-full mx-auto">
				<Switch.Group as="div" className="flex items-center justify-between">
					<Switch.Label>{title}</Switch.Label>
					<Switch
						as="button"
						checked={state}
						onChange={handleToggle}
						className={`${state ? "bg-teal-brand" : "bg-red-brand"
							} relative inline-flex flex-shrink-0 h-6 transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer w-11 focus:outline-none focus:shadow-outline`}
					>
						{({ checked }) => (
							<span
								className={`${checked ? "translate-x-5" : "translate-x-0"
									} inline-block w-5 h-5 transition duration-200 ease-in-out transform bg-white rounded-full`}
							/>
						)}
					</Switch>
				</Switch.Group>
			</div>
		</div>
	);
}
