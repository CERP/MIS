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

interface MISSection {
	name: string
	faculty_id?: string
}

interface AugmentedSection extends MISSection {
	id: string
	class_id: string
	namespaced_name: string
	className: string
	classYear: number
}