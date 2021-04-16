import React from 'react'
import clsx from 'clsx'

interface P {
	skillViewResult: SkillViewQuizResult[]

	setSelectedSlo: (slo: string[]) => void
	setType: (type: Types) => void
}

enum Types {
	SKILL_VIEW,
	CHILD_VIEW,
	SINGLE_STD_VIEW,
	SINGLE_SLO_VIEW
}

const SkillView: React.FC<P> = ({ skillViewResult, setSelectedSlo, setType }) => {
	return (
		<>
			{skillViewResult.map(slo =>
				Object.entries(slo).map(([slo, res]) => {
					return (
						<div key={slo} className="flex flex-col content-between w-full">
							<div
								className="bg-blue-tip-brand font-bold text-white p-2 flex flex-row justify-between items-center"
								onClick={() => (
									setSelectedSlo([slo]), setType(Types.SINGLE_SLO_VIEW)
								)}>
								<div>{slo}</div>
								<div className="h-7 w-7 bg-white rounded-full"></div>
							</div>
							<div className="w-full text-blue-tip-brand flex flex-col justify-between text-sm md:text-base lg:text-lg font-bold">
								<div className="px-3 pt-3 pb-1 flex flex-row justify-around">
									<div className="w-2/6 text-center">Quizzez</div>
									{Object.entries(res.quiz).map(([type, marks]) => {
										return (
											<div
												key={type}
												className="w-4/6 h-5 flex flex-row justify-around rounded-xl text-white">
												<div
													className={clsx(
														'h-full rounded-xl flex justify-center items-center',
														{
															'bg-red-tip-brand':
																type === 'below_average',
															'bg-yellow-tip-brand':
																type === 'average',
															'bg-green-tip-brand':
																type === 'above_average'
														}
													)}
													style={{ width: '90%' }}>
													{marks}
												</div>
											</div>
										)
									})}
								</div>
								<div className="px-3 pb-3 pt-1 flex flex-row justify-around">
									<div className="w-2/6 text-center">Midpoint Test</div>
									{Object.entries(res.midpoint).map(([type, marks]) => {
										return (
											<div
												key={type}
												className="w-4/6 h-5 flex flex-row justify-around rounded-xl text-white">
												<div
													className={clsx(
														'h-full rounded-xl flex justify-center items-center',
														{
															'bg-red-tip-brand':
																type === 'below_average',
															'bg-yellow-tip-brand':
																type === 'average',
															'bg-green-tip-brand':
																type === 'above_average'
														}
													)}
													style={{ width: '90%' }}>
													{marks}
												</div>
											</div>
										)
									})}
								</div>
							</div>
						</div>
					)
				})
			)}
		</>
	)
}

export default SkillView
