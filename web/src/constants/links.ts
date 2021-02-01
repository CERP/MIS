type TutorialLink = {
	[pathname: string]: {
		title: string
		titleShort: string
		link: string
	}
}

export const MISTutorialLinks: TutorialLink = {
	DEFAULT: {
		title: 'What is MISchool?',
		titleShort: 'Brief Introduction to MISchool',
		link: 'https://www.youtube.com/embed/SHnVsuqp6G8?controls=0',
	},
	'SCHOOL-LOGIN': {
		title: 'How to school and staff login?',
		titleShort: 'School Login',
		link: 'https://www.youtube-nocookie.com/embed/4TymLLhu4GM?controls=0',
	},
	LANDING: {
		title: 'What is on MISchool landing page?',
		titleShort: 'Brief Intro to MIS Modules',
		link: 'https://www.youtube-nocookie.com/embed/swWEOW3OGRU?controls',
	},
	TEACHER: {
		title: '',
		titleShort: '',
		link: '',
	},
	STUDENT: {
		title: 'How to manage students?',
		titleShort: 'Manage Students',
		link: 'https://www.youtube.com/embed/NAqU1p5hLz0?controls=0',
	},
	SMS: {
		title: 'How to send sms?',
		titleShort: 'SMS Service',
		link: 'https://www.youtube.com/embed/0NdzVoYSKEM?controls=0',
	},
	CLASS: {
		title: 'How to manage class?',
		titleShort: '',
		link: '',
	},
	SETTINGS: {
		title: 'How to configure settings?',
		titleShort: 'Manage Settings',
		link: 'https://www.youtube-nocookie.com/embed/XTVruJ8ES7I?controls=0',
	},
	HELP: {
		title: '',
		titleShort: '',
		link: '',
	},
	'CERTIFICATE-MENU': {
		title: '',
		titleShort: '',
		link: '',
	},
	FAMILIES: {
		title: '',
		titleShort: '',
		link: '',
	},
	ATTENDANCE: {
		title: 'How to manage student attendance?',
		titleShort: 'Student Attendance',
		link: 'https://www.youtube.com/embed/QRhHYU2jTt8?controls=0',
	},
	'TEACHER-ATTENDANCE': {
		title: '',
		titleShort: '',
		link: '',
	},
	DIARY: {
		title: '',
		titleShort: '',
		link: '',
	},
	REPORTS: {
		title: 'How to manage exams and tests?',
		titleShort: 'Manage Exams & Tests',
		link: 'https://www.youtube-nocookie.com/embed/h5zBuyQeW2w?controls=0',
	},
	'REPORTS-MENU': {
		title: 'How to manage result cards?',
		titleShort: 'Manage Result Card',
		link: 'https://www.youtube-nocookie.com/embed/jy4zYo74nQk?controls=0',
	},
	'FEE-MENU': {
		title: 'How to manage student fees?',
		titleShort: 'Manage Student Fees',
		link: 'https://www.youtube-nocookie.com/embed/8zyh6Z_Wl-U?controls=0',
	},
	FEES: {
		title: '',
		titleShort: 'Manage Student Fees',
		link: 'https://www.youtube-nocookie.com/embed/8zyh6Z_Wl-U?controls=0',
	},
	DATESHEET: {
		title: '',
		titleShort: '',
		link: '',
	},
	ANALYTICS: {
		title: '',
		titleShort: '',
		link: '',
	},
	EXPENSE: {
		title: '',
		titleShort: '',
		link: '',
	},
}

export const IlmxTutorialLinks: TutorialLink = {
	DEFAULT: {
		title: 'Brief Introduction to MISchool',
		titleShort: 'Introduction to MISchool',
		link: 'https://www.youtube.com/embed/GjF_oWI1Afg',
	},
	CLASS: {
		title: 'How to setup classes?',
		titleShort: 'Setup student Classes',
		link: 'https://www.youtube.com/embed/lUXYg3LLEq8',
	},
	'SETTINGS-EXCEL-IMPORT-STUDENTS': {
		title: 'How to enter students list classwise through CSV file?',
		titleShort: 'Import Students through CSV',
		link: 'https://www.youtube.com/embed/whkNkdGZVUk',
	},
	STUDENT: {
		title: 'How to create student profile?',
		titleShort: 'Create Student Profile',
		link: 'https://www.youtube.com/embed/lsjK4fCif5c',
	},
	TEACHER: {
		title: 'How to create teacher profile?',
		titleShort: 'Create Teacher Profile',
		link: 'https://www.youtube.com/embed/gi_W4d1sBvk',
	},
	'SMS-APP': {
		title: 'How to download and install Android SMS app in mobile?',
		titleShort: 'Download and Install SMS App',
		link: 'https://youtube.com/embed/UtW-lqaY9rc',
	},
	SMS: {
		title: 'How to share Student Portal Link with students through SMS?',
		titleShort: 'Share Student Portal Link',
		link: 'https://www.youtube.com/embed/HO-nMR8BYhc',
	},
	DIARY: {
		title: 'How to send Daily Diary to students?',
		titleShort: 'Send Daily Diary',
		link: 'https://www.youtube.com/embed/x4YrwS2fkxE',
	},
	'ANALYTICS-ILMEXCHANGE': {
		title: 'How to analyze the analytics about learning videos?',
		titleShort: 'Learning about Video Analytics',
		link: 'https://www.youtube.com/embed/nvEs6aym7ps',
	},
}

export const getLinkForPath = (pathname: string) => {
	const path = pathname.split('/')[1].toUpperCase()

	const title =
		MISTutorialLinks[path] && MISTutorialLinks[path].titleShort
			? MISTutorialLinks[path].titleShort
			: MISTutorialLinks['DEFAULT'].titleShort
	const link =
		MISTutorialLinks[path] && MISTutorialLinks[path].link
			? MISTutorialLinks[path].link
			: MISTutorialLinks['DEFAULT'].link

	return { title, link }
}

export const getIlmxLinkForPath = (pathname: string) => {
	let path = pathname.split('/').filter(Boolean).join('-').toUpperCase()

	if (path.includes('FACULTY')) {
		path = 'TEACHER'
	}

	if (path.includes('CLASS') && (path.includes('NEW') || path.includes('PROFILE'))) {
		path = 'CLASS'
	}

	if (path.includes('STUDENT') && (path.includes('NEW') || path.includes('PROFILE'))) {
		path = 'STUDENT'
	}

	const title =
		IlmxTutorialLinks[path] && IlmxTutorialLinks[path].titleShort
			? IlmxTutorialLinks[path].titleShort
			: IlmxTutorialLinks['DEFAULT'].titleShort
	const link =
		IlmxTutorialLinks[path] && IlmxTutorialLinks[path].link
			? IlmxTutorialLinks[path].link
			: IlmxTutorialLinks['DEFAULT'].link

	return { title, link }
}

interface TutorialType {
	(type: 'ILMX' | 'MIS'): TutorialLink
}
export const getTutorialLinks: TutorialType = (type) =>
	type === 'ILMX' ? IlmxTutorialLinks : MISTutorialLinks
