import { hash, isValidStudent } from 'utils'
import { createMerges, createDeletes, createLoginFail, analyticsEvent, uploadImages } from './core'
import moment from 'moment'
import { v4 } from 'node-uuid'
import Syncr from '@cerp/syncr'

import { historicalPayment } from 'modules/Settings/HistoricalFees/historical-fee'
import { OnboardingStage } from 'constants/index'

const client_type = 'mis'

export const MERGE_SETTINGS = 'MERGE_SETTINGS'

export const mergeSettings = (settings: MISSettings) => (dispatch: Function) => {
	console.log(settings)
	dispatch(
		createMerges([
			{
				path: ['db', 'settings'],
				value: settings
			}
		])
	)
}

export const MERGE_FACULTY = 'MERGE_FACULTY'
export const createFacultyMerge = (faculty: MISTeacher, is_first?: boolean) => (
	dispatch: Function
) => {
	dispatch(
		createMerges([
			{
				path: ['db', 'faculty', faculty.id],
				value: faculty
			},
			{
				path: ['db', 'users', faculty.id],
				value: {
					name: faculty.Name,
					password: faculty.Password,
					type: faculty.Admin ? 'admin' : 'teacher',
					hasLogin: faculty.HasLogin
				}
			}
		])
	)

	if (is_first) {
		// start the school onboarding jounery
		dispatch(
			createMerges([
				{
					path: ['db', 'onboarding', 'stage'],
					value: OnboardingStage.ADD_STAFF
				}
			])
		)

		dispatch({
			type: LOCAL_LOGIN,
			name: faculty.Name,
			password: faculty.Password
		})
	}
}

/**
 * @description an action to dispatch the upload image merge
 *
 * @param facultyId
 * @param image_string
 */

export const uploadFacultyProfilePicture = (facultyId: string, imageString: string) => (
	dispatch: Function
) => {
	const merge_item: ImageMergeItem = {
		path: ['db', 'faculty', facultyId, 'ProfilePicture'],
		image_string: imageString,
		id: v4()
	}

	dispatch(uploadImages([merge_item]))
}

export const MERGE_STUDENT = 'MERGE_STUDENT'
export const createStudentMerge = (student: MISStudent) => (dispatch: Function) => {
	dispatch(
		createMerges([
			{
				path: ['db', 'students', student.id],
				value: student
			}
		])
	)
}

export const createStudentMerges = (students: MISStudent[]) => (dispatch: Function) => {
	dispatch(
		createMerges(
			students.map(s => ({
				path: ['db', 'students', s.id],
				value: s
			}))
		)
	)
}

export const deleteStudent = (student: MISStudent) => (dispatch: Function) => {
	dispatch(
		createDeletes([
			{
				path: ['db', 'students', student.id]
			}
		])
	)
}

export const deleteStudentById = (student_id: string) => (dispatch: Function) => {
	dispatch(
		createDeletes([
			{
				path: ['db', 'students', student_id]
			}
		])
	)
}

export const deleteFaculty = (faculty_id: string) => (
	dispatch: Function,
	getState: () => RootReducerState
) => {
	const state = getState()

	const faculty = state.db.faculty[faculty_id]

	if (faculty === undefined || state.auth.name === faculty.Name) {
		alert('Cannot delete this teacher they are currently logged in on this device')
		return
	}

	const deletes = []

	for (const c of Object.values(state.db.classes)) {
		for (const s_id of Object.keys(c.sections)) {
			if (
				c.sections[s_id].faculty_id !== undefined &&
				c.sections[s_id].faculty_id === faculty_id
			) {
				deletes.push({
					path: ['db', 'classes', c.id, 'sections', s_id, 'faculty_id']
				})
			}
		}
	}

	dispatch(
		createDeletes([
			{
				path: ['db', 'faculty', faculty_id]
			},
			{
				path: ['db', 'users', faculty_id]
			},
			...deletes
		])
	)
}

type PromotionMap = {
	[student_id: string]: {
		current: string
		next: string
	}
}

type Section = {
	id: string
	class_id: string
	namespaced_name: string
	className: string
	classYear: number
	name: string
	faculty_id?: string
}

export const promoteStudents = (promotion_map: PromotionMap, section_metadata: Section[]) => (
	dispatch: Function
) => {
	// accept a map of key: student_id, value: {current, next}

	// think about the case when someone promotes up and down repeatedly.
	// this will overwrite their history... instead of adding to it.

	const merges = Object.entries(promotion_map).reduce((agg, [student_id, { current, next }]) => {
		if (next === 'FINISHED_SCHOOL') {
			return [
				...agg,
				{
					path: ['db', 'students', student_id, 'Active'],
					value: false
				},
				{
					path: ['db', 'students', student_id, 'section_id'],
					value: ''
				},
				{
					path: ['db', 'students', student_id, 'class_history', current, 'end_date'],
					value: new Date().getTime()
				},
				{
					path: ['db', 'students', student_id, 'tags', next],
					value: true
				}
			]
		}

		const meta = section_metadata.find(x => x.id === next)
		return [
			...agg,
			{
				path: ['db', 'students', student_id, 'section_id'],
				value: next
			},
			{
				path: ['db', 'students', student_id, 'class_history', current, 'end_date'],
				value: new Date().getTime()
			},
			{
				path: ['db', 'students', student_id, 'class_history', next],
				value: {
					start_date: new Date().getTime(),
					class_id: meta.class_id, // class id
					class_name: meta.className,
					namespaced_name: meta.namespaced_name
				}
			}
		]
	}, [])

	console.log(merges)

	dispatch(createMerges(merges))
}

export const LOCAL_LOGOUT = 'LOCAL_LOGOUT'
export const createLogout = () => {
	return {
		type: LOCAL_LOGOUT
	}
}

export const LOCAL_LOGIN = 'LOCAL_LOGIN'
export const createLogin = (name: string, password: string) => (dispatch: Function) => {
	hash(password).then(hashed => {
		dispatch({
			type: LOCAL_LOGIN,
			name,
			password: hashed
		})
	})
}

export const SIGN_UP_LOADING = 'SIGN_UP_LOADING'
export const SIGN_UP_SUCCEED = 'SIGN_UP_SUCCEED'
export const SIGN_UP_FAILED = 'SIGN_UP_FAILED'

export const createSignUp = (profile: SchoolSignup) => (
	dispatch: Function,
	getState: () => RootReducerState,
	syncr: Syncr
) => {
	// dispatch action to say you are loading/sending the sign up
	dispatch({
		type: SIGN_UP_LOADING
	})

	const signup_obj = {
		signup: profile,
		referral: {
			school_name: '',
			city: profile.city,
			office: profile.city,
			user: '',
			notes: profile.schoolName,
			agent_name: '',
			owner_name: profile.name,
			owner_phone: profile.phone,
			school_type: '',
			package_name: profile.packageName,
			type_of_login: '',
			owner_other_job: '',
			association_name: '',
			area_manager_name: '',
			computer_operator: '',
			owner_easypaisa_number: '',
			previous_software_name: '',
			previous_management_system: ''
		}
	}

	syncr
		.send({
			type: 'SIGN_UP',
			client_type,
			sign_up_id: v4(),
			payload: signup_obj
		})
		.then(res => {
			console.log(res)
			dispatch({
				type: SIGN_UP_SUCCEED
			})
			// dispatch action to say sign up succeeded
		})
		.catch(err => {
			console.error(err)
			if (err === 'timeout') {
				console.log('your internet sucks')
			}

			dispatch({
				type: SIGN_UP_FAILED,
				reason: err
			})
			// dispatch action to say sign up failed
		})
}

export const uploadStudentProfilePicture = (student: MISStudent, image_string: string) => (
	dispatch: Function,
	getState: () => RootReducerState,
	syncr: Syncr
) => {
	const path = ['db', 'students', student.id, 'ProfilePicture']
	const id = v4()

	const merge_item: ImageMergeItem = {
		path,
		image_string,
		id
	}

	dispatch(uploadImages([merge_item]))
}

export const SCHOOL_LOGIN = 'SCHOOL_LOGIN'
export const createSchoolLogin = (school_id: string, password: string) => (
	dispatch: Function,
	getState: () => RootReducerState,
	syncr: Syncr
) => {
	const action = {
		type: SCHOOL_LOGIN,
		school_id,
		password
	}

	dispatch(action)

	syncr
		.send({
			type: 'LOGIN',
			client_type,
			payload: {
				school_id,
				password,
				client_id: getState().client_id
			}
		})
		.then(res => {
			syncr.verify()

			dispatch({
				type: 'GETTING_DB'
			})
		})
		.catch(err => {
			console.error(err)
			dispatch(createLoginFail())
		})
}

export const autoSchoolLogin = (
	school_id: string,
	token: string,
	client_id: string,
	refcode: string
) => (dispatch: Function, getState: () => RootReducerState, syncr: Syncr) => {
	const action = {
		type: SCHOOL_LOGIN
	}

	dispatch(action)

	syncr
		.send({
			type: 'AUTO_LOGIN',
			client_type,
			payload: {
				school_id,
				token,
				client_id: getState().client_id,
				ilmx_school_id: refcode,
				ilmx_client_id: client_id
			}
		})
		.then((res: { status: string; number: string }) => {
			syncr.verify()

			localStorage.setItem('ilmx', res.number)
			localStorage.setItem('user', 'ILMX')

			dispatch({
				type: 'AUTO_LOGIN_SUCCEED'
			})
		})
		.catch(err => {
			console.error(err)
			dispatch(createLoginFail())
		})
}

export const createEditClass = (newClass: MISClass) => (dispatch: Function) => {
	dispatch(
		createMerges([
			{
				path: ['db', 'classes', newClass.id],
				value: newClass
			}
		])
	)
}

export const deleteClass = (Class: MISClass) => (
	dispatch: Function,
	getState: () => RootReducerState
) => {
	const state = getState()

	const students = Object.values(state.db.students)
		.filter(student => Class.sections[student.section_id] !== undefined)
		.map(student => ({
			path: ['db', 'students', student.id, 'section_id'],
			value: ''
		}))

	dispatch(createMerges(students))

	dispatch(
		createDeletes([
			{
				path: ['db', 'classes', Class.id]
			}
		])
	)
}

export const passOutStudents = (Class: MISClass) => (
	dispatch: Function,
	getState: () => RootReducerState
) => {
	const state = getState()

	const students = Object.values(state.db.students)
		.filter(student => Class.sections[student.section_id] !== undefined)
		.reduce((agg, student) => {
			return [
				...agg,
				{
					path: ['db', 'students', student.id, 'section_id'],
					value: ''
				},
				{
					path: ['db', 'students', student.id, 'Active'],
					value: false
				},
				{
					path: ['db', 'students', student.id, 'tags', 'FINISHED_SCHOOL'],
					value: true
				}
			]
		}, [])

	dispatch(createMerges(students))

	dispatch(
		createDeletes([
			{
				path: ['db', 'classes', Class.id, 'sections', 'mis_temp']
			},
			{
				path: ['db', 'classes', Class.id]
			}
		])
	)
}
export const deleteSection = (classId: string, sectiondId: string) => (
	dispatch: Function,
	getState: () => RootReducerState
) => {
	const state = getState()

	const students = Object.values(state.db.students)
		.filter(student => student.section_id === sectiondId)
		.map(student => ({
			path: ['db', 'students', student.id, 'section_id'],
			value: ''
		}))

	// we need to remove section Id from students so they can be assigned new section
	dispatch(createMerges(students))

	// delete the section from class
	dispatch(
		createDeletes([
			{
				path: ['db', 'classes', classId, 'sections', sectiondId]
			}
		])
	)
}

export const deleteSubject = (classId: string, subject: string) => (dispatch: Function) => {
	dispatch(
		createDeletes([
			{
				path: ['db', 'classes', classId, 'subjects', subject]
			}
		])
	)
}

export const addStudentToSection = (section_id: string, student: MISStudent) => (
	dispatch: Function
) => {
	dispatch(
		createMerges([
			{
				path: ['db', 'students', student.id, 'section_id'],
				value: section_id
			}
		])
	)
}

export const removeStudentFromSection = (student: MISStudent) => (dispatch: Function) => {
	dispatch(createMerges([{ path: ['db', 'students', student.id, 'section_id'], value: '' }]))
}

export const markStudent = (
	student: MISStudent,
	date: string,
	status: MISStudentAttendanceEntry['status'],
	time = moment.now()
) => (dispatch: Function) => {
	dispatch(
		createMerges([
			{
				path: ['db', 'students', student.id, 'attendance', date],
				value: {
					date,
					status,
					time
				}
			}
		])
	)
}

export const markAllStudents = (
	students: MISStudent[],
	date: string,
	status: MISStudentAttendanceEntry['status'],
	time = moment.now()
) => (dispatch: Function) => {
	const merges = students.reduce((agg, s) => {
		return [
			...agg,
			{
				path: ['db', 'students', s.id, 'attendance', date],
				value: {
					date,
					status,
					time
				}
			}
		]
	}, [])

	dispatch(createMerges(merges))
}

export const saveFamilyInfo = (siblings: MISStudent[], info: MISFamilyInfo, famId?: string) => (
	dispatch: Function
) => {
	const siblingMerges = siblings
		.map(s => [
			{
				path: ['db', 'students', s.id, 'FamilyID'],
				value: famId ?? '' // just to be sure, otherwise famId will not be undefined
			},
			{
				path: ['db', 'students', s.id, 'ManName'],
				value: info.ManName
			},
			{
				path: ['db', 'students', s.id, 'Phone'],
				value: info.Phone
			},
			{
				path: ['db', 'students', s.id, 'AlternatePhone'],
				value: info.AlternatePhone ?? ''
			},
			{
				path: ['db', 'students', s.id, 'ManCNIC'],
				value: info.ManCNIC
			},
			{
				path: ['db', 'students', s.id, 'Address'],
				value: info.Address
			}
		])
		.reduce((agg, curr) => {
			return [...agg, ...curr]
		}, [])

	dispatch(createMerges(siblingMerges))
}

export const addStudentToFamily = (student: MISStudent, family_id: string) => (
	dispatch: Function
) => {
	dispatch(
		createMerges([
			{
				path: ['db', 'students', student.id, 'FamilyID'],
				value: family_id
			}
		])
	)
}

export const markFaculty = (
	faculty: MISTeacher,
	date: string,
	status: MISTeacherAttendanceStatus,
	time = moment.now()
) => (dispatch: Function) => {
	console.log('mark faculty', faculty, 'as', status)

	dispatch(
		createMerges([
			{
				path: ['db', 'faculty', faculty.id, 'attendance', date, status],
				value: time
			}
		])
	)
}

export const markAllFacultyAttendance = (
	faculty: MISTeacher[],
	date: string,
	status: MISTeacherAttendanceStatus,
	time = moment.now()
) => (dispatch: Function) => {
	const merges = faculty.reduce((agg, f) => {
		return [
			...agg,
			{
				path: ['db', 'faculty', f.id, 'attendance', date, status],
				value: time
			}
		]
	}, [])

	dispatch(createMerges(merges))
}

export const undoFacultyAttendance = (faculty: MISTeacher, date: string) => (
	dispatch: Function
) => {
	dispatch(
		createDeletes([
			{
				path: ['db', 'faculty', faculty.id, 'attendance', date]
			}
		])
	)
}

export const addPayment = (
	student: MISStudent,
	payment_id: string,
	amount: number,
	date = moment.now(),
	type: MISStudentPayment['type'] = 'SUBMITTED',
	fee_id: string = undefined,
	fee_name = 'Fee'
) => (dispatch: Function) => {
	if (amount === undefined || amount === 0) {
		return {}
	}
	dispatch(
		createMerges([
			{
				path: ['db', 'students', student.id, 'payments', payment_id],
				value: {
					amount,
					date,
					type,
					fee_id,
					fee_name
				}
			}
		])
	)
}

export const assignLearningLevel = (
	student_id: string,
	subject: TIPSubjects,
	level: TIPGrades,
	is_oral: boolean,
	history: TIPGradesHistory
) => (dispatch: Function) => {
	dispatch(
		createMerges([
			{
				path: [
					'db',
					'students',
					student_id,
					'targeted_instruction',
					'learning_level',
					subject,
					'grade'
				],
				value: level
			},
			{
				path: [
					'db',
					'students',
					student_id,
					'targeted_instruction',
					'learning_level',
					subject,
					'is_oral'
				],
				value: is_oral
			},
			{
				path: [
					'db',
					'students',
					student_id,
					'targeted_instruction',
					'learning_level',
					subject,
					'history'
				],
				value: history
			}
		])
	)
}

export const mergeTIPResult = (
	student_id: string,
	diagnostic_report: TIPDiagnosticReport,
	test_id: string
) => (dispatch: Function) => {
	dispatch(
		createMerges([
			{
				path: ['db', 'students', student_id, 'targeted_instruction', 'results', test_id],
				value: diagnostic_report
			}
		])
	)
}

type QuizResult = {
	[std_id: string]: number
}

export const saveTIPQuizResult = (
	quiz_result: QuizResult,
	quiz_id: string,
	total_marks: number,
	grade: TIPLevels,
	subject: TIPSubjects
) => (dispatch: Function) => {
	const merges = Object.entries(quiz_result).reduce((agg, [student_id, obtained_marks]) => {
		return [
			...agg,
			{
				path: [
					'db',
					'students',
					student_id,
					'targeted_instruction',
					'quiz_result',
					grade,
					subject,
					quiz_id,
					'obtained_marks'
				],
				value: obtained_marks
			},
			{
				path: [
					'db',
					'students',
					student_id,
					'targeted_instruction',
					'quiz_result',
					grade,
					subject,
					quiz_id,
					'total_marks'
				],
				value: total_marks
			}
		]
	}, [])
	dispatch(createMerges(merges))
}

export const resetTIPQuizResult = (
	quiz_result: QuizResult,
	quiz_id: string,
	grade: TIPLevels,
	subject: TIPSubjects
) => (dispatch: Function) => {
	const merges = Object.keys(quiz_result).reduce((agg, student_id) => {
		return [
			...agg,
			{
				path: [
					'db',
					'students',
					student_id,
					'targeted_instruction',
					'quiz_result',
					grade,
					subject,
					quiz_id,
					'obtained_marks'
				],
				value: 0
			}
		]
	}, [])
	dispatch(createMerges(merges))
}

export const resetStudentLearningLevel = (student_id: string, subject: TIPSubjects) => (
	dispatch: Function
) => {
	dispatch(
		createDeletes([
			{
				path: [
					'db',
					'students',
					student_id,
					'targeted_instruction',
					'learning_level',
					subject
				]
			}
		])
	)
}

export const resetStudentGrades = (student_id: string, test_id: string) => (dispatch: Function) => {
	dispatch(
		createDeletes([
			{
				path: ['db', 'students', student_id, 'targeted_instruction', 'results', test_id]
			}
		])
	)
}

export const lessonPlanTaken = (
	faculty_id: string,
	learning_level_id: string,
	subject: string,
	lesson_number: string,
	value: boolean
) => (dispatch: Function) => {
	dispatch(
		createMerges([
			{
				path: [
					'db',
					'faculty',
					faculty_id,
					'targeted_instruction',
					'curriculum',
					learning_level_id,
					subject,
					lesson_number,
					'taken'
				],
				value: value
			}
		])
	)
}

export const quizTaken = (faculty_id: string, quiz_id: string, value: boolean) => (
	dispatch: Function
) => {
	dispatch(
		createMerges([
			{
				path: [
					'db',
					'faculty',
					faculty_id,
					'targeted_instruction',
					'quizzes',
					quiz_id,
					'taken'
				],
				value: value
			}
		])
	)
}

export const clearLessonPlans = (
	faculty_id: string,
	learning_level_id: string,
	subject: string
) => (dispatch: Function) => {
	dispatch(
		createDeletes([
			{
				path: [
					'db',
					'faculty',
					faculty_id,
					'targeted_instruction',
					'curriculum',
					learning_level_id,
					subject
				]
			}
		])
	)
}

type PaymentAddItem = {
	student: MISStudent
	payment_id: string
} & MISStudentPayment

export const addMultiplePayments = (payments: PaymentAddItem[]) => (dispatch: Function) => {
	// payments is array of { student, payment_id, amount, date, type, fee_id, fee_name }

	const merges = payments.map(p => ({
		path: ['db', 'students', p.student.id, 'payments', p.payment_id],
		value: {
			amount: p.amount,
			date: p.date,
			type: p.type,
			fee_id: p.fee_id,
			fee_name: p.fee_name
		}
	}))

	dispatch(createMerges(merges))
}

export const addHistoricalPayment = (payment: historicalPayment, student_id: string) => (
	dispatch: Function
) => {
	// paymnet = { amount_owed, amount_paid, amount_forgiven, date, name }

	const { amount_owed, amount_paid, amount_forgiven, date, name } = payment
	const merges = []

	if (amount_owed > 0) {
		merges.push({
			path: ['db', 'students', student_id, 'payments', v4()],
			value: {
				type: 'OWED',
				fee_name: name,
				amount: amount_owed,
				date
			}
		})
	}
	if (amount_paid > 0) {
		merges.push({
			path: ['db', 'students', student_id, 'payments', v4()],
			value: {
				type: 'SUBMITTED',
				amount: amount_paid,
				date
			}
		})
	}

	if (amount_forgiven > 0) {
		merges.push({
			path: ['db', 'students', student_id, 'payments', v4()],
			value: {
				type: 'FORGIVEN',
				amount: amount_forgiven,
				date
			}
		})
	}

	dispatch(createMerges(merges))
}

export const addExpense = (newExpense: Partial<MISExpense>) => (dispatch: Function) => {
	const expense = 'MIS_EXPENSE'
	const id = v4()
	const time = moment.now()
	const { amount, label, type, category, quantity, date } = newExpense
	dispatch(
		createMerges([
			{
				path: ['db', 'expenses', id],
				value: {
					expense,
					amount,
					label,
					type,
					category,
					quantity,
					date,
					time
				}
			}
		])
	)
}

export const addSalaryExpense = (newSalary: Partial<MISSalaryExpense>) => (dispatch: Function) => {
	const {
		faculty_id,
		date,
		amount,
		label,
		category,
		type,
		deduction,
		deduction_reason,
		advance
	} = newSalary
	const id = `${moment(date).format('MM-YYYY')}-${faculty_id}`
	const expense = 'SALARY_EXPENSE'
	let time = moment.now()
	dispatch(
		createMerges([
			{
				path: ['db', 'expenses', id],
				value: {
					expense,
					amount,
					label, // Teacher name
					type, // PAYMENT_GIVEN or PAYMENT_DUE
					category, // SALARY
					faculty_id,
					deduction_reason,
					advance,
					deduction,
					date,
					time
				}
			}
		])
	)
}

interface ExpenseEditItem {
	[id: string]: { amount: number }
}

export const editExpense = (expenses: ExpenseEditItem) => (
	dispatch: Function,
	getState: () => RootReducerState
) => {
	//expenses is object of key (id) and value { amount }

	const state = getState()

	const merges = Object.entries(expenses).reduce((agg, [id, { amount }]) => {
		return [
			...agg,
			{
				path: ['db', 'expenses', id],
				value: {
					...state.db.expenses[id],
					amount
				}
			}
		]
	}, [])

	dispatch(createMerges(merges))
}

export const deleteExpense = (id: string) => (dispatch: Function) => {
	//Id of the expense to be deleted

	dispatch(
		createDeletes([
			{
				path: ['db', 'expenses', id]
			}
		])
	)
}

type FeeAddItem = MISStudentFee & {
	student: MISStudent
	fee_id: string
}

export const addMultipleFees = (fees: FeeAddItem[]) => (dispatch: Function) => {
	// fees is an array of { student, fee_id, amount, type, period, name}

	const merges = fees.map(f => ({
		path: ['db', 'students', f.student.id, 'fees', f.fee_id],
		value: {
			amount: f.amount,
			name: f.name,
			period: f.period,
			type: f.type
		}
	}))

	dispatch(createMerges(merges))
}

type SingleFeeItem = MISStudentFee & {
	student_id: string
	fee_id: string
}

export const addFee = (student_fee: SingleFeeItem) => (dispatch: Function) => {
	// student_fee is an object contains MISStudentFee, student_id and fee_id
	const merges = [
		{
			path: ['db', 'students', student_fee.student_id, 'fees', student_fee.fee_id],
			value: {
				amount: student_fee.amount,
				name: student_fee.name,
				period: student_fee.period,
				type: student_fee.type
			}
		}
	]

	dispatch(createMerges(merges))
}

type FeeDeleteItem = {
	[id: string]: {
		student_id: string
		paymentIds: string[]
	}
}

export const deleteMultipleFees = (students_fees: FeeDeleteItem) => (dispatch: Function) => {
	// students_fees is an object that contains fee id as key and object { student_id: string, payment_id: [] } as value
	const deletes = Object.entries(students_fees).reduce(
		(agg, [fee_id, { student_id, paymentIds }]) => {
			const pay_deletes = paymentIds.map(pid => ({
				path: ['db', 'students', student_id, 'payments', pid]
			}))

			return [
				...agg,
				{
					path: ['db', 'students', student_id, 'fees', fee_id]
				},
				...pay_deletes
			]
		},
		[]
	)

	dispatch(createDeletes(deletes))
}

export const createTemplateMerges = (templates: RootDBState['sms_templates']) => (
	dispatch: Function
) => {
	dispatch(
		createMerges([
			{
				path: ['db', 'sms_templates'],
				value: templates
			}
		])
	)
}

type Exam = MISExam & {
	student_marks: {
		[id: string]: MISStudentExam
	}
}
export const mergeExam = (exam: Exam, class_id: string, section_id: string) => (
	dispatch: Function
) => {
	// exam is
	// {id, name, subject, total_score, date, student_marks: {score, grade, remarks}}

	const { id, name, subject, total_score, date, student_marks } = exam

	// make sure date is a unix timestamp

	const student_merges = Object.entries(student_marks).reduce(
		(agg, [student_id, student_mark]) => [
			...agg,
			{
				path: ['db', 'students', student_id, 'exams', id],
				value: {
					score: student_mark.score,
					grade: student_mark.grade,
					remarks: student_mark.remarks
				}
			}
		],
		[]
	)

	dispatch(
		createMerges([
			{
				path: ['db', 'exams', id],
				value: { id, name, subject, total_score, date, class_id, section_id }
			},
			...student_merges
		])
	)
}

export const updateBulkExams = (exam_marks_sheet: ExamScoreSheet) => (dispatch: Function) => {
	let merges = []

	for (const student of Object.values(exam_marks_sheet)) {
		const exams = student.scoreSheetExams

		for (const exam of Object.values(exams)) {
			// only create merges for those students' exams which are updated
			if (exam.edited) {
				merges.push({
					path: ['db', 'students', student.id, 'exams', exam.id],
					value: {
						...exam.stats
					}
				})
			}
		}
	}

	if (merges.length > 0) {
		dispatch(createMerges(merges))
	}
}

export const removeStudentFromExam = (e_id: string, student_id: string) => (dispatch: Function) => {
	dispatch(
		createDeletes([
			{
				path: ['db', 'students', student_id, 'exams', e_id]
			}
		])
	)
}

export const deleteExam = (students: string[], exam_id: string) => (dispatch: Function) => {
	//students  is an array of student Id's

	const deletes = students.map(s_id => ({
		path: ['db', 'students', s_id, 'exams', exam_id]
	}))

	dispatch(
		createDeletes([
			{
				path: ['db', 'exams', exam_id]
			},
			...deletes
		])
	)
}

export const logSms = (history: AugmentedSmsHistory) => (dispatch: Function) => {
	dispatch(
		createMerges([
			{
				path: ['db', 'analytics', 'sms_history', v4()],
				value: history
			}
		])
	)
}

export const addTag = (students: MISStudent[], tag: string) => (dispatch: Function) => {
	//students is an array of single or multiple students
	//tag is the text od tag

	const merges = students.map(s => ({
		path: ['db', 'students', s.id, 'tags', tag],
		value: true
	}))

	dispatch(createMerges(merges))
}

export const addLogo = (logo_string: string) => (dispatch: Function) => {
	//logo_string is a base64 string
	dispatch(
		createMerges([
			{
				path: ['db', 'assets', 'schoolLogo'],
				value: logo_string
			}
		])
	)
}

export const addDiary = (date: string, section_id: string, diary: MISDiary['section_id']) => (
	dispatch: Function
) => {
	const merges = Object.entries(diary).map(([subject, homework]) => ({
		path: ['db', 'diary', date, section_id, subject],
		value: homework
	}))

	dispatch(createMerges(merges))
}

export const editPayment = (payments: AugmentedMISPaymentMap) => (dispatch: Function) => {
	// payments is an object with id as key and value is { amount, fee_id }
	const merges = Object.entries(payments).reduce(
		(agg, [p_id, { student_id, amount, fee_id }]) => {
			return [
				...agg,
				{
					path: ['db', 'students', student_id, 'payments', p_id, 'amount'],
					value: amount
				},
				{
					path: ['db', 'students', student_id, 'fees', fee_id, 'amount'],
					value: Math.abs(amount).toString() // because we're handling fees as string value
				}
			]
		},
		[]
	)
	dispatch(createMerges(merges))
}

export const issueCertificate = (type: string, student_id: string, faculty_id: string) => (
	dispatch: Function
) => {
	const date = moment.now()
	console.log('IN ISSUE CERTIFCATE', type, faculty_id, date, student_id)

	dispatch(
		createMerges([
			{
				path: ['db', 'students', student_id, 'certificates', `${date}`],
				value: {
					type,
					faculty_id,
					date
				}
			}
		])
	)
}

export const resetTrial = (days = 7) => (dispatch: Function) => {
	const date = moment().subtract(days, 'days').unix() * 1000

	dispatch(
		createMerges([
			{
				path: ['db', 'package_info', 'date'],
				value: date
			}
		])
	)
}

export const markPurchased = () => (dispatch: Function) => {
	dispatch(
		createMerges([
			{
				path: ['db', 'package_info', 'paid'],
				value: true
			}
		])
	)
}

export const trackRoute = (route: string) => (dispatch: Function) => {
	dispatch(
		analyticsEvent([
			{
				type: 'ROUTE',
				meta: {
					route: route.split('/').splice(1)
				}
			}
		])
	)
}

export interface DateSheetMerges {
	[id: string]: MISDateSheet
}

export const saveDateSheet = (datesheetMerges: DateSheetMerges, section_id: string) => (
	dispatch: Function
) => {
	const merges = Object.entries(datesheetMerges).reduce((agg, [id, dateSheet]) => {
		const currMerges = Object.entries(dateSheet).reduce((agg, [subj, ds]) => {
			return [
				...agg,
				{
					path: ['db', 'planner', 'datesheet', section_id, id, subj],
					value: ds
				}
			]
		}, [])

		return [...agg, ...currMerges]
	}, [])

	dispatch(createMerges(merges))
}

export const removeSubjectFromDatesheet = (id: string, subj: string, section_id: string) => (
	dispatch: Function
) => {
	dispatch(
		createDeletes([
			{
				path: ['db', 'planner', 'datesheet', section_id, id, subj]
			}
		])
	)
}

export const resetFees = (students: MISStudent[]) => (dispatch: Function) => {
	const { deletes, merges } = (students || []).reduce(
		(agg, curr) => {
			// Make sure create merges for fees and payments
			// If fees exist to avoid unnecessary dispatch deletes action
			if (
				(curr.fees && Object.keys(curr.fees).length > 0) ||
				(curr.payments && Object.keys(curr.payments).length > 0)
			) {
				return {
					deletes: [
						...agg.deletes,
						{
							path: ['db', 'students', curr.id, 'fees']
						},
						{
							path: ['db', 'students', curr.id, 'payments']
						}
					],
					merges: [
						...agg.merges,
						{
							path: ['db', 'students', curr.id, 'fees'],
							value: {}
						},
						{
							path: ['db', 'students', curr.id, 'payments'],
							value: {}
						}
					]
				}
			}
			return agg
		},
		{ deletes: [], merges: [] }
	)

	if (deletes.length > 0) {
		dispatch(createDeletes(deletes))
	}

	// here need to create merge because deleting path, removes fees and payments keys from
	// student profile. To prevent this, have to create merge action as well.
	// Recently it causes bugs in single student profile and possible, it will create issues in
	// other places of app where fees or payment are being processed.
	if (merges.length > 0) {
		dispatch(createMerges(merges))
	}
}

export const RESET_ADMIN_PASSWORD = 'RESET_ADMIN_PASSWORD'
export const sendTempPassword = (faculty: MISTeacher, password: string) => (
	dispatch: Function,
	getState: () => RootReducerState,
	syncr: Syncr
) => {
	if (!syncr.ready) {
		syncr.onNext('connect', () => {
			dispatch(sendTempPassword(faculty, password))
		})
	}

	syncr
		.send({
			type: RESET_ADMIN_PASSWORD,
			client_type,
			payload: {
				number: faculty.Phone,
				password,
				school_id: getState().auth.school_id,
				client_id: getState().client_id
			}
		})
		.then(res => {
			console.log(res)
			dispatch(createFacultyMerge(faculty))
		})
		.catch(err => {
			console.error(err)
		})
}

export const fetchTargetedInstruction = () => (
	dispatch: Function,
	getState: () => RootReducerState,
	syncr: Syncr
) => {
	fetch('https://storage.googleapis.com/targeted-instructions/tip.json')
		.then(res => res.json())
		.then(tip_data =>
			dispatch({
				type: 'GET_TARGETED_INSTRUCTION_SUCCESS',
				payload: tip_data
			})
		)
}
export const deletePayment = (student_id: string, payment_id: string) => (dispatch: Function) => {
	dispatch(
		createDeletes([
			{
				path: ['db', 'students', student_id, 'payments', payment_id]
			}
		])
	)
}
