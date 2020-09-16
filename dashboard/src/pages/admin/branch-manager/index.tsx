import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import CreateBranchManager from './create'

import {
	getSchoolList
} from 'actions'


interface PropsType {
	schoolList: Array<string>
	getSchoolList: () => void
}

const BranchManager: React.FC<PropsType> = (props) => {

	const {
		schoolList,
		getSchoolList
	} = props

	useEffect(() => {
		getSchoolList()
	}, [getSchoolList])

	return <div className="page admin-actions">
		<CreateBranchManager schoolList={schoolList} />
	</div>
}

export default connect((state: RootReducerState) => ({
	schoolList: state.school_Info.school_list,
}), (dispatch: Function) => ({
	getSchoolList: () => dispatch(getSchoolList())
}))(BranchManager)