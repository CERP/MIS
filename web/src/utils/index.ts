import { hostHTTPS } from './hostConfig'
import Hyphenator from './Hyphenator'
import { MISFeeLabels } from 'constants/index'

const encoder = new TextEncoder()

export async function hash(str: string): Promise<string> {
	try {
		const msgBuffer = encoder.encode(str)
		const hashBuffer = await crypto.subtle.digest('SHA-512', msgBuffer)

		const hashArray = Array.from(new Uint8Array(hashBuffer))

		const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('')
		return hashHex
	} catch (ex) {
		console.error(ex)

		return 'xxxxx'
	}
}

export const checkTime = async (): Promise<boolean> => {
	try {
		const reqOpts: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}

		const response: ServerResponse = await fetch(
			`${hostHTTPS}/mis/server-time`,
			reqOpts
		).then((res: Response) => res.json())

		const { os_time } = response
		const client_time = new Date().getTime()

		const diff = Math.abs(client_time - os_time)

		// timezone offset
		const threshold = 1 * 60 * 60 * 1000

		return diff < threshold
	} catch (ex) {
		console.log(ex)
		return true
	}
}

type ServerResponse = {
	os_time: number
}

export const formatCNIC = (cnic: string): string => {
	if (!cnic) {
		return cnic
	}

	return Hyphenator(cnic)
}

export const formatPhone = (phone: string): string => {
	if (phone === '' || phone.length >= 11) {
		return phone
	}

	// append '0' at start if not present due to auto excel conversion text to number
	return '0'.concat(phone)
}

/**
 * Takes a MIS student and check if it's valid student
 * @param student
 */
export const isValidStudent = (student: MISStudent): boolean => {
	return !!(student && student.id && student.Name && student.section_id)
}

/**
 * Takes a MIS staff and check if it's valid staff
 */

export const isValidTeacher = (teacher: MISTeacher): boolean => {
	return !!(teacher && teacher.id && teacher.Name)
}

/**
 * Takes permissions of currently logged in staff and
 * checks if they have the permission to perform a particular
 * action or not
 */

export const checkPermission = (
	permissions: MISTeacher['permissions'],
	title: string,
	subAdmin: boolean,
	admin: boolean,
	tipAccess?: boolean
): boolean => {
	if (admin) {
		return true
	}

	switch (title) {
		case 'fees': {
			return tipAccess ? false : permissions.fee && subAdmin
		}
		case 'expenses': {
			return tipAccess ? false : permissions.expense && subAdmin
		}
		case 'attendance': {
			return tipAccess ? false : true
		}
		case 'exams': {
			return tipAccess ? false : true
		}
		case 'diary': {
			return tipAccess ? false : true
		}
		case 'SMS': {
			return tipAccess ? false : true
		}
		case 'diary': {
			return tipAccess ? false : true
		}
		case 'Results': {
			return tipAccess ? false : true
		}
		case 'Analytics': {
			return tipAccess ? false : subAdmin
		}
		case 'payments': {
			return tipAccess ? false : subAdmin
		}
		case 'certificates': {
			return tipAccess ? false : subAdmin
		}
		case 'salaries': {
			return false
		}
		case 'setup':
			return permissions.setupPage && subAdmin
		case 'dailyStats':
			return permissions.dailyStats && subAdmin
		case 'families': {
			return tipAccess ? false : permissions.family && subAdmin
		}
		default:
			return true
	}
}

export const getPaymentLabel = (
	feeName: string,
	type: MISStudentPayment['type'] | MISStudentFee['type']
) => {
	if (feeName === MISFeeLabels.SPECIAL_SCHOLARSHIP) {
		return 'Scholarship (M)'
	}
	// set fee name in default class fee logic
	if (feeName === 'Montly') {
		return 'Class Fee'
	}

	if (type === 'FORGIVEN') {
		return 'Scholarship (A)'
	}

	if (type === 'SUBMITTED') {
		return feeName + '-' + 'Paid'
	}

	return feeName
}
