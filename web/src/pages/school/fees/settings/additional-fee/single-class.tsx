import React from 'react'
import toTitleCase from 'utils/toTitleCase'

interface AddFeeToClassProps {
	classes: RootDBState['classes']
	setClassId: (cid: string) => void
}

export const AddFeeToClass = ({ classes, setClassId }: AddFeeToClassProps) => {
	return (
		<>
			<div>Select Class</div>
			<select
				onChange={e => setClassId(e.target.value)}
				name="classId"
				className="tw-is-form-bg-black tw-select py-2 w-full">
				<option value={''}>Choose from here</option>
				{Object.values(classes)
					.filter(c => c)
					.sort((a, b) => a.classYear ?? 0 - b.classYear ?? 0)
					.map(c => (
						<option key={c.id} value={c.id}>
							{toTitleCase(c.name)}
						</option>
					))}
			</select>
		</>
	)
}
