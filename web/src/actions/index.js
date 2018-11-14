import { hash } from 'utils'
import { createMerges, createDeletes, createLoginSucceed, createLoginFail } from './core'
import moment from 'moment'

const client_type = "mis";

export const MERGE_SETTINGS = "MERGE_SETTINGS"
export const mergeSettings = (settings) => dispatch => {
	console.log(settings)
	dispatch(createMerges([
		{
			path: ["db", "settings"],
			value: settings
		}
	]))
}
 
export const MERGE_FACULTY = "MERGE_FACULTY"
export const createFacultyMerge = (faculty) => dispatch => {

	dispatch(createMerges([
		{path: ["db", "faculty", faculty.id], value: faculty},
		{path: ["db", "users", faculty.id], value: {
			name: faculty.Name,
			password: faculty.Password,
			type: faculty.Admin ? "admin" : "teacher"
		}}
	]))
}

export const MERGE_STUDENT = "MERGE_STUDENT"
export const createStudentMerge = (student) => dispatch => {

	dispatch(createMerges([
		{
			path: ["db", "students", student.id],
			value: student
		},
	]))
}

export const deleteStudent = (student) => dispatch => {
	dispatch(createDeletes([
		{
			path: ["db", "students", student.id]
		}
	]))
}

export const LOCAL_LOGOUT = "LOCAL_LOGOUT"
export const createLogout = () => {
	return {
		type: LOCAL_LOGOUT
	}
}

export const LOCAL_LOGIN = "LOCAL_LOGIN"
export const createLogin = (name, password) => (dispatch) => {

	hash(password)
		.then(hashed => {
			dispatch({
				type: LOCAL_LOGIN,
				name,
				password: hashed
			})
		})
}

export const SCHOOL_LOGIN = "SCHOOL_LOGIN"
export const createSchoolLogin = (school_id, password) => (dispatch, getState, syncr) => {

	const action = {
		type: SCHOOL_LOGIN,
		school_id,
		password
	}

	dispatch(action);

	syncr.send({
		type: "LOGIN",
		client_type,
		payload: {
			school_id,
			password,
			client_id: getState().client_id
		}
	})
	.then(res => {
		console.log(res)
		
		dispatch(createLoginSucceed(school_id, res.db, res.token))
	})
	.catch(err => {
		console.error(err)
		dispatch(createLoginFail())
	})
}

export const createEditClass = newClass => dispatch => {
	dispatch(createMerges([
			{path: ["db", "classes", newClass.id], value: newClass}
		]
	))
}

export const addStudentToSection = (section_id, student) => dispatch => {

	dispatch(createMerges([
		{path: ["db", "students", student.id, "section_id"], value: section_id}
	]))
}

export const removeStudentFromSection = (student) => dispatch => {

	dispatch(createMerges([
		{path: ["db", "students", student.id, "section_id"], value: ""}
	]))
}

export const markStudent = (student, date, status, time = moment.now()) => dispatch => {
	console.log('mark student', student, ' as', status)

	dispatch(createMerges([
		{
			path: ["db", "students", student.id, "attendance", date],
			value: {
				date,
				status,
				time
			}
		}
	]))
}

export const markFaculty = (faculty, date, status, time = moment.now()) => dispatch => {
	console.log('mark faculty', faculty, 'as', status);

	dispatch(createMerges([
		{
			path: ["db", "faculty", faculty.id, "attendance", date, status],
			value: time
		}
	]))
}

export const addPayment = (student, payment_id, amount, date = moment.now(), type = "SUBMITTED", fee_id = undefined, fee_name = "Fee") => dispatch => {
	console.log('add payment', student.Name, 'amount', amount)

	if(amount === undefined || amount === 0) {
		return {};
	}

	dispatch(createMerges([
		{
			path: ["db", "students", student.id, "payments", payment_id],
			value: {
				amount,
				date,
				type,
				fee_id,
				fee_name
			}
		}
	]))
}

export const createTemplateMerges = templates => dispatch => {

	dispatch(createMerges([
		{
			path: ["db", "sms_templates"],
			value: templates
		}
	]))
}

export const mergeExam = (exam, class_id, section_id) => dispatch => {
	// exam is
	// { id, name, subject, total_score, date, student_marks: { student_id, grade } }

	const {id, name, subject, total_score, date, student_marks} = exam;

	// make sure date is a unix timestamp

	const student_merges = Object.entries(student_marks)
		.reduce((agg, [student_id, score]) => ([
			...agg,
			{
				path: ["db", "students", student_id, "exams", id, "score"],
				value: score
			}
		]), [])

	dispatch(createMerges([
		{
			path: ["db", "exams", id],
			value: { id, name, subject, total_score, date, class_id, section_id }
		},
		...student_merges
	]))
}