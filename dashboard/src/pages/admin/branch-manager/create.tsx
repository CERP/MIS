import React, { useState } from 'react'

type CreateBranchManagerProps = {
	schoolList: string[]
	onCreateBranchManager: (username: string, password: string, value: BranchInfo) => void
}

const CreateBranchManager: React.FC<CreateBranchManagerProps> = ({ schoolList, onCreateBranchManager }) => {

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [schoolId, setSchoolId] = useState('')

	const [branches, setBranches] = useState<BranchInfo>({
		schools: []
	})

	const hanleClickAddButton = () => {

		if (schoolId) {
			// @ts-ignore
			const unique_schools = [...new Set([...branches["schools"], schoolId])] as string[]
			setBranches({
				...branches,
				schools: unique_schools
			})
		}
	}

	const hanleClickRemoveButton = (id: string) => {
		const updated_schools = [...branches["schools"]].filter(sid => sid !== id)
		setBranches({
			...branches,
			schools: updated_schools
		})
	}

	const hanleClickCreateButton = () => {

		const { schools } = branches

		if (username.trim().length === 0 && password.trim().length === 0) {
			window.alert("usernmae or password can't empty")
			return
		}

		if (schools.length === 0) {
			window.alert("Please add at least one school to create branch manager")
			return
		}

		// dispatch the action
		onCreateBranchManager(username, password, branches)
	}

	return (<>
		<div className="title"> Create Branch Manager</div>
		<div className="branch-manager section form" style={{ width: "75%" }}>
			<div className="row">
				<label>Username</label>
				<input type="text" onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
			</div>
			<div className="row">
				<label>Password</label>
				<input type="text" onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
			</div>
			<div className="divider"> Schools </div>
			<div className="tag-container">
				{
					branches["schools"]
						.map(id =>
							<div className="tag-row" key={id}>
								<div className="deletable-tag-wrapper" onClick={() => hanleClickRemoveButton(id)}>
									<div className="tag">{id} </div>
									<div className="cross">×</div>
								</div>
							</div>
						)
				}
			</div>
			<div className="row" style={{ flexDirection: "row" }}>
				<input list="schools" onChange={(e) => setSchoolId(e.target.value)} placeholder="Type or select school" style={{ width: "initial" }} />
				<datalist id="schools">
					{
						schoolList
							.map(id => <option key={id} value={id} />)
					}
				</datalist>
				<div className="button green" style={{ width: "initial", marginLeft: "auto" }} onClick={hanleClickAddButton}>+</div>
			</div>
			<div className="button blue" onClick={hanleClickCreateButton}>Create</div>
		</div>
	</>)
}

export default CreateBranchManager