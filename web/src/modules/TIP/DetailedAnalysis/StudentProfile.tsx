//@ts-nocheck
import React from 'react'
import clsx from 'clsx'
import { BackArrow, BlackUser } from 'assets/icons'

interface P {
	setIsComponentVisible: (value: boolean) => void
}

const StudentProfileModal: React.FC<P> = ({ setIsComponentVisible }) => {
	const group: TIPLevels = 'Level 1'
	return (
		<div className="flex flex-col rounded-t-xl padding-3 bg-white">
			<div className="p-2 shadow-lg text-center rounded-t-lg bg-light-blue-tip-brand text-white flex flex-col justify-between items-center text-sm md:text-lg lg:text-lg">
				<div className="w-full py-2 pl-4 flex flex-row justify-between">
					<div
						className="w-7 h-7 bg-white rounded-full shadow-lg flex justify-center items-center"
						onClick={() => setIsComponentVisible(false)}>
						<img className="h-3 w-3" src={BackArrow} />
					</div>
					<div className="flex justify-between flex-col mr-5">
						<img
							className="-top-10 left-36 absolute flex justify-center rounded-full h-16 w-16"
							src={BlackUser}
							alt="img"
						/>
						<div className="text-xs md:text-base lg:text-lg">Name</div>
						<div className="text-xs md:text-base lg:text-lg">Roll Num</div>
					</div>
					<div></div>
				</div>
				<div className="text-xs md:text-base lg:text-lg flex flex-row justify-between w-full pt-2">
					<div>Subjects</div>
					<div>Oral Test</div>
					<div>Sorting Result</div>
					<div>Reassigned to</div>
				</div>
			</div>
			<div>
				<div className="text-xs md:text-base lg:text-lg w-full">
					{[1, 2, 3].map(no => {
						return (
							<div
								key={no}
								className="p-2 flex flex-row justify-between items-center">
								<div className="font-bold">Maths</div>
								<div className="font-bold">yes</div>
								<div
									className={clsx(
										'text-white flex flex-wrap rounded-md items-center shadow-lg cursor-pointer text-sm md:text-base lg:text-lg px-3 py-1',
										{
											'bg-light-blue-tip-brand': group === 'Level KG',
											'bg-yellow-tip-brand': group === 'Level 1',
											'bg-green-tip-brand': group === 'Level 2',
											'bg-orange-tip-brand': group === 'Level 3',
											'bg-gray-600': group === 'Remediation Not Needed'
										}
									)}>
									yellow
								</div>
								<div
									className={clsx(
										'text-white flex flex-wrap rounded-md items-center shadow-lg cursor-pointer text-sm md:text-base lg:text-lg px-3 py-1',
										{
											'bg-light-blue-tip-brand': group === 'Level KG',
											'bg-yellow-tip-brand': group === 'Level 1',
											'bg-green-tip-brand': group === 'Level 2',
											'bg-orange-tip-brand': group === 'Level 3',
											'bg-gray-600': group === 'Remediation Not Needed'
										}
									)}>
									yellow
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default StudentProfileModal
