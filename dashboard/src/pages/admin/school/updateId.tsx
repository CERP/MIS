import React, { useState } from 'react'

type UpdateSchoolIdProps = {
	schoolList: string[]
	onUpdateSchoolId: (school_id: string, password: string) => void
}

const UpdateSchoolId: React.FC<UpdateSchoolIdProps> = ({ schoolList, onUpdateSchoolId }) => {

	const [oldSchoolId, setOldSchoolId] = useState("")
	const [newSchoolId, setNewSchoolId] = useState("")

	return (<>
		<div className="title"> Update School ID</div>
		<div className="section form" style={{ width: "75%" }}>
			<div className="row">
				<label>Select School</label>
				<datalist id="schools">
					{
						schoolList.map(s => <option value={s} key={s}>{s}</option>)
					}
				</datalist>
				<input list="schools" onChange={(e) => setOldSchoolId(e.target.value)} placeholder="Type or Select School" />
			</div>
			<div className="row">
				<label>New School Id</label>
				<input type="text" onChange={(e) => setNewSchoolId(e.target.value)} placeholder="Enter new School Id" />
			</div>
			<div className="button blue" onClick={() => onUpdateSchoolId(oldSchoolId, newSchoolId)}>Update Id</div>
		</div>
	</>)
}

export default UpdateSchoolId