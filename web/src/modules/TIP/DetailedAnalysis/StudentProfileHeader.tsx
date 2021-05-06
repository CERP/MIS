import React from 'react'
import { BackArrow, WhiteUser } from 'assets/icons'
interface P {
	std: MISStudent

	setIsComponentVisible: (value: boolean) => void
}

const StudentProfileHeader: React.FC<P> = ({ std, setIsComponentVisible }) => {
	return (
		<>
			<div className="p-2 shadow-lg text-center rounded-t-lg bg-light-blue-tip-brand text-white flex flex-col justify-between items-center text-sm md:text-lg lg:text-lg">
				<div className="w-full py-2 pl-4 flex flex-row justify-between">
					<div
						className="w-7 h-7 bg-white rounded-full shadow-lg flex justify-center items-center"
						onClick={() => setIsComponentVisible(false)}>
						<img className="h-3 w-3" src={BackArrow} />
					</div>
					<div className="flex justify-center items-center flex-col">
						<div className="flex items-center justify-center">
							<img
								className="rounded-full h-16 w-16"
								src={std?.ProfilePicture?.url ?? WhiteUser}
								alt="img"
							/>
						</div>
						<div className="text-xs md:text-base lg:text-lg">{std?.Name}</div>
						<div className="text-xs md:text-base lg:text-lg">{std?.RollNumber}</div>
					</div>
					<div></div>
				</div>
				<div className="text-xs md:text-xs lg:text-lg flex flex-row justify-between w-full pt-2 font-bold">
					<div className="pl-3">Subjects</div>
					<div>Oral Test</div>
					<div>Sorting Result</div>
					<div>Reassigned to</div>
				</div>
			</div>
			<div></div>
		</>
	)
}

export default StudentProfileHeader
