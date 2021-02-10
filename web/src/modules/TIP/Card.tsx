import React from 'react';
import { connect } from 'react-redux';
import { convertLearningGradeToGroupName, convertLearningLevelToGrade } from 'utils/TIP';

interface P {
    class_name: string
    subject: string
    teacher_name: string
    school_name: string
    lesson_name: string
    lesson_no: string
}

const Card: React.FC<P> = ({ class_name, teacher_name, school_name, subject, lesson_name, lesson_no }) => {

    const class_num = class_name.substring(class_name.length - 1)
    const color = class_num === '0' ? "light-blue" : class_num === '1' ? "yellow" : class_num === '2' ? "green" : class_num === '3' ? "orange" : "green"

    const group_name = convertLearningGradeToGroupName(convertLearningLevelToGrade(class_name as TIPLevels))

    return <div className="w-full flex justify-center">
        <div className={`${`bg-${color}-primary`} container sm:px-8 rounded-md h-20 mb-6 mt-0 w-11/12`}>
            <div className="flex flex-row justify-start">
                <img className="w-12 h-12 rounded-full p-4" src="https://cdn.dribbble.com/users/2199928/screenshots/11532918/shot-cropped-1590177932366.png?compress=1&resize=400x300" alt="img" />
                <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-col justify-center">
                        <div className="text-white text-lg">{teacher_name}</div>
                        <div className="text-white text-base capitalize">{class_name.substring(0, 5) === "Level" ? `${group_name} Group` : class_name ? class_name : school_name}{subject && ` | ${subject}`}
                            {(lesson_name && lesson_no) && ` | ${lesson_name.replace(/['"]+/g, '')} | ${lesson_no.replace(/['"]+/g, '')}`}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default connect((state: RootReducerState) => ({
    teacher_name: state.auth.name,
    school_name: state.auth.school_id,
}))(Card)