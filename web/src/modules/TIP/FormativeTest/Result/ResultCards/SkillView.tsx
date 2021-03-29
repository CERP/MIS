import React from 'react'
import clsx from 'clsx'
import { ArrowBack } from 'assets/icons'

interface P {
	slo: string
	obtain: number
	total: number

	setType: (type: string) => void
	setSlo: (slo: string) => void
}

const SkillView: React.FC<P> = ({ slo, obtain, total, setType, setSlo }) => {
	const percentage = Math.trunc((obtain / total) * 100)

	const setValues = (slo: string) => {
		setType('single_slo_view')
		setSlo(slo.replaceAll(',', '$'))
	}

	return (
		<div
			className={clsx(
				'flex flex-row justify-between items-center px-3 my-1 h-14 shadow-lg w-full',
				{
					'bg-green-250': percentage >= 60,
					'bg-yellow-250': percentage >= 50
				},
				'bg-red-250'
			)}
			onClick={() => setValues(slo)}>
			<div className="flex flex-row justify-between w-full">
				<div className="w-full flex flex-row justify-between px-3 items-center text-left text-sm md:text-base lg:text-lg">
					<div className="font-bold w-2/4 text-left">{slo.replaceAll('$', ',')}</div>
					<div className="w-2/4 text-right mr-5">{percentage}%</div>
				</div>
				<div className="bg-white rounded-full h-7 w-7 flex justify-center items-center">
					<img className="h-3" src={ArrowBack} />
				</div>
			</div>
		</div>
	)
}

export default SkillView
