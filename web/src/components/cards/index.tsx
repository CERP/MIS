import React from 'react'
import { Link } from 'react-router-dom'
import { StudentItem } from 'modules/Student/List'

import './style.css'

interface P {
	items: Array<any>
	create: string
	createText: string
	toLabel: Function
	totalItems?: number
	onDeleteStudent?: (student_id: string) => void
	onPrintStudentIdCard?: (student_id: string) => void

	search?: (value: string) => void
	children?: React.ReactNode
}

const Card: React.FC<P> = ({
	items,
	create,
	createText,
	totalItems,
	search,
	children,
	onDeleteStudent,
	onPrintStudentIdCard,
}) => {
	const hanleSearchInputChange = (value: string) => {
		search(value)
	}

	return (
		<div className="card-wrap">
			<div className="total">
				<div className="label">
					Total: <strong> {totalItems} </strong>{' '}
				</div>
				{create && <CreateButtonElem to={create} text={createText} />}
			</div>
			<input
				className="search-bar no-print"
				type="text"
				placeholder="Search by name | class | admission # | phone #"
				onChange={(e) => hanleSearchInputChange(e.target.value)}
			/>
			{children}
			<div className="card-list">
				{items.map((item: any) => (
					<StudentItem
						key={item.id + '-' + item.section_id}
						student={item}
						deleteStudent={onDeleteStudent}
						printStudentIdCard={onPrintStudentIdCard}
					/>
				))}
			</div>
		</div>
	)
}

export default Card

type CreateButtonElemProps = {
	to: string
	text: string
}

const CreateButtonElem: React.FC<CreateButtonElemProps> = ({ to, text }) => {
	return (
		<Link className="button blue" to={to}>
			{text}
		</Link>
	)
}
