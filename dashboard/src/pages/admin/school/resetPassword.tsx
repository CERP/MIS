import React, { useState } from 'react'

type ResetPasswordProps = {
	schoolList: string[]
	onResetPassword: (school_id: string, password: string) => void
}

const ResetSchoolPassword: React.FC<ResetPasswordProps> = ({ schoolList, onResetPassword }) => {

	const [schoolId, setSchoolId] = useState("")
	const [password, setPassword] = useState("")

	return (<>
		<div className="title"> Reset School Password</div>
		<div className="section form" style={{ width: "75%" }}>
			<div className="row">
				<label>Select School</label>
				<datalist id="schools">
					{
						schoolList.map(s => <option value={s} key={s}>{s}</option>)
					}
				</datalist>
				<input list="schools" onChange={(e) => setSchoolId(e.target.value)} placeholder="Type or Select School" />
			</div>
			<div className="row">
				<label>Password</label>
				<input type="text" onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" />
			</div>
			<div className="button blue" onClick={() => onResetPassword(schoolId, password)}>Reset Password</div>
		</div>
	</>)
}

export default ResetSchoolPassword