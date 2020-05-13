import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { getSchoolList, resetSchoolPassword, updateSchoolId } from 'actions'
import ResetSchoolPassword from './resetPassword'
import UpdateSchoolId from './updateId'

interface P {

	schoolList: string[]

	getSchoolList: () => void
	updateId: (old_school_id: string, new_school_id: string) => void
	resetPassword: (school_id: string, password: string) => void
}

const ManageSchool: React.FC<P> = ({ schoolList, resetPassword, getSchoolList, updateId }) => {

	useEffect(() => {
		getSchoolList()
	}, [])

	return <div className="page admin-actions">
		<UpdateSchoolId
			schoolList={schoolList}
			onUpdateSchoolId={updateId}
		/>
		<ResetSchoolPassword
			schoolList={schoolList}
			onResetPassword={resetPassword} />
	</div>
}

export default connect((state: RootReducerState) => ({
	schoolList: state.school_Info.school_list,
}), (dispatch: Function) => ({
	getSchoolList: () => dispatch(getSchoolList()),
	updateId: (old_id: string, new_id: string) => dispatch(updateSchoolId(old_id, new_id)),
	resetPassword: (school_id: string, password: string) => dispatch(resetSchoolPassword(school_id, password))
}))(ManageSchool)