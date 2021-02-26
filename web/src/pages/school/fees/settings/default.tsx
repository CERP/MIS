import React from 'react'
import { useSelector } from 'react-redux'
import { toTitleCase } from 'utils/toTitleCase'

export const DefaultFee = () => {

	const { classes, settings } = useSelector((state: RootReducerState) => state.db)

	return (
		<div className="my-4 p-5 space-y-4 w-full md:w-9/12 mx-auto">
			<div className={"w-full overflow-y-auto text-sm md:text-base rounded-md"}>
				<div className="table w-full text-center">
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
										<div className="table-cell px-2 py-2">{toTitleCase(c.name)}</div>
										<div className="table-cell px-2 py-2">Monthly</div>
										<div className="table-cell px-2 py-2">
											<input className="w-16 py-1 tw-input" />
										</div>
									</div>
								))
						}
					</div>
				</div>
			</div>
			<div className="flex justify-end">
				<button className="tw-btn-blue w-full md:w-1/4">Save Fee Settings</button>
			</div>
		</div>
	)
}