import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { getStudentsByGroup, getClassnameFromSectionId } from 'utils/TIP'
import { getSectionsFromClasses } from 'utils/getSectionsFromClasses'
import DetailedCard from './DetailedCard'

interface P {
    students: RootDBState["students"]
    classes: RootDBState["classes"]
}

type OrderedGroupItem = {
    group: TIPGrades
    color: TIPLearningGroups
}

const ordered_groups: Array<OrderedGroupItem> = [
    { group: "KG", color: "Blue" },
    { group: "1", color: "Yellow" },
    { group: "2", color: "Green" },
    { group: "3", color: "Orange" },
    { group: "Oral Test", color: "Oral" },
    { group: "Not Needed", color: "Remediation Not Needed" }
]

const subjects: TIPSubjects[] = ["English", "Urdu", "Maths"]

const GroupView: React.FC<P> = ({ students, classes }) => {

    const [group, setGroup] = useState<TIPGrades>('1')
    const [subject, setSubject] = useState<TIPSubjects>('English')

    const filtered_students = useMemo(() => getStudentsByGroup(students, group, subject), [subject, group])

    const sorted_sections = useMemo(() => getSectionsFromClasses(classes).sort((a, b) => (a.classYear || 0) - (b.classYear || 0)), [])

    return <><div className='flex flex-row justify-around w-full'>
        <select className='tw-select' onChange={(e) => setGroup(e.target.value as TIPGrades)}>
            <option value="">Group</option>
            {
                ordered_groups.map((ordered_group) => (
                    <option key={ordered_group.group} value={ordered_group.group}>{ordered_group.color}</option>
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
        <div className="h-10 items-center text-white text-xs bg-blue-tip-brand w-full mt-4 flex flex-row justify-around">
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
                const class_name = getClassnameFromSectionId(sorted_sections, std.section_id)
                return <DetailedCard key={std.id} name={std.Name} roll_no={std.RollNumber} class_name={class_name} />
            })}
        </div>
    </>
}

export default connect((state: RootReducerState) => ({
    students: state.db.students,
    classes: state.db.classes
}))(GroupView)
