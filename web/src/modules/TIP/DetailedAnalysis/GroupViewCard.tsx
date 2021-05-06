import React, { useState } from 'react'
import { TModal } from '../Modal'
import StudentProfile from './StudentProfile'
import { useComponentVisible } from 'utils/customHooks'

interface P {
	std: MISStudent
	subject?: TIPSubjects
	class_name: string
}

enum MODAL_TYPE {
	STUDENT_PROFILE = 'student_profile'
}

const GroupViewCard: React.FC<P> = ({ std, subject, class_name }) => {
	const [modal_type, setModalType] = useState('')
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)

	return (
		<>
			{isComponentVisible && (
				<TModal>
					{modal_type === MODAL_TYPE.STUDENT_PROFILE && (
						<div ref={ref}>
							<StudentProfile
								setIsComponentVisible={setIsComponentVisible}
								learning_levels={std.targeted_instruction.learning_level}
								std={std}
							/>
						</div>
					)}
				</TModal>
			)}
			<div className="h-10 items-center text-xs w-full mt-4 flex flex-row justify-around shadow-lg print:shadow-none print:text-lg print:text-black print:border-1 print:border-black">
				<div className="w-6/12 flex flex-row justify-between px-3 items-center m-2">
					<div className="font-bold text-center">{std.Name}</div>
					<div
						className="rounded-full bg-white h-7 w-7 shadow-lg ml-1 flex justify-center items-center cursor-pointer"
						onClick={() => (
							setModalType(MODAL_TYPE.STUDENT_PROFILE), setIsComponentVisible(true)
						)}>
						Tag
					</div>
				</div>
				<div className="flex flex-row justify-between w-6/12 text-xs m-4">
					<div className="font-bold">{std.RollNumber}</div>
					<div className="font-bold">{class_name}</div>
				</div>
			</div>
		</>
	)
}

export default GroupViewCard
