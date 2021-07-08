import React from 'react'
import { useSelector } from 'react-redux'

import Card from 'components/cards/pill-button'
import { checkPermission, isValidStudent, isValidTeacher } from 'utils'

import iconClasses from './assets/classes.svg'
import iconTeachers from './assets/teachers.svg'
import iconStudents from './assets/students.svg'
import iconFamily from './assets/family.png'

type PropTypes = {
	permissions: MISTeacher['permissions']
	admin: boolean
	subAdmin: boolean
}

export const SettingsTab = ({ permissions, admin, subAdmin }: PropTypes) => {
	const faculty = useSelector((state: RootReducerState) => state.db.faculty)
	const classes = useSelector((state: RootReducerState) => state.db.classes)
	const students = useSelector((state: RootReducerState) => state.db.students)
	const tip_access = useSelector(
		(state: RootReducerState) => state.db.targeted_instruction_access
	)
	const totalStaff = Object.values(faculty).filter(f => isValidTeacher(f) && f.Active).length

	const { totalFamilies, totalStudents } = getStudentsFamilies(
		Object.values(students).filter(s => isValidStudent(s, { active: true }))
	)

	return (
		<div className="p-6 lg:w-full">
			<div className="text-center text-lg mb-6 md:hidden">Tap to configure the module</div>
			<div className="space-y-4">
				<Card
					title={'Staff'}
					link={checkPermission(permissions, 'setup', subAdmin, admin) ? '/staff' : '#'}
					disabled={!checkPermission(permissions, 'setup', subAdmin, admin)}
					caption={`Total = ${totalStaff}`}
					icon={iconTeachers}
				/>
				<Card
					title={'Classes'}
					link={checkPermission(permissions, 'setup', subAdmin, admin) ? '/classes' : '#'}
					caption={`Total = ${Object.keys(classes).length}`}
					icon={iconClasses}
					disabled={!checkPermission(permissions, 'setup', subAdmin, admin)}
				/>
				<Card
					title={'Students'}
					link={
						checkPermission(permissions, 'setup', subAdmin, admin) ? '/students' : '#'
					}
					caption={`Total = ${totalStudents}`}
					disabled={!checkPermission(permissions, 'setup', subAdmin, admin)}
					icon={iconStudents}
				/>
				<Card
					title={'Families'}
					link={
						checkPermission(
							permissions,
							'family',
							subAdmin,
							admin,
							tip_access ? tip_access : false
						)
							? '/families'
							: '#'
					}
					disabled={
						!checkPermission(
							permissions,
							'family',
							subAdmin,
							admin,
							tip_access ? tip_access : false
						)
					}
					caption={`Total = ${totalFamilies}`}
					icon={iconFamily}
				/>
				<Card
					title={'School Profile'}
					link={
						checkPermission(permissions, 'setup', subAdmin, admin) ? '/settings' : '#'
					}
					disabled={!checkPermission(permissions, 'setup', subAdmin, admin)}
					caption={'Profile, Grades, Data etc'}
					icon={iconStudents}
				/>
			</div>
		</div>
	)
}

const getStudentsFamilies = (students: MISStudent[]) => {
	let totalStudents = 0
	let families = new Set<string>()

	for (let student of students) {
		totalStudents += 1
		if (student.FamilyID) {
			families.add(student.FamilyID)
		}
	}

	return {
		totalStudents,
		totalFamilies: families.size
	}
}
