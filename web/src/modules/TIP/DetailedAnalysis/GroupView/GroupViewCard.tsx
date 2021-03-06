import React, { useState } from 'react'
import { TModal } from '../../Modal'
import StudentProfileGroupView from '../Modals/StudentProfileGroupView'
import { useComponentVisible } from 'hooks/useComponentVisible'
import { Tag } from 'assets/icons'

interface P {
	std: MISStudent
	subject?: TIPSubjects
	class_name: string
}

enum ModalType {
	STUDENT_PROFILE = 'student_profile'
}

const GroupViewCard: React.FC<P> = ({ std, subject, class_name }) => {
	const [modal_type, setModalType] = useState('')
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)

	return (
		<>
			{isComponentVisible && (
				<TModal>
					{modal_type === ModalType.STUDENT_PROFILE && (
						<div ref={ref}>
							<StudentProfileGroupView
								setIsComponentVisible={setIsComponentVisible}
								learning_level={std?.targeted_instruction.learning_level?.[subject]}
								subject={subject}
								std={std}
							/>
						</div>
					)}
				</TModal>
			)}
			<div className="h-10 items-center text-xs w-full mt-4 flex flex-row justify-around shadow-lg print:shadow-none print:text-lg print:text-black print:border-1 print:border-black">
				<div className="w-6/12 flex flex-row justify-start px-3 items-center m-2">
					<div className="font-bold text-center">{std.Name}</div>
					<div
						className="rounded-full bg-white h-7 w-7 shadow-lg ml-2 flex justify-center items-center cursor-pointer"
						onClick={() => (
							setModalType(ModalType.STUDENT_PROFILE), setIsComponentVisible(true)
						)}>
						<img className="w-2 h-4" src={Tag} alt="" />
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
