import React, { useState, useEffect } from 'react'

import './style.css'

interface PropsType {
	redirectToIlmx: (phone: string) => void
	onClose: () => void
}

const IlmxRedirectModal: React.FC<PropsType> = ({ redirectToIlmx, onClose }) => {

	const [phone, setPhone] = useState('')
	const [isInvalidPhone, setIsInvalidPhone] = useState(false)

	useEffect(() => {
		document.getElementById("phoneinput").focus()
	}, [])

	const handleRedirectToIlmx = () => {

		if (phone === "" || phone.length !== 11) {
			setIsInvalidPhone(true)

			setTimeout(() => {
				setIsInvalidPhone(false)
			}, 3000);

			return
		}

		redirectToIlmx(phone)
	}

	return (
		<div className="ilmx-redirect modal-container inner">
			<div className="close button red" onClick={onClose}>✕</div>
			<div className="title">Confirm your Phone</div>
			<div className="section-container">
				<div className="row">
					<input
						type="number"
						className="input"
						id="phoneinput"
						placeholder="Enter your phone no."
						onChange={(e) => setPhone(e.target.value)} />
				</div>
				{isInvalidPhone && <p className="note" style={{ marginTop: 0 }}>Please enter valid phone number!</p>}
				<div className="button blue" onClick={() => handleRedirectToIlmx()}>Continue</div>
				<p><span className="note">Note:</span> If you already have an IlmExchange account please enter the number you registered with otherwise a new account will be created</p>
			</div>
		</div>
	)
}

export default IlmxRedirectModal