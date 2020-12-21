import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import CreateBranchManager from './create'

import './style.css'

import {
	getSchoolList,
	createBranchManager,
	updateBranches,
	updateBranchManagerPassword
} from 'actions'


interface PropsType {
	schoolList: Array<string>
	getSchoolList: () => void
	createBranchManager: (username: string, password: string, value: BranchInfo) => void
	updateBranches: (username: string, value: BranchInfo) => void
	updateBranchManagerPassword: (username: string, password: string) => void
}

const BranchManager: React.FC<PropsType> = (props) => {

	const {
		schoolList,
		getSchoolList,
		createBranchManager
	} = props

	useEffect(() => {
		getSchoolList()
	}, [getSchoolList])

	return <div className="page admin-actions">
		<CreateBranchManager schoolList={schoolList} onCreateBranchManager={createBranchManager} />
	</div>
}

export default connect((state: RootReducerState) => ({
	schoolList: state.school_Info.school_list,
}), (dispatch: Function) => ({
	getSchoolList: () => dispatch(getSchoolList()),
	createBranchManager: (username: string, password: string, value: BranchInfo) => dispatch(createBranchManager(username, password, value)),
	updateBranches: (username: string, value: BranchInfo) => dispatch(updateBranches(username, value)),
	updateBranchManagerPassword: (username: string, password: string) => dispatch(updateBranchManagerPassword(username, password))
}))(BranchManager)