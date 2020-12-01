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
		[id: string]: {
			name: string
			faculty_id?: string
		}
	}
	subjects: {
		[subject: string]: true
	}
}