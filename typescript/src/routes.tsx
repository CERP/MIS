import * as React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import * as redux from 'redux'

import Landing from './modules/Landing'
// import TeacherList from 'modules/Teacher/List'
// import TeacherSingle from 'modules/Teacher/Single'
// import StudentList from 'modules/Student/List'
// import StudentSingle from 'modules/Student/Single'
// import Login from 'modules/Login'
// import SchoolLogin from 'modules/Login/school'
// import ClassModule from 'modules/Class'
// import ClassSingle from 'modules/Class/Single'
// import Attendance from 'modules/Attendance'
// import TeacherAttendance from 'modules/Teacher-Attendance'
// import SMS from 'modules/SMS'
// import Reports from 'modules/Reports'

import AuthedRoute from './components/AuthedRoute'

interface props {
	store: redux.Store
}
export default ({ store } : props) => (
	<Provider store={store}>
		<BrowserRouter>
			<Switch>
				<AuthedRoute exact path="/" component={Landing} />

				<Route path="/school-login" component={SchoolLogin} />
				<Route path="/login" component={Login} />
			</Switch>
		</BrowserRouter>
	</Provider>
)
