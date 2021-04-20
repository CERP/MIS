import React from 'react'
import { useSelector } from 'react-redux'

import Card from 'components/cards/pill-button'
import { isValidStudent, isValidTeacher } from 'utils'

import iconClasses from './assets/classes.svg'
import iconTeachers from './assets/teachers.svg'
import iconStudents from './assets/students.svg'
import iconFamily from './assets/family.png'

export const SettingsTab = () => {
	const { faculty, students, classes } = useSelector((state: RootReducerState) => state.db)

	const totalStaff = Object.values(faculty).filter(f => isValidTeacher(f) && f.Active).length

	const { totalFamilies, totalStudents } = getStudentsFamilies(
		Object.values(students).filter(s => isValidStudent(s) && s.Active)
	)

	return (
		<div className="p-6 md:w-2/5 mx-auto">
			<div className="text-center text-lg mb-6 md:hidden">Tap to configure the module</div>
			<div className="space-y-4">
				<Card
					title={'Staff'}
					link="/staff"
					caption={`Total = ${totalStaff}`}
					icon={iconTeachers}
				/>
				<Card
					title={'Classes'}
					link="/classes"
					caption={`Total = ${Object.keys(classes).length}`}
					icon={iconClasses}
				/>
				<Card
					title={'Students'}
					link="/students"
					caption={`Total = ${totalStudents}`}
					icon={iconStudents}
				/>
				<Card
					title={'Families'}
					link="/families"
					caption={`Total = ${totalFamilies}`}
					icon={iconFamily}
				/>
				<Card
					title={'Profile'}
					link="/settings"
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
