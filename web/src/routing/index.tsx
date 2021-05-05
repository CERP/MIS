import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Store } from 'redux'
import { AppError } from 'components/error'

import AutoLogin from 'modules/Login/autoLogin'

import Marks from 'modules/Marks'
import ExamList from 'modules/Marks/ExamList'
import SingleExam from 'modules/Marks/SingleExam'
import DailyStats from 'modules/Analytics/DailyStats'
import Analytics from 'modules/Analytics'
import ReportsMenu from 'modules/ReportsMenu'
import TargetedInstruction from 'modules/TIP/Routing'
import Help from 'modules/Help'
import Diary from 'pages/school/diary'
import FeeMenu from 'modules/FeeMenu'
import PlannerList from 'modules/Planner/ClassList'
import Planner from 'modules/Planner'
import CertificateMenu from 'modules/CertificateMenu'
import HistoricalFee from '../modules/Settings/HistoricalFees/historical-fee'
import ManageFees from 'modules/Student/ManageFees'
import ResetPassword from 'modules/Password/index'
import PrintPreview from 'modules/Student/Single/Fees/printPreview'
import ExpensePage from '../modules/Expenses'
import MISActivation from 'modules/Activation'
import BulkExam from 'modules/Marks/BulkExam'

import { Home } from 'pages/home'
import { StaffList } from 'pages/staff/list'
import { CreateOrUpdateStaff } from 'pages/staff/create'
import { Landing } from 'pages/landing'
import { ContactUs } from 'pages/contact-us'
import { Feature } from 'pages/features'
import { AboutUs } from 'pages/about-us'
import { Pricing } from 'pages/pricing'
import { SchoolLogin, StaffLogin } from 'pages/auth/login'
import { SchoolSignup } from 'pages/auth/signup'
import { SchoolSetup } from 'pages/setup'
import { SchoolOnboarding } from 'pages/onboarding'
import { ClassList } from 'pages/class/list'
import { CreateOrUpdateClass } from 'pages/class/create'

import { StudentList } from 'pages/students/list'
import { CreateOrUpdateStudent } from 'pages/students/add'
import { AddStudentMenu } from 'pages/students/add/menu'
import { ImportStudentsCSV } from 'pages/students/add/excel-import'
import { SchoolAttendance } from 'pages/school/attendance'
import { SchoolFees } from 'pages/school/fees'
import { StudentPayments } from 'pages/students/fee-payments/payments'
import { Family } from 'pages/family/list'
import { SingleFamily } from 'pages/family/single'
import { SingleFamilyPayments } from 'pages/family/single/payments'
import { SMS } from 'pages/sms'
import { Settings } from 'pages/school/settings'
import { ResetSchoolPassword } from 'pages/auth/reset-password/school'

import { PrivateRoute, SchoolRoute, PublicRoute } from 'components/routing'
import { ExamsMenu } from 'pages/exams/menu'
import { GradeSettings } from 'pages/exams/grades'
import { PromoteStudents } from 'pages/exams/promote-students'
import { Datesheet } from 'pages/exams/datesheet'
import { ExamsMarks } from 'pages/exams/marks'
import { ExamsResults } from 'pages/exams/results'
import { Events } from 'pages/about-us/events'

interface RoutesProps {
	store: Store<RootReducerState>
}

interface State {
	error?: {
		err: Error
		errInfo: React.ErrorInfo
	}
}

export class Routes extends React.Component<RoutesProps, State> {
	state: State = {
		error: undefined
	}

	componentDidCatch(err: Error, errInfo: React.ErrorInfo) {
		this.setState({
			error: {
				err,
				errInfo
			}
		})
	}

	render() {
		if (this.state.error) {
			return <AppError error={this.state.error.err} errInfo={this.state.error.errInfo} />
		}

		return (
			<Provider store={this.props.store}>
				<BrowserRouter>
					<Switch>
						<PrivateRoute exact path="/home" component={Home} />
						<PrivateRoute path="/staff/new" exact component={CreateOrUpdateStaff} />
						<PrivateRoute
							path="/staff/:id/profile"
							exact
							component={CreateOrUpdateStaff}
						/>
						<PrivateRoute path="/staff" exact component={StaffList} />
						<PrivateRoute path="/students/new/menu" exact component={AddStudentMenu} />
						<PrivateRoute
							path="/students/excel-import"
							exact
							component={ImportStudentsCSV}
						/>
						<PrivateRoute
							path="/students/:id/profile"
							exact
							component={CreateOrUpdateStudent}
						/>
						<PrivateRoute
							path="/students/:id/payments"
							exact
							component={StudentPayments}
						/>
						<PrivateRoute
							path="/students/new"
							exact
							component={CreateOrUpdateStudent}
						/>
						<PrivateRoute path="/students" exact component={StudentList} />
						<PrivateRoute
							path="/classes/:id/view"
							exact
							component={CreateOrUpdateClass}
						/>
						<PrivateRoute path="/classes/new" exact component={CreateOrUpdateClass} />
						<PrivateRoute path="/classes" exact component={ClassList} />
						<PrivateRoute path="/attendance" exact component={SchoolAttendance} />
						<PrivateRoute path="/fees" exact component={SchoolFees} />
						<PrivateRoute path="/fees/:page" exact component={SchoolFees} />

						<PrivateRoute path="/sms" component={SMS} />

						<PrivateRoute exact path="/reports/bulk-exams" component={BulkExam} />
						<PrivateRoute
							path="/reports/:class_id/:section_id/new"
							component={SingleExam}
						/>
						<PrivateRoute
							path="/reports/:class_id/:section_id/exam/:exam_id"
							component={SingleExam}
						/>
						<PrivateRoute path="/exams/grades" component={GradeSettings} />
						<PrivateRoute path="/exams/promote-students" component={PromoteStudents} />
						<PrivateRoute path="/exams/datesheet" component={Datesheet} />
						<PrivateRoute path="/exams/marks" component={ExamsMarks} />
						<PrivateRoute path="/exams/results" component={ExamsResults} />
						<PrivateRoute path="/exams" component={ExamsMenu} />

						<PrivateRoute path="/reports/:class_id/:section_id" component={ExamList} />
						<PrivateRoute path="/reports" component={Marks} />
						<PrivateRoute path="/settings" component={Settings} />
						<PrivateRoute path="/diary" component={Diary} />
						<PrivateRoute path="/analytics/daily-stats" component={DailyStats} />
						<PrivateRoute path="/analytics" component={Analytics} />
						<PrivateRoute path="/diary" component={Diary} />
						<PrivateRoute path="/reports-menu" component={ReportsMenu} />
						<PrivateRoute path="/expenses" component={ExpensePage} />
						<PrivateRoute
							exact
							path="/families/:famId/fee-print-preview"
							component={PrintPreview}
						/>
						<PrivateRoute
							exact
							path="/families/:id/payments"
							component={SingleFamilyPayments}
						/>
						<PrivateRoute exact path="/families/:id" component={SingleFamily} />
						<PrivateRoute exact path="/families" component={Family} />
						<PrivateRoute exact path="/families/new" component={SingleFamily} />
						<PrivateRoute path="/ClassList" component={PlannerList} />
						<PrivateRoute path="/planner/:class_id/:section_id" component={Planner} />
						<PrivateRoute path="/help" component={Help} />
						<PrivateRoute path="/certificate-menu" component={CertificateMenu} />
						<PrivateRoute path="/fees/manage" component={ManageFees} />
						<PrivateRoute path="/fees/add-historical-fee" component={HistoricalFee} />
						<PrivateRoute path="/fee-menu" component={FeeMenu} />
						<PrivateRoute path="/reset-password" component={ResetPassword} />

						<PublicRoute exact path="/signup" component={SchoolSignup} />
						<PublicRoute path="/school-login" component={SchoolLogin} />
						<PublicRoute
							path="/school/reset-password"
							component={ResetSchoolPassword}
						/>
						<SchoolRoute path="/staff-login" component={StaffLogin} />
						<SchoolRoute exact path="/setup" component={SchoolSetup} />

						<Route exact path="/" component={Landing} />
						<Route path="/targeted-instruction" component={TargetedInstruction} />
						<Route path="/verify-code" component={MISActivation} />
						<Route exact path="/onboarding" component={SchoolOnboarding} />
						<Route path="/auto-login" component={AutoLogin} />
						<Route exact path="/pricing" component={Pricing} />
						<Route exact path="/about-us" component={AboutUs} />
						<Route exact path="/events" component={Events} />
						<Route exact path="/features" component={Feature} />
						<Route exact path="/contact-us" component={ContactUs} />
					</Switch>
				</BrowserRouter>
			</Provider>
		)
	}
}
