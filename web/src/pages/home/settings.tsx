import React from 'react'
import { useSelector } from 'react-redux'

import Card from 'components/cards/pill-button'
import { isValidStudent, isValidTeacher } from 'utils'

import iconClasses from './assets/classes.svg'
import iconTeachers from './assets/teachers.svg'
import iconStudents from './assets/students.svg'
import iconFamily from './assets/family.png'

type PropTypes = {
	permissions: {
		fee: boolean
		dailyStats: boolean
		setupPage: boolean
		expense: boolean
		family: boolean
		prospective: boolean
	}
	admin: boolean
	subAdmin: boolean
}

export const SettingsTab = ({ permissions, admin, subAdmin }: PropTypes) => {
	const { faculty, students, classes } = useSelector((state: RootReducerState) => state.db)

	const totalStaff = Object.values(faculty).filter(f => isValidTeacher(f) && f.Active).length

	const { totalFamilies, totalStudents } = getStudentsFamilies(
		Object.values(students).filter(s => isValidStudent(s) && s.Active)
	)

	const setupPermission = admin || (subAdmin && permissions.setupPage)

	return (
		<div className="p-6 lg:w-full">
			<div className="text-center text-lg mb-6 md:hidden">Tap to configure the module</div>
			<div className="space-y-4">
				<Card
					title={'Staff'}
					link={setupPermission ? '/staff' : '#'}
					caption={`Total = ${totalStaff}`}
					icon={iconTeachers}
				/>
				<Card
					title={'Classes'}
					link={setupPermission ? '/classes' : '#'}
					caption={`Total = ${Object.keys(classes).length}`}
					icon={iconClasses}
					disabled={!setupPermission}
				/>
				<Card
					title={'Students'}
					link={setupPermission ? '/students' : '#'}
					caption={`Total = ${totalStudents}`}
					disabled={!setupPermission}
					icon={iconStudents}
				/>
				<Card
					title={'Families'}
					link={admin || (subAdmin && permissions.family) ? '/families' : '#'}
					disabled={!admin || (subAdmin && permissions.family)}
					caption={`Total = ${totalFamilies}`}
					icon={iconFamily}
				/>
				<Card
					title={'Profile'}
					link={setupPermission ? '/settings' : '#'}
					disabled={!setupPermission}
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
