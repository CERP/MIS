import React, { useState } from 'react';
import { connect } from 'react-redux'
import clsx from 'clsx';
import { TModal } from '../Modal'
import StudentInfoModal from './StudentInfoModal'
import TIPGroupModal from './TIPGroupModal'
import ChangeTIPGroup from './ChangeTIPGroup'
import { convertLearningGradeToGroupName, getGradesFromTests } from 'utils/TIP'
import { assignLearningLevel } from 'actions'
import { useComponentVisible } from 'utils/customHooks';

interface P {
    name: string
    std_id: string
    learning_levels: MISStudent["targeted_instruction"]["learning_level"]
    targeted_instruction: RootReducerState["targeted_instruction"]

    setLearningLevel: (student_id: string, subject: string, level: TIPGrades) => void
}

const ClassViewCard: React.FC<P> = ({ name, learning_levels, targeted_instruction, std_id, setLearningLevel }) => {
    const [show_std_info_modal, setShowStdInfoModal] = useState(false)
    const [show_tip_group_modal, setShowTIPGroupModal] = useState(false)
    const [show_change_group_modal, setShowChangeGroupModal] = useState(false)
    const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)

    const [current_grade, setCurrentGrade] = useState<TIPGrades>()
    const [selected_subject, setSelectSubject] = useState<TIPSubjects>()
    const [selected_grade, setSelectedGrade] = useState<TIPGrades>()

    const grades = getGradesFromTests(targeted_instruction)

    const reAssignGrade = () => {
        setLearningLevel(std_id, selected_subject, selected_grade)
        setIsComponentVisible(false)
        setShowChangeGroupModal(false)
    }

    return <>
        {
            isComponentVisible && <TModal>
                {show_std_info_modal &&
                    !show_tip_group_modal &&
                    !show_change_group_modal && <div ref={ref}>
                        <StudentInfoModal
                            learning_levels={learning_levels}
                            setCurrentGrade={setCurrentGrade}
                            setShowTIPGroupModal={setShowTIPGroupModal}
                            setSelectSubject={setSelectSubject}
                        />
                    </div>}
                {show_tip_group_modal && <div ref={ref}>
                    <TIPGroupModal
                        subject={selected_subject}
                        grades={grades}
                        setSelectedGrade={setSelectedGrade}
                        setShowChangeGroupModal={setShowChangeGroupModal}
                        setShowTIPGroupModal={setShowTIPGroupModal}
                    />
                </div>}
                {show_change_group_modal && <div ref={ref}>
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
            <div className="w-4/12 flex flex-row justify-between px-3 items-center m-2">
                <div className="font-bold text-center">{name}</div>
            </div>
            <div className="flex flex-row justify-between w-8/12 text-xs m-4">
                {
                    Object.entries(learning_levels || {})
                        .sort(([sub,]) => sub.localeCompare(sub))
                        .map(([, grade_obj]) => {
                            const grade = convertLearningGradeToGroupName(grade_obj.grade)
                            return <div key={grade} className="w-2/6 flex justify-center items-center cursor-pointer">
                                <div className={clsx("px-2 py-1 rounded-md text-white", {
                                    "bg-gray-400": grade === 'Oral',
                                    "bg-gray-600": grade === 'Remediation Not Needed'
                                }, `bg-${grade.toLowerCase()}-tip-brand`)}
                                    onClick={() => { setIsComponentVisible(true), setShowStdInfoModal(true) }}>{grade === 'Remediation Not Needed' ? 'none' : grade}</div>
                            </div>
                        })
                }
            </div>
        </div >
    </>
}

export default connect((state: RootReducerState) => ({
    targeted_instruction: state.targeted_instruction
}), (dispatch: Function) => ({
    setLearningLevel: (student_id: string, subject: string, level: TIPGrades) => dispatch(assignLearningLevel(student_id, subject, level))
}))(ClassViewCard)
