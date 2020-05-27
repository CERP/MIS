import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import {
	getSchoolList,
	resetSchoolPassword,
	updateSchoolId,
	getSchoolInfo,
	updateLoginStrategy
} from 'actions'

import ResetSchoolPassword from './resetPassword'
import UpdateSchoolId from './updateId'
import UpdateLoginStrategy from './updateStrategy'

interface PropsType {

	schoolList: Array<string>
	loginInfo: TrialsDataRow["value"]

	getSchoolList: () => void
	updateId: (old_school_id: string, new_school_id: string) => void
	resetPassword: (school_id: string, password: string) => void
	getSchoolInfo: (school_id: string) => void
	updateStrategy: (school_id: string, login_info: TrialsDataRow["value"]) => void
}

const ManageSchool: React.FC<PropsType> = (props) => {

	const {
		schoolList,
		loginInfo,
		getSchoolInfo,
		updateId,
		resetPassword,
		updateStrategy
	} = props

	useEffect(() => {
		getSchoolList()
	}, [getSchoolList])

	return <div className="page admin-actions">
		<UpdateSchoolId
			schoolList={schoolList}
			onUpdateSchoolId={updateId}
		/>
		<ResetSchoolPassword
			schoolList={schoolList}
			onResetPassword={resetPassword} />

		<UpdateLoginStrategy
			schoolList={schoolList}
			onGetSchoolInfo={getSchoolInfo}
			onUpdateLoginStrategy={updateStrategy}
			schoolLoginInfo={loginInfo} />

	</div>
}

export default connect((state: RootReducerState) => ({
	loginInfo: state.school_Info.meta as TrialsDataRow["value"],
	schoolList: state.school_Info.school_list,
}), (dispatch: Function) => ({
	getSchoolList: () => dispatch(getSchoolList()),
	updateId: (old_id: string, new_id: string) => dispatch(updateSchoolId(old_id, new_id)),
	getSchoolInfo: (school_id: string) => dispatch(getSchoolInfo(school_id)),
	updateStrategy: (school_id: string, login_info: TrialsDataRow["value"]) => dispatch(updateLoginStrategy(school_id, login_info)),
	resetPassword: (school_id: string, password: string) => dispatch(resetSchoolPassword(school_id, password))
}))(ManageSchool)