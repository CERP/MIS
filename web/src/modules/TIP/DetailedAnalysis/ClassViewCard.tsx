//@ts-nocheck
import React, { useState } from 'react';
import { connect } from 'react-redux'
import clsx from 'clsx';
import Modal from 'components/Modal'
import StudentInfoModal from './StudentInfoModal'
import TIPGroupModal from './TIPGroupModal'
import ChangeTIPGroup from './ChangeTIPGroup'
import { convertLearningGradeToGroupName, getGradesFromTests } from 'utils/TIP'
import { assignLearningLevel } from 'actions'

interface P {
    name: string
    std_id: string
    learning_levels: RootDBState["students"]["targeted_instruction"]
    targeted_instruction: RootReducerState["targeted_instruction"]

    setLearningLevel: (student_id: string, subject: string, level: TIPGrades) => void
}

const ClassViewCard: React.FC<P> = ({ name, learning_levels, targeted_instruction, std_id, setLearningLevel }) => {
    const [show_student_info_modal, setShowStudentInfoModal] = useState(false)
    const [show_tip_group_modal, setShowTIPGroupModal] = useState(false)
    const [show_change_group_modal, setShowChangeGroupModal] = useState(false)

    const [current_grade, setCurrentGrade] = useState('')
    const [selected_subject, setSelectSubject] = useState('')
    const [selected_grade, setSelectedGrade] = useState('')

    const grades = getGradesFromTests(targeted_instruction)

    const reAssignGrade = () => {
        console.log(std_id, selected_subject, selected_grade)
        setLearningLevel(std_id, selected_subject, selected_grade)
        setShowChangeGroupModal(false)
    }

    return <>
        {
            show_student_info_modal && <Modal>
                <StudentInfoModal learning_levels={learning_levels}
                    onClose={() => setShowStudentInfoModal(false)}
                    setCurrentGrade={setCurrentGrade}
                    setShowTIPGroupModal={setShowTIPGroupModal}
                    setSelectSubject={setSelectSubject}
                    setShowStudentInfoModal={setShowStudentInfoModal}
                />
            </Modal>
        }
        {
            show_tip_group_modal && <Modal>
                <TIPGroupModal
                    subject={selected_subject}
                    grades={grades}
                    setSelectedGrade={setSelectedGrade}
                    setShowChangeGroupModal={setShowChangeGroupModal}
                    setShowTIPGroupModal={setShowTIPGroupModal}

                    onClose={() => setShowStudentInfoModal(false)} />
            </Modal>
        }
        {
            show_change_group_modal && <Modal>
                <ChangeTIPGroup
                    subject={selected_subject}
                    selected_grade={selected_grade}
                    current_grade={current_grade}
                    reAssignGrade={reAssignGrade}
                    onClose={() => setShowChangeGroupModal(false)} />
            </Modal>
        }
        <div className="h-10 items-center text-xs w-full mt-4 flex flex-row justify-around shadow-lg">
            <div className="w-6/12 flex flex-row justify-between px-3 items-center m-2">
                <div className="font-bold text-center">{name}</div>
            </div>
            <div className="flex flex-row justify-between w-6/12 text-xs m-4">
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
                                    onClick={() => setShowStudentInfoModal(true)}>{grade}</div>
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
