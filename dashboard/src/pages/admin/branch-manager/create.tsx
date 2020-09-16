import React, { useState } from 'react'

type CreateBranchManagerProps = {
	schoolList: string[]
}

const CreateBranchManager: React.FC<CreateBranchManagerProps> = ({ schoolList }) => {


	return (<>
		<div className="title"> Create Branch Manager</div>
		<div className="section form" style={{ width: "75%" }}>
			<div className="row">

			</div>
			<div className="row">

			</div>
			<div className="button blue">Create</div>
		</div>
	</>)
}

export default CreateBranchManager