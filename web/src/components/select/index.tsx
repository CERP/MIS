import React from 'react'
import clsx from 'clsx'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/outline'

interface CustomSelectProps {
	data: string[] | ListItem
	selectedItem?: any // string | number
	label?: string
	onChange: (option: any) => void
}

type ListItem = {
	[key: string]: string | number
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
	data,
	selectedItem,
	label,
	onChange,
	children
}) => {
	let listData = data as ListItem

	if (Array.isArray(data)) {
		listData = data.reduce((agg, curr) => ({ ...agg, [curr]: curr }), {})
	}

	const handleChange = (option: string) => {
		const [k, v] = Object.entries(listData ?? {}).find(([k, v]) => v === option)
		// set parent state
		onChange(k)
	}

	return (
		<div className="flex z-50 items-center justify-center w-full">
			<Listbox
				as="div"
				className="space-y-1 w-full"
				value={listData[selectedItem]}
				onChange={handleChange}>
				{({ open }) => (
					<>
						{label && (
							<Listbox.Label className="block text-sm leading-5 font-medium text-gray-700">
								{label}
							</Listbox.Label>
						)}
						<div className="relative">
							<span className="inline-block w-full rounded-md shadow-sm">
								<Listbox.Button className="cursor-default relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5">
									<span className="block truncate">{listData[selectedItem]}</span>
									<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
										{children ?? (
											<SelectorIcon className="text-teal-brand w-5" />
										)}
									</span>
								</Listbox.Button>
							</span>

							<Transition
								show={open}
								leave="transition ease-in duration-100"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
								className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
								<Listbox.Options
									static
									className="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5">
									{Object.entries(listData).map(([k, v]) => (
										<Listbox.Option key={k} value={v}>
											{({ selected, active }) => (
												<div
													className={clsx(
														'cursor-default select-none relative py-2 pl-8 pr-4',
														active
															? 'text-white bg-teal-brand'
															: 'text-gray-900'
													)}>
													<span
														className={clsx(
															'block truncate',
															selected
																? 'font-semibold'
																: 'font-normal'
														)}>
														{v}
													</span>
													{selected && (
														<span
															className={clsx(
																'absolute inset-y-0 left-0 flex items-center pl-1.5',
																active
																	? 'text-white'
																	: 'text-teal-brand'
															)}>
															<CheckIcon className="w-5" />
														</span>
													)}
												</div>
											)}
										</Listbox.Option>
									))}
								</Listbox.Options>
							</Transition>
						</div>
					</>
				)}
			</Listbox>
		</div>
	)
}
