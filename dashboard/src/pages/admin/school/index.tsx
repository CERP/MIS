import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { getSchoolList, resetSchoolPassword } from 'actions'
import ResetSchoolPassword from './resetPassword'

interface P {

	schoolList: string[]

	getSchoolList: () => void
	resetPassword: (school_id: string, password: string) => void
}

const ManageSchool: React.FC<P> = ({ schoolList, resetPassword, getSchoolList }) => {

	useEffect(() => {
		getSchoolList()
	}, [])

	return <div className="page admin-actions">
		<ResetSchoolPassword
			schoolList={schoolList}
			onResetPassword={resetPassword} />
	</div>
}

export default connect((state: RootReducerState) => ({
	schoolList: state.school_Info.school_list,
}), (dispatch: Function) => ({
	getSchoolList: () => dispatch(getSchoolList()),
	resetPassword: (school_id: string, password: string) => dispatch(resetSchoolPassword(school_id, password))
}))(ManageSchool)