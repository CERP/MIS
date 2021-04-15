interface RootDBState {
	faculty: {
		[id: string]: MISTeacher
	}
	users: {
		[id: string]: MISUser
	}
	students: {
		[id: string]: MISStudent
	}
	classes: {
		[id: string]: MISClass
	}
	sms_templates: {
		attendance: string
		fee: string
		result: string
	}
	exams: {
		[id: string]: MISExam
	}
	settings: MISSettings
	expenses: {
		[id: string]: MISExpense | MISSalaryExpense
	}
	analytics: {
		sms_history: {
			[id: string]: MISSMSHistory
		}
	}
	assets: {
		schoolLogo: string
	}
	max_limit: number
	package_info: MISPackage
	diary: MISDiary
	planner: {
		// Will be able to add more planner stuff here i.e Teacher/Class shedule e.t.c
		datesheet: {
			[section_id: string]: {
				[id: string]: MISDateSheet
			}
		}
	}

	ilmx: {
		events: {
			[device_id: string]: {
				[timestamp: string]: IlmxVideoEvent | IlmxExamEvent
			}
		}
		lessons: {
			[lesson_id: string]: IlmxLesson
		}
	}
	targeted_instruction_access?: boolean
}

/**
 * TIP Types
 */

type TIPGrades = '1' | '2' | '3' | 'KG' | 'Oral Test' | 'Not Needed' | 'Not Graded'
type TIPLearningGroups =
	| 'Blue'
	| 'Yellow'
	| 'Green'
	| 'Orange'
	| 'Oral'
	| 'Remediation Not Needed'
	| 'Not Graded'
type TIPLevels = 'Level KG' | 'Level 1' | 'Level 2' | 'Level 3' | 'Oral' | 'Remediation Not Needed'
type TIPSubjects = 'Maths' | 'Urdu' | 'English'

type TIPCurriculum = {
	[learning_level in TIPLevels]: {
		[subject: string]: TIPLessonPlans
	}
}

// This is the TIP curriculum which lives inside the
// MISTeacher object.
type TIPTeacherCurriculum = {
	[learning_level in TIPLevels]: {
		[subject: string]: TIPTeacherLessonPlans
	}
}

interface TIPTeacherLessonPlans {
	[lesson_id: string]: TIPTeacherLesson
}

interface TIPTeacherQuizzes {
	[quiz_id: string]: TIPTeacherQuiz
}
interface TIPLessonPlans {
	[lesson_id: string]: TIPLesson
}

interface TIPLesson {
	lesson_number: string
	lesson_title: string
	lesson_link: string
	material_names: string[]
	subject: string
	lesson_duration: string
	material_links: string
	activity_links: string
	teaching_manual_link: string
}

type TIPTeacherLesson = { taken: boolean }

type TIPTeacherQuiz = { taken: boolean }
interface TIPTests {
	[id: string]: TIPTest
}

interface TIPQuizzes {
	[id: string]: TIPQuiz
}

type TIPTestType = 'Diagnostic' | 'Formative' | 'Summative' | 'Oral' | 'Quiz'

interface BaseTest {
	name: string
	subject: string
	grade: string
	type: TIPTestType
	label: string
	pdf_url: string
	answer_pdf_url: string
}
interface TIPTest extends BaseTest {
	questions: {
		[question_id: string]: TIPQuestion
	}
}

interface TIPQuiz extends BaseTest {
	quiz_title: string
	quiz_order: number
	total_marks: number
	slo_category: string
	slo: string[]
}

interface SingleSloQuizResult {
	[std_id: string]: {
		std_name: string
		std_roll_num: string
		quiz_marks: number
		midpoint_test_marks: number
	}
}
interface TIPQuestion {
	question_text: string
	answer: string
	grade: TIPGrades
	slo_category: string
	slo: string[]
}

type TIPGradedQuestion = TIPQuestion & {
	is_correct: boolean
}

// Too generic, bad name
// are we still using this?
interface SLOBasedResult {
	[std_id: string]: {
		std_name: string
		obtain: number
		total: number
		slo_obj: SloObj
	}
}

interface SloObj {
	[slo_name: string]: {
		obtain: number
		total: number
	}
}

// Am not sure what this is supposed to be for...
type DiagnosticRes = {
	[level in TIPGrades]: {
		students: {
			[student_id: string]: MISStudent
		}
	}
}

type TIPDiagnosticReport = {
	checked?: boolean
	type: TIPTestType
	questions?: {
		[question_id: string]: TIPGradedQuestion
	}
}

type TIPQuizReport = {
	obtain_marks: number
}

type Levels = {
	[level: string]: number
}

interface SLOMapping {
	[slo_id: string]: {
		description: string
		category: string
		link: string
	}
}

// TODO: way too generic of a name to keep in the typings file
interface Params {
	class_name: TIPLevels
	subject: TIPSubjects
	section_id: string
	std_id: string
	test_id?: string
	quiz_id?: string
	lesson_number: string
}
/**
 * END TIP Section
 */

interface BaseAnalyticsEvent {
	type: string
	meta: any
}
interface RouteAnalyticsEvent extends BaseAnalyticsEvent {
	type: 'ROUTE'
	time: number
	meta: { route: string }
}

type QueueStatus = 'queued' | 'processing' | 'failed'

interface ImageMergeItem {
	id: string
	image_string: string
	path: string[]
}

interface ImagesQueuable {
	[path: string]: ImageMergeItem & { status: QueueStatus }
}

interface RootReducerState {
	client_id: string
	initialized: boolean
	queued: {
		mutations: {
			[path: string]: {
				action: {
					path: string[]
					value?: any
					type: 'MERGE' | 'DELETE'
				}
				date: number
			}
		}
		analytics: {
			[id: string]: RouteAnalyticsEvent
		}
		images: ImagesQueuable
	}
	acceptSnapshot: boolean
	lastSnapshot: number
	processing_images: boolean
	db: RootDBState
	auth: {
		school_id: string
		faculty_id: string
		token: string
		username: string
		name: string
		attempt_failed: boolean
		loading: boolean
	}
	connected: boolean
	alert_banner: string
	sign_up_form: {
		loading: boolean
		succeed: boolean
		reason: string
	}
	ilmxLessons: {
		isLoading: boolean
		hasError: boolean
	}
	targeted_instruction: {
		quizzes: TIPQuizzes
		tests: TIPTests
		slo_mapping: SLOMapping
		curriculum: TIPCurriculum
	}
}

interface MISSMSHistory {
	date: number
	type: string
	count: number
}

interface MISSettings {
	shareData: boolean
	schoolName: string
	schoolAddress: string
	schoolPhoneNumber: string
	schoolSession: {
		start_date: number
		end_date: number
	}
	schoolCode: string
	vouchersPerPage: string
	sendSMSOption: 'SIM' | 'API'
	devices: {
		[client_id: string]: string
	}
	exams: {
		grades: {
			[grade: string]: {
				percent: string
				remarks: string
			}
		}
	}
	classes: {
		defaultFee: {
			[class_id: string]: MISStudentFee
		}
		feeVoucher?: {
			dueDays: string
			feeFine: string
			notice: string
			bankInfo: {
				name: string
				accountTitle: string
				accountNo: string
			}
			options?: {
				showDueDays: boolean
				showFine: boolean
				showNotice: boolean
				showBankInfo: boolean
			}
		}
	}
}

interface MISUser {
	name: string
	password: string
	type: 'admin' | 'teacher'
	hasLogin: boolean
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

interface AugmentedSection {
	id: string
	class_id: string
	namespaced_name: string
	className: string
	classYear: number
	name: string
	faculty_id?: string
}

interface MISStudent {
	id: string
	Name: string
	RollNumber: string
	BForm: string
	Gender: string
	Phone: string
	AlternatePhone?: string
	Fee: number
	Active: boolean

	ProfilePicture?: {
		id?: string
		url?: string
		image_string?: string
	}

	ManCNIC: string
	ManName: string
	Birthdate: string
	Address: string
	Notes: string
	StartDate: number
	AdmissionNumber: string
	BloodType?: '' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
	FamilyID?: string
	Religion?: string
	section_id: string
	prospective_section_id?: string

	fees: {
		[id: string]: MISStudentFee
	}
	payments: {
		[id: string]: MISStudentPayment
	}
	attendance: {
		[date: string]: MISStudentAttendanceEntry
	}
	exams: {
		[id: string]: MISStudentExam
	}
	tags: { [tag: string]: boolean }
	certificates: {
		[id: string]: MISCertificate
	}
	targeted_instruction: {
		results: {
			[test_id: string]: TIPDiagnosticReport
		}
		quiz_result: {
			[quiz_id: string]: TIPQuizReport
		}
		learning_level: {
			[subject: string]: {
				grade: TIPGrades
			}
		}
	}
}

type Report = {
	[stdId: string]: {
		name: string
		report: MISReport
	}
}

type MISReport = {
	[name: string]: {
		correct: number
		possible: number
		link?: string
	}
}

interface MISFamilyInfo {
	ManName: string
	Phone: string
	ManCNIC: string
	Address?: string
	AlternatePhone?: string
	children?: AugmentedSibling[]
}

type AugmentedSibling = MISStudent & { section?: AugmentedSection }

type AugmentedMISFamily = MISFamilyInfo & { ID: string }

interface MISCertificate {
	type: string
	faculty_id: string
	date: number
}

interface MISExam {
	id: string
	name: string
	subject: string
	total_score: number
	date: number
	class_id: string
	section_id: string
}

interface MISStudentExam {
	score: number
	grade: string
	remarks: string
}

interface MISStudentFee {
	name: string
	type: 'FEE' | 'SCHOLARSHIP' | ''
	amount: string
	period: 'MONTHLY' | 'SINGLE' | ''
}

interface MISStudentPayment {
	amount: number
	date: number
	type: 'SUBMITTED' | 'FORGIVEN' | 'OWED'
	fee_id?: string
	fee_name?: string
}

type AugmentedMISPayment = MISStudentPayment & { student_id: string; edited?: boolean }

interface AugmentedMISPaymentMap {
	[pid: string]: AugmentedMISPayment
}

interface BaseMISExpense {
	expense: string
	amount: number
	label: string
	type: string
	category:
		| 'SALARY'
		| 'BILLS'
		| 'STATIONERY'
		| 'REPAIRS'
		| 'RENT'
		| 'ACTIVITY'
		| 'DAILY'
		| 'PETTY_CASH'
		| 'OTHER'
		| ''
		| string
	date: number
	time: number
}

interface MISExpense extends BaseMISExpense {
	expense: 'MIS_EXPENSE'
	type: 'PAYMENT_GIVEN'
	quantity: number
}

interface MISSalaryExpense extends BaseMISExpense {
	expense: 'SALARY_EXPENSE'
	type: 'PAYMENT_DUE' | 'PAYMENT_GIVEN'
	faculty_id: string
	category: 'SALARY'
	advance: number
	deduction: number
	deduction_reason: string
}

interface MISStudentAttendanceEntry {
	date: string
	status: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'SHORT_LEAVE' | 'SICK_LEAVE' | 'CASUAL_LEAVE'
	time: number
}

interface MISTeacher {
	id: string
	Name: string
	CNIC: string
	Gender: string
	Username: string
	Password: string
	Married: boolean
	Phone: string
	Salary: string
	Active: boolean

	ManCNIC: string
	ManName: string
	Birthdate: string
	Address: string
	StructuredQualification: string
	Qualification: string
	Experience: string
	HireDate: string
	Admin: boolean
	HasLogin: boolean
	tags: { [tag: string]: boolean }
	attendance: MISTeacherAttendance
	permissions: {
		fee: boolean
		dailyStats: boolean
		setupPage: boolean
		expense: boolean
		family: boolean
		prospective: boolean
	}
	targeted_instruction: {
		curriculum: TIPTeacherCurriculum
		quizzes: TIPTeacherQuizzes
	}
}

type MISTeacherAttendanceStatus = 'check_in' | 'check_out' | 'absent' | 'leave' | ''

interface MISTeacherAttendance {
	[date: string]: {
		[status in MISTeacherAttendanceStatus]: number
	}
}

interface MISSms {
	text: string
	number: string
}

interface MISSmsPayload {
	messages: MISSms[]
	return_link: string
}

interface MISDiary {
	[date: string]: {
		[section_id: string]: {
			[subject: string]: {
				homework: string
			}
		}
	}
}
interface MISDateSheet {
	[subject: string]: {
		date: number
		time: string
	}
}

type AugmentedMISExam = MISExam & { stats: MISStudentExam }
interface StudentMarksSheet {
	id: MISStudent['id']
	name: MISStudent['Name']
	manName: MISStudent['ManName']
	rollNo: MISStudent['RollNumber']
	section_id?: MISStudent['section_id']
	marks?: { total: number; obtained: number }
	position?: number
	merge_exams?: AugmentedMISExam[]
	grade: string
	remarks?: string
}

type MergeStudentsExams = MISStudent & { merge_exams: AugmentedMISExam[] }
interface ExamFilter {
	month?: string
	year: string
	subject?: string
	exam_title: string
}
type AugmentedStudent = {
	section?: AugmentedSection
	forwardTo?: string
} & MISStudent

type MISGrades = RootDBState['settings']['exams']['grades']
type AugmentedStudent = {
	section?: AugmentedSection
	forwardTo?: string
} & MISStudent

type MISGrades = RootDBState['settings']['exams']['grades']

interface MISPackage {
	date: number
	trial_period: number
	paid: boolean
}
interface BaseIlmxEvent {
	type: string
}
interface IlmxVideoEvent {
	type: 'VIDEO'
	lesson_id: string
	student_id: string
	duration: number
}

interface IlmxExamEvent {
	type: 'ASSESSMENT'
	student_id: string
	score: number
	total_score: number
	date: number
	meta: {
		medium: string
		subject: string
		chapter_id: string
		lesson_id: string
		excercise_id: string
		total_duration: number
		attempted_in: number
		wrong_responses: {
			[question_id: string]: string
		}
	}
}

interface IlmxLessonVideos {
	[id: string]: IlmxLesson
}

interface IlmxLesson {
	name: string
	type: 'Video' | ''
	link: string
	chapter_name: string
}

type AugmentedIlmxLesson = {
	watchCount: number
	watchTime: number
	viewers: {
		[id: string]: {
			watchCount: number
			watchTime: number
		}
	}
} & IlmxLesson

type MISGrades = RootDBState['settings']['exams']['grades']

interface MISBanner {
	active: boolean
	good?: boolean
	text?: string
}

interface ExamScoreSheet {
	[studentId: string]: MISStudent & {
		scoreSheetExams: {
			[examId: string]: { edited: boolean } & AugmentedMISExam
		}
	}
}
type AugmentedSmsHistory = {
	faculty?: string
	text?: string
} & MISSMSHistory
