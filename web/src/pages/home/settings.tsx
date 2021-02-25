import React from 'react'
import { useSelector } from 'react-redux'

import Card from 'components/cards/pill-button'

import iconClasses from './assets/classes.svg'
import iconTeachers from './assets/teachers.svg'
import iconStudents from './assets/students.svg'

export const SettingTab = () => {

	const { faculty, students, classes } = useSelector((state: RootReducerState) => state.db)

	return (
		<div className="p-6 md:w-2/5 mx-auto">
			<div className="text-center text-lg mb-6 md:hidden">Tap to configure the module</div>
			<Card
				title={"Staff"}
				link="/staff"
				caption={`Total = ${Object.keys(faculty).length}`}
				icon={iconTeachers}
			/>
			<Card
				title={"Classes"}
				link="/classes"
				caption={`Total = ${Object.keys(classes).length}`}
				icon={iconClasses}
			/>
			<Card
				title={"Students"}
				link="/students"
				caption={`Total = ${Object.keys(students).length}`}
				icon={iconStudents}
			/>
			<Card
				title={"Profile"}
				link="/school-profile"
				caption={"Profile, Grades, Data etc"}
				icon={iconStudents}
			/>
		</div>
	)
}
