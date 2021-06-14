import React from 'react'
import clsx from 'clsx'
interface P {
	slo: string
	name: string
	slo_obj: SloObj
}

const SingleSloView: React.FC<P> = ({ slo, slo_obj, name }) => {
	const percentage = Math.trunc((slo_obj[slo].obtain / slo_obj[slo].total) * 100)

	return (
		<div
			className={clsx(
				'flex flex-row justify-between items-center px-3 my-1 h-14 shadow-lg w-full',
				{
					'bg-green-250': percentage >= 80,
					'bg-yellow-250': percentage >= 50 && percentage < 80
				},
				'bg-red-250'
			)}>
			<div className="flex flex-row justify-between w-full">
				<div className="w-full flex flex-row justify-between px-3 items-center text-left text-sm md:text-md lg:text-lg">
					<div className="font-bold capitalize">{name}</div>
					<div className="flex flex-row justify-between w-3/12">
						<div>{`${slo_obj[slo].obtain}/${slo_obj[slo].total}`}</div>
						<div>{percentage}%</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SingleSloView
