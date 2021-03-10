import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'

import ErrorComponent from 'components/Error'

// import Home from 'modules/Landing'
// import TeacherList from 'modules/Teacher/List'
// import TeacherSingle from 'modules/Teacher/Single'
// import StudentList from 'modules/Student/List'
// import StudentSingle from 'modules/Student/Single'
// import Login from 'modules/Login'
import AutoLogin from 'modules/Login/autoLogin'
// import SchoolLogin from 'modules/Login/school'
// import ClassModule from 'modules/Class/List'
// import ClassSingle from 'modules/Class/Single'
// import Attendance from 'modules/Attendance'
// import TeacherAttendance from 'modules/Teacher-Attendance'

import SMS from 'modules/SMS'
import Marks from 'modules/Marks'
import ExamList from 'modules/Marks/ExamList'
import SingleExam from 'modules/Marks/SingleExam'
import Settings from 'modules/Settings'
import DailyStats from 'modules/Analytics/DailyStats'
import Analytics from 'modules/Analytics'
import ReportsMenu from 'modules/ReportsMenu'
import PromotionPage from 'modules/Settings/promote-students'
import TargetedInstruction from 'modules/TIP/Routing'
import Help from "modules/Help"
import Diary from 'modules/Diary'
// import Front from 'modules/Front'
import FeeMenu from 'modules/FeeMenu'
import PlannerList from 'modules/Planner/ClassList'
import Planner from 'modules/Planner'
import CertificateMenu from 'modules/CertificateMenu'
import HistoricalFee from '../modules/Settings/HistoricalFees/historical-fee';
import FamilyModule from '../modules/Family'
import SingleFamily from '../modules/Family/Single'
import StudentFees from '../modules/Student/Single/Fees/index'
import ManageFees from 'modules/Student/ManageFees'
import ResetPassword from 'modules/Password/index'
import TrackedRoute from 'components/TrackedRoute'
import PrintPreview from 'modules/Student/Single/Fees/printPreview'
import ExpensePage from '../modules/Expenses';
import ExcelImport from '../modules/Settings/ExcelImport';
import ClassSettings from 'modules/Settings/ClassSettings/Index'
import MISActivation from 'modules/Activation'
import BulkExam from 'modules/Marks/BulkExam'
import { Home } from 'pages/home'
import { StaffList } from 'pages/staff/list'
import { CreateOrUpdateStaff } from 'pages/staff/create'
import { Landing } from 'pages/landing'
import { Contact } from 'pages/contact'
import { Feature } from 'pages/features'
import { About } from 'pages/about'
import { Pricing } from 'pages/pricing'
import { SchoolLogin, StaffLogin } from 'pages/auth/login'
import { SchoolSignup } from 'pages/auth/signup'
import { SchoolSetup } from 'pages/setup'
import { SchoolOnboarding } from 'pages/onboarding'
import { ClassList } from 'pages/class/list'
import { CreateOrUpdateClass } from 'pages/class/create'

import { StudentList } from 'pages/students/list'
import { CreateOrUpdateStudent } from 'pages/students/add/create'
import { AddStudentSelect } from 'pages/students/add'
import { ImportStudentsCSV } from 'pages/students/add/importExcel'
import { StudentsAttendance } from 'pages/students/attendance'
import { StaffAttendance } from 'pages/staff/attendance'
import { SchoolAttendance } from 'pages/school/attendance'
import { SchoolFees } from 'pages/school/fees'

export default class Routes extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			error: false,
			err: false,
			errInfo: false
		}
	}

	componentDidCatch(err, errinfo) {
		console.error("component did catch: ", err)
		this.setState({
			error: true,
			err,
			errInfo: errinfo
		})
	}

	render() {

		if (this.state.error) {
			return <ErrorComponent err={this.state.err} errInfo={this.state.errInfo} />
		}

		return <Provider store={this.props.store}>
			<BrowserRouter>
				<Switch>
					<TrackedRoute exact path="/home" component={Home} />

					<TrackedRoute path="/staff/new" exact component={CreateOrUpdateStaff} />
					<TrackedRoute path="/staff/:id/profile" exact component={CreateOrUpdateStaff} />
					<TrackedRoute path="/staff" exact component={StaffList} />
					<TrackedRoute path="/staff/attendance" exact component={StaffAttendance} />

					<TrackedRoute path="/students/attendance" exact component={StudentsAttendance} />
					<TrackedRoute path="/students/add-selection" exact component={AddStudentSelect} />
					<TrackedRoute path="/students/excel-import" exact component={ImportStudentsCSV} />
					<TrackedRoute path="/students/:id/profile" exact component={CreateOrUpdateStudent} />
					<TrackedRoute path="/students/new" exact component={CreateOrUpdateStudent} />
					<TrackedRoute path="/students" exact component={StudentList} />

					<TrackedRoute path="/classes/:id/view" exact component={CreateOrUpdateClass} />
					<TrackedRoute path="/classes/new" exact component={CreateOrUpdateClass} />
					<TrackedRoute path="/classes" exact component={ClassList} />

					<TrackedRoute path="/school/attendance" exact component={SchoolAttendance} />
					<TrackedRoute path="/school/fees" exact component={SchoolFees} />
					<TrackedRoute path="/school/fees/:page" exact component={SchoolFees} />


					<TrackedRoute path="/sms" component={SMS} />

					<TrackedRoute exact path="/reports/bulk-exams" component={BulkExam} />
					<TrackedRoute path="/reports/:class_id/:section_id/new" component={SingleExam} />
					<TrackedRoute path="/reports/:class_id/:section_id/exam/:exam_id" component={SingleExam} />
					<TrackedRoute path="/reports/:class_id/:section_id" component={ExamList} />
					<TrackedRoute path="/reports" component={Marks} />

					<TrackedRoute path="/settings/excel-import" component={ExcelImport} />
					<TrackedRoute path="/settings/promote" component={PromotionPage} />
					<TrackedRoute path="/settings/class" component={ClassSettings} />
					<TrackedRoute path="/settings" component={Settings} />
					<TrackedRoute path="/analytics/daily-stats" component={DailyStats} />
					<TrackedRoute path="/analytics" component={Analytics} />
					<TrackedRoute path="/diary" component={Diary} />

					<TrackedRoute path="/reports-menu" component={ReportsMenu} />
					<TrackedRoute path="/expenses" component={ExpensePage} />
					<TrackedRoute path="/targeted-instruction" component={TargetedInstruction} />

					<TrackedRoute exact path="/families/:famId/fee-print-preview" component={PrintPreview} />
					<TrackedRoute path="/families/:famId/payments" component={StudentFees} />
					<TrackedRoute path="/families/:id" component={SingleFamily} />
					<TrackedRoute path="/families" component={FamilyModule} />

					<TrackedRoute path="/ClassList" component={PlannerList} />
					<TrackedRoute path="/planner/:class_id/:section_id" component={Planner} />

					<TrackedRoute path="/help" component={Help} />
					<TrackedRoute path="/certificate-menu" component={CertificateMenu} />
					<TrackedRoute path="/fees/manage" component={ManageFees} />
					<TrackedRoute path="/fees/add-historical-fee" component={HistoricalFee} />
					<TrackedRoute path="/fee-menu" component={FeeMenu} />
					<TrackedRoute path="/reset-password" component={ResetPassword} />
					<Route path="/verify-code" component={MISActivation} />
					<Route exact path="/" component={Landing} />

					<Route path="/school-login" component={SchoolLogin} />
					<Route path="/staff-login" component={StaffLogin} />
					<Route exact path="/signup" component={SchoolSignup} />
					<Route exact path="/school/setup" component={SchoolSetup} />
					<Route exact path="/school/onboarding" component={SchoolOnboarding} />
					<Route path="/auto-login" component={AutoLogin} />
					<TrackedRoute path="/targeted-instruction" component={TargetedInstruction} />

					<Route exact path="/pricing" component={Pricing} />
					<Route exact path="/about-us" component={About} />
					<Route exact path="/features" component={Feature} />
					<Route exact path="/contact-us" component={Contact} />

				</Switch>
			</BrowserRouter>
		</Provider>
	}
}
