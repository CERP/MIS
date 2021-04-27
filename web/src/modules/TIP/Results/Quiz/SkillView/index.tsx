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
			{skillViewResult.map((slo, index) =>
				Object.entries(slo || {}).map(([slo, res]) => (
					<div key={slo} className="flex flex-col content-between w-full">
						<div
							className="bg-blue-tip-brand font-bold text-white p-2 flex flex-row justify-between items-center"
							onClick={() => (setSelectedSlo([slo]), setType(Types.SINGLE_SLO_VIEW))}>
							<div className="flex flex-row">
								<span className="mr-2">{index + 1} .</span>
								<div>{slo}</div>
							</div>
							<div className="h-7 w-7 bg-white rounded-full"></div>
						</div>
						<div className="w-full text-blue-tip-brand flex flex-col justify-between text-sm md:text-base lg:text-lg font-bold">
							<div className="px-3 pt-3 pb-1 flex flex-row justify-around">
								<div className="w-2/6 text-center">Quiz</div>
								<div className="flex flex-row w-full -space-x-4">
									{Object.entries(res.quiz ?? {}).map(([type, marks]) => {
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
													style={{ width: '100%' }}>
													{marks}
												</div>
											</div>
										)
									})}
								</div>
							</div>
							<div className="px-3 pb-3 pt-1 flex flex-row justify-around">
								<div className="w-2/6 text-center">Midpoint</div>
								<div className="flex flex-row w-full -space-x-4">
									{Object.entries(res.midpoint ?? {}).map(
										([type, num_of_std]) => {
											return (
												<div
													key={type}
													className="w-4/6 h-5 flex flex-row justify-around rounded-xl text-white">
													<div
														className={clsx(
															'h-full w-full  rounded-xl flex justify-center items-center',
															{
																'bg-red-tip-brand':
																	type === 'below_average',
																'bg-yellow-tip-brand':
																	type === 'average',
																'bg-green-tip-brand':
																	type === 'above_average'
															}
														)}
														style={{ width: '100%' }}>
														{num_of_std}
													</div>
												</div>
											)
										}
									)}
								</div>
							</div>
						</div>
					</div>
				))
			)}
		</>
	)
}

export default SkillView
