import React from 'react'
import ReactDOM from 'react-dom';
import { createPortal } from 'react-dom'

import './style.css'

const modalRoot = document.getElementById('modal-root')

export default class Modal extends React.Component {
	el: HTMLDivElement

	constructor(props: any) {
		super(props)

		this.el = document.createElement('div')
	}

	componentDidMount() {
		modalRoot.appendChild(this.el)
	}

	componentWillUnmount() {
		modalRoot.removeChild(this.el)
	}

	render() {
		return ReactDOM.createPortal(
			<div className="modal-container">{this.props.children}</div>,
			this.el
		)
	}
}

interface TModalProps {
	callback?: () => void
}

export const TModal: React.FC<TModalProps> = ({ children }) => {

	return createPortal(
		<div className="fixed inset-0 overflow-y-auto" style={{ zIndex: 9999 }}>
			<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
				<div className="fixed inset-0 transition-opacity" aria-hidden="true">
					<div className="absolute inset-0 bg-gray-200 opacity-50"></div>
				</div>
				{/* This element is to trick the browser into centering the modal contents. */}
				<span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
				<div className="inline-block align-bottom rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
					role="dialog" aria-modal="true" aria-labelledby="modal-headline">
					{
						children
					}
				</div>
			</div>
		</div>
		,
		document.body
	)
}
