import React, { useState } from 'react'
import { hash } from 'utils'
type PropsType = {
	schoolList: string[]
	faculty: MISFaculty
	onUpdateFacultyPassword: (school_id: string, faculty_id: string, faculty: Faculty) => void
	onGetMISFacultyLoginInfo: (school_id: string) => void
}

type S = {
	school_id: string
	faculty_id: string
	password: string
}

const ResetFacultyPassword: React.FC<PropsType> = ({ schoolList, faculty, onGetMISFacultyLoginInfo, onUpdateFacultyPassword }) => {

	const [stateProps, setStateProps] = useState<S>({
		school_id: "",
		faculty_id: "",
		password: ""
	})

	const onUpdatePassword = () => {

		const { school_id, faculty_id, password } = stateProps

		console.log("PASSWORD", password)

		hash(password)
			.then(hashed_pass => {
				const update_faculty: Faculty = {
					...faculty[faculty_id],
					password: hashed_pass
				}

				onUpdateFacultyPassword(school_id, faculty_id, update_faculty)

				console.log("PASS HASH", hashed_pass)

			})
	}

	return (<>
		<div className="title"> Reset Admin Password</div>
		<div className="section form" style={{ width: "75%" }}>
			<div className="row">
				<label>Select School</label>
				<datalist id="schools">
					{
						schoolList.map(s => <option value={s} key={s}>{s}</option>)
					}
				</datalist>
				<input list="schools" onChange={(e) => setStateProps({ ...stateProps, school_id: e.target.value })} placeholder="Type or Select School" />
			</div>
			<div className="row">
			</div>
			<div className="button blue" onClick={() => onGetMISFacultyLoginInfo(stateProps.school_id)}>Get Faculty</div>
			{
				stateProps.school_id && Object.entries(faculty).length > 0 && <>
					<div className="row">
						<label>Admin faculty</label>
						<select onChange={(e) => setStateProps({ ...stateProps, faculty_id: e.target.value })}>
							<option>Select faculty</option>
							{
								Object.entries(faculty)
									.map(([id, value]) => <option key={id} value={id}>{value.name}</option>)
							}
						</select>
					</div>
					<div className="row">
						<label>Enter new password</label>
						<input type="password" onChange={(e) => setStateProps({ ...stateProps, password: e.target.value })} placeholder="Enter new admin password" />
					</div>
					<div className="button blue" style={{ marginTop: 10 }} onClick={() => onUpdatePassword()}>Reset Password</div>
				</>
			}
		</div>
	</>)
}

export default ResetFacultyPassword