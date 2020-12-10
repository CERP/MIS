interface MenuLink {
	name: string
	link: string
}

interface AlertReducerState extends Alert { }
interface UserReducerState {
	auth: Partial<Auth>
	profile: Partial<UserProfile>
	schools: Partial<School>
}

interface UserProfile {
	id: string
	name: string
	phone: string
}

interface Alert {
	type: string
	message: string
}

interface Auth {
	id: string
	token: string
}

interface School {
	[sid: string]: {
		classes: {
			[id: string]: MISClass
		}
	}
}

interface MISClass {
	id: string
	name: string
	classYear: number
	sections: {
		[id: string]: MISSection
	}
	subjects: {
		[subject: string]: true
	}
}


interface MISFaculty {
	[tid: string]: MISTeacher
}

interface MISTeacher {
	name: string
	phone: string
	avatar_url?: string
	attendance: MISTeacherAttendance
}

interface MISTeacherAttendance {
	[date: string]: "present" | "absent" | "leave"
}

interface MISSection {
	name: string
	faculty_id?: string
}

interface MISStudent {
	name: string
	fname: string
	phone: string
	avatar_url?: string
	section_id: string
	attendance: {
		[date: string]: Attendance
	}
}

interface AugmentedSection extends MISSection {
	id: string
	class_id: string
	namespaced_name: string
	className: string
	classYear: number
}

interface Attendance {
	present: number
	absent: number
	leave: number
}

type ChangeTypeOfKeys<
	T extends object,
	Keys extends keyof T,
	NewType
	> = {
		// Loop to every key. We gonna check if the key
		// is assignable to Keys. If yes, change the type.
		// Else, retain the type.
		[key in keyof T]: key extends Keys ? NewType : T[key]
	}