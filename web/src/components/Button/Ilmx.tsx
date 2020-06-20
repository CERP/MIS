import React, { useEffect, useState } from 'react'
import Modal from 'components/Modal'
import IlmxRedirectModal from 'components/Ilmx/redirectModal'
import { showScroll, hideScroll } from 'utils/helpers'
import { IlmxLogo } from 'assets/icons'

import './style.css'

type PropsType = {
	auth: RootReducerState["auth"]
	client_id: string
}

const IlmxButton: React.FC<PropsType> = ({ auth, client_id }) => {

	const [phone, setPhone] = useState('')
	const [toggleModal, setToggleModal] = useState(false)

	useEffect(() => {
		const phone = localStorage.getItem("ilmx")
		setPhone(phone)
	}, [])


	const handleRedirectToIlmx = (input_phone?: string) => {

		const link = `https://ilmexchange.com/auto-login?type=SCHOOL&id=${auth.school_id}&key=${auth.token}&cid=${client_id}&phone=${phone || input_phone}`

		if (input_phone) {
			localStorage.setItem("ilmx", input_phone)
			window.location.href = link
			return
		}

		if (phone) {
			window.location.href = link
		} else {
			setToggleModal(!toggleModal)
			hideScroll()
		}
	}

	const handleToggleModal = () => {
		setToggleModal(!toggleModal)
		showScroll()
	}

	return (<>
		{
			toggleModal && <Modal>
				<IlmxRedirectModal
					redirectToIlmx={handleRedirectToIlmx}
					onClose={handleToggleModal}
				/>
			</Modal>
		}
		<img
			src={IlmxLogo}
			style={{ background: "transparent", marginRight: "0.5rem" }}
			className="help-button"
			title={"Ilm Exchange"}
			alt="redirect-to-ilmx"
			onClick={() => handleRedirectToIlmx()}
		/>
	</>)
}

export default IlmxButton