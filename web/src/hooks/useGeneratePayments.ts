import React, { useEffect } from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'

import { checkStudentDuesReturning } from 'utils/checkStudentDues'
import { addMultiplePayments } from 'actions'
import { isValidStudent } from 'utils'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'

export const useGeneratePayments = () => {
	const dispatch = useDispatch()
	const settings = useSelector((state: RootReducerState) => state.db.settings)
	const classes = useSelector((state: RootReducerState) => state.db.classes)
	const students = useSelector((state: RootReducerState) => state.db.students)

	const sections = getSectionsFromClasses(classes)

	const sectionStudents = Object.values(students).reduce<AugmentedStudent[]>((agg, student) => {
		if (isValidStudent(student, { active: true })) {
			return [
				...agg,
				{
					...student,
					section: sections?.find(section => section.id === student.section_id)
				}
			]
		}
		return agg
	}, [])

	useEffect(() => {
		const generatePayments = (students: AugmentedStudent[]) => {
			if (students.length > 0) {
				const payments = students.reduce((agg, curr) => {
					const curr_student_payments = checkStudentDuesReturning(curr, settings)
					if (curr_student_payments.length > 0) {
						return [...agg, ...curr_student_payments]
					}
					return agg
				}, [])

				if (payments.length > 0) {
					dispatch(addMultiplePayments(payments))
				}
			}
		}

		const curr_date = moment().format('MM-DD-YYYY')
		let auto_payments = JSON.parse(localStorage.getItem('auto-payments'))
		if (auto_payments === null || auto_payments.date !== curr_date) {
			auto_payments = { date: curr_date, isGenerated: true }
		}
		if (auto_payments.isGenerated) {
			// generate payments async
			generatePayments(sectionStudents)
			auto_payments = { date: curr_date, isGenerated: false }
			localStorage.setItem('auto-payments', JSON.stringify(auto_payments))
			console.log('payments-generated')
		}
	}, [sectionStudents, settings])
}
