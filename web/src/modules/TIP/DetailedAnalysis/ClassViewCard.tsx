import React, { useState } from 'react';
import { connect } from 'react-redux'
import clsx from 'clsx';
import { TModal } from '../Modal'
import StudentInfoModal from './StudentInfoModal'
import TIPGroupModal from './TIPGroupModal'
import ChangeTIPGroup from './ChangeTIPGroup'
import { convertLearningGradeToGroupName } from 'utils/TIP'
import { assignLearningLevel } from 'actions'
import { useComponentVisible } from 'utils/customHooks';

interface P {
    std: MISStudent

    setLearningLevel: (student_id: string, subject: TIPSubjects, level: TIPGrades) => void
}

const ClassViewCard: React.FC<P> = ({ std, setLearningLevel }) => {
    const [modal_type, setModalType] = useState('')
    const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)

    const [current_grade, setCurrentGrade] = useState<TIPGrades>()
    const [selected_grade, setSelectedGrade] = useState<TIPGrades>()
    const [selected_subject, setSelectSubject] = useState<TIPSubjects>()

    const reAssignGrade = () => {
        setLearningLevel(std.id, selected_subject, selected_grade)
        setIsComponentVisible(false)
    }

    return <>
        {
            isComponentVisible && <TModal>
                {modal_type === 'test_info' && <div ref={ref}>
                    <StudentInfoModal
                        learning_levels={std.targeted_instruction.learning_level}
                        setCurrentGrade={setCurrentGrade}
                        setModalType={setModalType}
                        setSelectSubject={setSelectSubject}
                    />
                </div>}
                {modal_type === 'tip_groups' && <div ref={ref}>
                    <TIPGroupModal
                        subject={selected_subject}
                        setSelectedGrade={setSelectedGrade}
                        setModalType={setModalType}
                    />
                </div>}
                {modal_type === 'change_group' && <div ref={ref}>
                    <ChangeTIPGroup
                        subject={selected_subject}
                        selected_grade={selected_grade}
                        current_grade={current_grade}
                        reAssignGrade={reAssignGrade}
                    />
                </div>}
            </TModal>
        }
        <div className="h-10 items-center text-xs w-full mt-4 flex flex-row justify-around shadow-lg">
            <div className="w-4/12 md:w-6/12 flex flex-row justify-between px-3 items-center m-2">
                <div className="font-bold text-center">{std.Name}</div>
            </div>
            <div className="flex flex-row justify-between w-8/12 md:w-6/12 text-xs m-4">
                {
                    Object.entries(std.targeted_instruction.learning_level || {})
                        .sort(([sub,]) => sub.localeCompare(sub))
                        .map(([, grade_obj]) => {
                            const grade = convertLearningGradeToGroupName(grade_obj.grade)
                            return <div key={grade} className="w-2/6 flex justify-center items-center cursor-pointer">
                                <div className={clsx("px-2 py-1 rounded-md text-white", {
                                    "bg-gray-400": grade === 'Oral',
                                    "bg-gray-600": grade === 'Remediation Not Needed'
                                }, `bg-${grade.toLowerCase()}-tip-brand`)}
                                    onClick={() => { setIsComponentVisible(true), setModalType('test_info') }}>{grade === 'Remediation Not Needed' ? 'none' : grade}</div>
                            </div>
                        })
                }
            </div>
        </div >
    </>
}

export default connect(() => ({
}), (dispatch: Function) => ({
    setLearningLevel: (student_id: string, subject: TIPSubjects, level: TIPGrades) => dispatch(assignLearningLevel(student_id, subject, level))
}))(ClassViewCard)