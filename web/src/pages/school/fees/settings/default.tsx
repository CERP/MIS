import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Dynamic from '@cerp/dynamic'
import toast from 'react-hot-toast'

import { toTitleCase } from 'utils/toTitleCase'
import { mergeSettings } from 'actions'

type State = MISSettings["classes"]["defaultFee"]

// TODO: handle only edits
const getDefaultFeeForClasses = (classes: RootDBState["classes"]): State => {
	return Object.keys(classes)
		.reduce((agg, curr) => {
			return {
				...agg,
				[curr]: {
					name: "Monthly",
					type: "FEE",
					amount: 0,
					period: "MONTHLY"
				}
			}
		}, {})
}

export const DefaultFee = () => {

	const dispatch = useDispatch()

	const { classes, settings } = useSelector((state: RootReducerState) => state.db)

	const [state, setState] = useState<State>({
		...getDefaultFeeForClasses(classes),
		...settings?.classes?.defaultFee,
	})

	const saveDefaultFee = (): void => {

		let modified_settings: MISSettings

		if (settings && settings.classes) {
			modified_settings = {
				...settings,
				classes: {
					...settings.classes,
					defaultFee: state
				}
			}
		} else {
			modified_settings = {
				...settings,
				classes: {
					defaultFee: state
				}
			}
		}

		dispatch(mergeSettings(modified_settings))
		toast.success("Default fee has been updated.")
	}

	// TODO: replace this with generic handler
	const handleInputByPath = (path: string[], value: number) => {
		const updatedState = Dynamic.put(state, path, value) as State
		setState(updatedState)
	}

	return (
		<div className="my-4 p-5 space-y-4 w-full md:w-9/12 mx-auto">
			<div className={"w-full overflow-y-auto text-sm md:text-base rounded-md"}>
				<div className="table w-full">
					<div className="table-header-group bg-gray-700">
						<div className="table-row font-bold text-base text-white">
							<div className="table-cell p-2">Class</div>
							<div className="table-cell p-2">Label</div>
							<div className="table-cell p-2">Fee</div>
						</div>
					</div>
					<div className="table-row-group bg-white">

						{
							Object.values(classes)
								.filter(c => c && c.id && c.name)
								.sort((a, b) => (a.classYear ?? 0) - (b.classYear ?? 0))
								.map(c => (
									<div key={c.id} className="table-row bg-gray-100">
										<div className="table-cell p-2">{toTitleCase(c.name)}</div>
										<div className="table-cell p-2">Monthly</div>
										<div className="table-cell p-2">
											<input
												onChange={(e) => handleInputByPath([c.id, "amount"], !isNaN(e.target.valueAsNumber) ? e.target.valueAsNumber : 0)}
												type="number"
												value={(state[c.id].amount as unknown) === 0 ? '' : state[c.id].amount}
												className="w-20 py-1 tw-input" />
										</div>
									</div>
								))
						}
					</div>
				</div>
			</div>
			<div className="flex justify-end">
				<button
					onClick={saveDefaultFee}
					className="tw-btn-blue w-full md:w-1/4">Save Fee Settings</button>
			</div>
		</div>
	)
}