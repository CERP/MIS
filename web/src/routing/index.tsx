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
import ResetPassword from 'modules/Password/index'
import MISActivation from 'modules/Activation'
import BulkExam from 'modules/Marks/BulkExam'

import { Home } from 'pages/home'
import { StaffList } from 'pages/staff/list'
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
import { AddStudentMenu } from 'pages/students/add/menu'
import { ImportStudentsCSV } from 'pages/students/add/excel-import'
import { SchoolAttendance } from 'pages/school/attendance'
import { SchoolFees } from 'pages/school/fees'
import { Family } from 'pages/family/list'
import { SingleFamily } from 'pages/family/single'
import { SingleFamilyPayments } from 'pages/family/single/payments'
import { SMS } from 'pages/sms'
import { SMSTemplates } from 'pages/sms/templates'

import { Settings } from 'pages/school/settings'
import { ResetSchoolPassword } from 'pages/auth/reset-password/school'

import { PrivateRoute, SchoolRoute, PublicRoute } from 'components/routing'
import { Expense } from 'pages/expense'
import { ExpenseForm } from 'pages/expense/form'
import { StaffSalary } from 'pages/expense/salary'
import { GradeSettings } from 'pages/exams/grades'
import { PromoteStudents } from 'pages/exams/promote-students'
import { Datesheet } from 'pages/exams/datesheet'
import { ExamsMarks } from 'pages/exams/marks'
import { ExamsResults } from 'pages/exams/results'
import { Events } from 'pages/about-us/events'
import StudentPage from 'pages/students'
import StaffPage from 'pages/staff'
import PrintPreview from 'pages/school/fees/print-voucher/preview'
import ClassFeeMenu from 'modules/Class/Single/ClassFeeMenu'
import SingleClassResults from 'modules/Class/Single/ReportsMenu'
import { PageNotFound } from 'pages/http_error/404'
import { TermsOfService } from 'pages/terms/tos'

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
						<PrivateRoute path="/staff" exact component={StaffList} />
						<PrivateRoute path="/staff/salaries" exact component={StaffSalary} />
						<PrivateRoute path="/staff/:id" component={StaffPage} />
						<PrivateRoute path="/students/new/menu" exact component={AddStudentMenu} />
						<PrivateRoute
							path="/students/excel-import"
							exact
							component={ImportStudentsCSV}
						/>
						<PrivateRoute path="/students/:id" component={StudentPage} />
						<PrivateRoute path="/students" exact component={StudentList} />
						<PrivateRoute
							path="/classes/:id/print-voucher/preview"
							exact
							component={ClassFeeMenu}
						/>
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

						<PrivateRoute path="/sms/templates" component={SMSTemplates} />
						<PrivateRoute path="/sms" component={SMS} />

						<PrivateRoute exact path="/reports/bulk-exams" component={BulkExam} />
						<PrivateRoute
							exact
							path="/reports/:class_id/:section_id/new"
							component={SingleExam}
						/>
						<PrivateRoute
							exact
							path="/reports/:class_id/:section_id/exam/:exam_id"
							component={SingleExam}
						/>
						<PrivateRoute
							exact
							path="/reports/:class_id/:section_id/report-menu"
							component={SingleClassResults}
						/>
						<PrivateRoute
							exact
							path="/reports/:class_id/:section_id/exam/:exam_id"
							component={SingleExam}
						/>
						<PrivateRoute path="/exams/grades" component={GradeSettings} />
						<PrivateRoute path="/exams/promote-students" component={PromoteStudents} />
						<PrivateRoute path="/exams/datesheet" component={Datesheet} />
						<PrivateRoute path="/exams/marks" component={ExamsMarks} />
						<PrivateRoute path="/exams/results" component={ExamsResults} />
						<PrivateRoute path="/exams" component={Marks} />

						<PrivateRoute path="/reports/:class_id/:section_id" component={ExamList} />
						<PrivateRoute path="/reports" component={Marks} />
						<PrivateRoute path="/settings" component={Settings} />
						<PrivateRoute path="/diary" component={Diary} />
						<PrivateRoute path="/analytics/daily-stats" exact component={DailyStats} />
						<PrivateRoute path="/analytics" component={Analytics as any} />
						<PrivateRoute path="/diary" component={Diary} />
						<PrivateRoute path="/reports-menu" component={ReportsMenu} />
						<PrivateRoute
							exact
							path="/fees/print-voucher/preview"
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
						<PrivateRoute path="/help" component={Help} />
						<PrivateRoute path="/reset-password" component={ResetPassword} />
						<PrivateRoute path="/expenses" exact component={Expense} />
						<PrivateRoute path="/expenses/new" exact component={ExpenseForm} />
						<PrivateRoute path="/expenses/:id/edit" exact component={ExpenseForm} />

						<PublicRoute exact path="/signup" component={SchoolSignup} />
						<PublicRoute path="/school-login" component={SchoolLogin} />
						<PublicRoute
							path="/school/reset-password"
							component={ResetSchoolPassword}
						/>
						<Route path="/admin/reset-password" component={ResetPassword} />
						<SchoolRoute path="/staff-login" component={StaffLogin} />
						<SchoolRoute exact path="/setup" component={SchoolSetup} />

						<PublicRoute exact path="/" component={Landing} />
						<PrivateRoute
							path="/targeted-instruction"
							component={TargetedInstruction as any}
						/>
						<Route path="/verify-code" component={MISActivation} />
						<Route exact path="/onboarding" component={SchoolOnboarding} />
						<Route path="/auto-login" component={AutoLogin} />
						<Route exact path="/pricing" component={Pricing} />
						<Route exact path="/about-us" component={AboutUs} />
						<Route exact path="/events" component={Events} />
						<Route exact path="/features" component={Feature} />
						<Route exact path="/contact-us" component={ContactUs} />
						<Route exact path="/tos" component={TermsOfService} />
						<Route path="*" component={PageNotFound} />
					</Switch>
				</BrowserRouter>
			</Provider>
		)
	}
}
