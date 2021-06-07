import React from 'react'
import { BackArrow, WhiteAvatar } from 'assets/icons'
interface P {
	std: MISStudent

	setIsComponentVisible: (value: boolean) => void
}

const StudentProfileHeader: React.FC<P> = ({ std, setIsComponentVisible }) => {
	return (
		<>
			<div className="p-2 shadow-lg text-center rounded-t-lg bg-light-blue-tip-brand text-white flex flex-col justify-between items-center text-sm md:text-lg lg:text-lg">
				<div className="w-full py-2 flex flex-row justify-between">
					<div
						className="w-7 h-7 bg-white rounded-full shadow-lg flex justify-center items-center"
						onClick={() => setIsComponentVisible(false)}>
						<img className="h-3 w-3" src={BackArrow} />
					</div>
					<div className="flex justify-center items-center flex-col mr-8">
						<div className="flex items-center justify-center">
							<img
								className="rounded-full h-16 w-16"
								src={std?.ProfilePicture?.url ?? WhiteAvatar}
								alt="img"
							/>
						</div>
						<div className="text-xs md:text-base lg:text-lg">{std?.Name}</div>
						<div className="text-xs md:text-base lg:text-lg">{std?.RollNumber}</div>
					</div>
					<div></div>
				</div>
				<div className="w-full text-xs md:text-xs lg:text-lg flex flex-row pt-2 font-bold">
					<div className="w-1/3 flex flex-row justify-around">
						<div>Subjects</div>
						<div>Oral Test</div>
					</div>
					<div className="w-2/3 flex flex-row justify-around space-x-2">
						<div>Sorting Result</div>
						<div>Reassigned to</div>
					</div>
				</div>
			</div>
			<div></div>
		</>
	)
}

export default StudentProfileHeader
