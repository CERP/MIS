import React from 'react'
import clsx from 'clsx'
interface P {
	slo: string
	obtain: number
	total: number
}

const SingleStdView: React.FC<P> = ({ slo, obtain, total }) => {
	const percentage = Math.trunc((obtain / total) * 100)

	return (
		<div
			className={clsx(
				'flex flex-row justify-between items-center px-3 my-1 h-14 shadow-lg w-full',
				{
					'bg-green-250': percentage >= 60,
					'bg-yellow-250': percentage >= 50
				},
				'bg-red-250'
			)}>
			<div className="flex flex-row justify-between w-full">
				<div className="w-full flex flex-row justify-between px-3 items-center text-left text-sm md:text-md lg:text-lg">
					<div className="font-bold">{slo.replaceAll('$', ',')}</div>
					<div className="flex flex-row justify-between w-3/12">
						<div>{`${obtain}/${total}`}</div>
						<div>{percentage}%</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SingleStdView
