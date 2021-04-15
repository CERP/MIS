import React from 'react'
import { getQuizSLOs } from 'utils/TIP'

interface P {
	quizzes: TIPQuizzes

	setSelectedSlo: (slo: string[]) => void
	setType: (type: Types) => void
}

enum Types {
	SKILL_VIEW,
	CHILD_VIEW,
	SINGLE_STD_VIEW,
	SINGLE_SLO_VIEW
}

const SkillView: React.FC<P> = ({ quizzes, setSelectedSlo, setType }) => {
	const slos = getQuizSLOs(quizzes)
	return (
		<>
			{slos.map((slo, index) => (
				<div key={slo} className="flex flex-col content-between w-full">
					<div
						className="bg-blue-tip-brand font-bold text-white p-2 flex flex-row justify-between items-center"
						onClick={() => (setSelectedSlo(slo), setType(Types.SINGLE_SLO_VIEW))}>
						<div>{slo}</div>
						<div className="h-7 w-7 bg-white rounded-full"></div>
					</div>
					<div>
						<div>Quizzez</div>
						<div>Midpoint Test</div>
					</div>
				</div>
			))}
		</>
	)
}

export default SkillView
