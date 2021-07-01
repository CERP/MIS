export enum ActionTypes {
	ALERT_BANNER_TEXT = 'ALERT_BANNER_TEXT',
	SWITCH_SCHOOL = 'SWITCH_SCHOOL',
	UPDATE_ONBOARDING_STAGE = 'UPDATE_ONBOARDING_STAGE'
}

export enum StaffType {
	TEACHING = 'TEACHING',
	NON_TEACHING = 'NON_TEACHING'
}

export enum OnboardingStage {
	ADD_STAFF = 'ADD_STAFF',
	ADD_CLASS = 'ADD_CLASS',
	ADD_STUDENTS = 'ADD_STUDENTS',
	COMPLETED = 'COMPLETED'
}

export enum MISFeePeriods {
	MONTHLY = 'MONTHLY',
	SINGLE = 'SINGLE'
}

export enum MISFeeLabels {
	SPECIAL_SCHOLARSHIP = 'SPECIAL_SCHOLARSHIP'
}

export const numberRegex = /^[1-9]\d*$/
export const cnicRegex = /^[0-9-]*$/

export const DefaultExamGrades = {
	grades: {
		'A+': {
			percent: '90',
			remarks: 'Excellent'
		},
		A: {
			percent: '80',
			remarks: 'Good'
		},
		'B+': {
			percent: '70',
			remarks: 'Satisfactory'
		},
		B: {
			percent: '65',
			remarks: 'Must work hard'
		},
		'C+': {
			percent: '60',
			remarks: 'Poor, work hard'
		},
		C: {
			percent: '55',
			remarks: 'Very poor'
		},
		D: {
			percent: '50',
			remarks: 'Very very poor'
		},
		F: {
			percent: '40',
			remarks: 'Fail'
		}
	}
}

type TemplateOptions = {
	[id: string]: string[]
}

export const TEMPLATE_OPTIONS: TemplateOptions = {
	attendance: [
		"Use $NAME to insert the student's name.",
		"Use $FNAME to insert the student's father name.",
		'Use $STATUS to insert the attendance status.'
	],
	attendance_staff: [
		"Use $NAME to insert the staff memeber's name.",
		'Use $STATUS to insert the attendance status.'
	],
	fee: [
		"Use $NAME to insert the student's name.",
		"Use $FNAME to insert the student's father name.",
		'Use $AMOUNT to insert the fee amount.',
		'Use $BALANCE to insert the total fee balance.'
	],
	result: [
		"Use $NAME to insert the student's name.",
		"Use $FNAME to insert the student's father name.",
		'Use $REPORT to send report line by line.'
	]
}
