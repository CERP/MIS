import React from 'react'
import clsx from 'clsx'
import { ArrowBack, User } from 'assets/icons'

interface P {
	name: string
	obtain: number
	total: number
	std_id: string
	test_type: string

	setName: (name: string) => void
	setId: (id: string) => void
	setType: (type: string) => void
}

const ChildView: React.FC<P> = ({
	name,
	obtain,
	total,
	std_id,
	test_type,
	setId,
	setName,
	setType
}) => {
	const redirect = () => {
		setType('single_std_view')
		setId(std_id)
		setName(name)
	}

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
			)}
			onClick={redirect}>
			<div className="flex flex-row justify-between items-center w-full">
				<div className="w-2/4 flex flex-row justify-start content-center items-center">
					<img className="h-6 rounded-full p-3" src={User} alt="img" />
					<div className="font-bold">{name}</div>
				</div>
				<div className="flex flex-row justify-around w-2/4 text-sm md:text-md lg:text-lg">
					<div className="w-4/5 flex flex-row justify-around">
						<div>
							{test_type === 'summative-test'
								? percentage < 50
									? 'F'
									: 'P'
								: `${obtain}/${total}`}
						</div>
						<div>{percentage}%</div>
					</div>
					<div className="w-1/5 flex justify-end">
						<div className="bg-white rounded-full h-7 w-7 flex justify-center items-center">
							<img className="h-3" src={ArrowBack} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ChildView
