import React from 'react'
import { Link } from 'react-router-dom'

import './style.css'

interface P {
	items: Array<any>
	Component: Function
	create: string
	createText: string
	toLabel: Function
	totalItems?: number
	search?: (value: string) => void
	children?: React.ReactNode
}

const Card: React.FC<P> = ({ items, Component, create, createText, totalItems, search, children }) => {

	const onChange = (e: React.FormEvent<HTMLInputElement>) => {
		search(e.currentTarget.value)
	}

	return (
		<div className="card-wrap">
			<div className="total">
				<div className="label">Total: <strong> {totalItems} </strong> </div>
				{create && <CreateButtonElem to={create} text={createText} />}
			</div>
			<input className="search-bar no-print" type="text" placeholder="Search by name | class | admission # | phone #" onChange={onChange} />
			{children}
			<div className="card-list">
				{
					items.map(item => Component(item))
				}
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
	return <Link className="button blue" to={to}>{text}</Link>
}