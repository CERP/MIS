import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import {
	getSchoolList,
	resetSchoolPassword,
	updateSchoolId,
	getSchoolInfo,
	updateSchoolLoginInfo,
	getMISFacultyLoginInfo,
	updateFacultyPassword
} from 'actions'

import ResetSchoolPassword from './resetPassword'
import UpdateSchoolId from './updateId'
import UpdateLoginInfo from './updateLoginInfo'
import ResetFacultyPassword from './resetFacultyPassword'

interface PropsType {

	schoolList: Array<string>
	loginInfo: SchoolLoginInfo
	faculty: MISFaculty

	getSchoolList: () => void
	updateId: (old_school_id: string, new_school_id: string) => void
	resetPassword: (school_id: string, password: string) => void
	getSchoolInfo: (school_id: string) => void
	updateLoginInfo: (school_id: string, login_info: SchoolLoginInfo) => void
	updateStrategy: (school_id: string, login_info: TrialsDataRow["value"]) => void
	getMISFacultyLoginInfo: (school_id: string) => void
	updateFacultyPassword: (school_id: string, faculty_id: string, faculty: Faculty) => void
}

const ManageSchool: React.FC<PropsType> = (props) => {

	const {
		schoolList,
		loginInfo,
		faculty,
		getSchoolInfo,
		updateId,
		resetPassword,
		updateLoginInfo,
		getSchoolList,
		getMISFacultyLoginInfo,
		updateFacultyPassword
	} = props

	useEffect(() => {
		getSchoolList()
	})

	return <div className="page admin-actions">
		<UpdateSchoolId
			schoolList={schoolList}
			onUpdateSchoolId={updateId} />

		<ResetSchoolPassword
			schoolList={schoolList}
			onResetPassword={resetPassword} />

		<UpdateLoginInfo
			schoolList={schoolList}
			getSchoolInfo={getSchoolInfo}
			updateLoginInfo={updateLoginInfo}
			schoolLoginInfo={loginInfo} />

		<ResetFacultyPassword
			schoolList={schoolList}
			faculty={faculty}
			onUpdateFacultyPassword={updateFacultyPassword}
			onGetMISFacultyLoginInfo={getMISFacultyLoginInfo} />

	</div>
}

export default connect((state: RootReducerState) => ({
	loginInfo: state.school_Info.meta as SchoolLoginInfo,
	schoolList: state.school_Info.school_list,
	faculty: state.mis_faculty
}), (dispatch: Function) => ({
	getSchoolList: () => dispatch(getSchoolList()),
	updateId: (old_id: string, new_id: string) => dispatch(updateSchoolId(old_id, new_id)),
	getSchoolInfo: (school_id: string) => dispatch(getSchoolInfo(school_id)),
	updateLoginInfo: (school_id: string, login_info: SchoolLoginInfo) => dispatch(updateSchoolLoginInfo(school_id, login_info)),
	resetPassword: (school_id: string, password: string) => dispatch(resetSchoolPassword(school_id, password)),
	getMISFacultyLoginInfo: (school_id: string) => dispatch(getMISFacultyLoginInfo(school_id)),
	updateFacultyPassword: (school_id: string, faculty_id: string, faculty: Faculty) => dispatch(updateFacultyPassword(school_id, faculty_id, faculty))
}))(ManageSchool)