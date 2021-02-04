import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { getStudentsByGroup } from 'utils/TIP'
import DetailedCard from './DetailedCard'
import Card from '../Card'

interface P {
    students: RootDBState["students"]
}

const DetailedAnalysis: React.FC<P> = ({ students }) => {

    const [group, setGroup] = useState<TIPGrades>('1')
    const [subject, setSubject] = useState<TIPSubjects>('English')

    const groups = { "KG": "Blue", "1": "Yellow", "2": "Green", "3": "Orange" }
    const subjects: TIPSubjects[] = ["English", "Urdu", "Maths"]

    const filtered_students = useMemo(() => getStudentsByGroup(students, group, subject), [subject, group])

    return <><Card class_name='' subject='' />
        <div className='flex flex-row justify-around w-full'>
            <select className='tw-select' onChange={(e) => setGroup(e.target.value as TIPGrades)}>
                <option value="">Group</option>
                {
                    Object.entries(groups).map(([grade, group]) => (
                        <option key={grade} value={grade}>{group}</option>
                    ))
                }
            </select>
            <select className='tw-select' onChange={(e) => setSubject(e.target.value as TIPSubjects)}>
                <option value="">Subject</option>
                {
                    subjects.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                    ))
                }
            </select>
        </div >
        <div className="h-10 items-center text-white text-xs bg-blue-primary w-full mt-4 flex flex-row justify-around">
            <div className="w-6/12 flex flex-row justify-between px-3 items-center m-2">
                <div className="font-bold text-center">Name</div>
            </div>
            <div className="flex flex-row justify-between w-6/12 text-xs m-4">
                <div className="font-bold">Roll no</div>
                <div className="font-bold">Class</div>
            </div>
        </div>
        <div className="flex flex-col">
            {Object.values(filtered_students || {}).map((std) => {
                return <DetailedCard key={std.id} name={std.Name} roll_no={std.RollNumber} class_name={std.section_id} />
            })}
        </div>
    </>
}

export default connect((state: RootReducerState) => ({
    students: state.db.students,
}))(DetailedAnalysis)
