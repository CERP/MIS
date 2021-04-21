import React, { useState, useEffect } from 'react'
import { HelpIcon } from 'assets/icons'
import Modal from 'components/Modal'
import TutorialWindow from 'components/Tutorial'
import { getLinkForPath, getIlmxLinkForPath } from 'constants/links'
import { showScroll, hideScroll } from 'utils/helpers'

import './style.css'

type PropsType = {
	title?: string
	link?: string
}

const HelpButton: React.FC<PropsType> = (props) => {
	const { pathname } = window.location
	const [toggleTutorialModal, setToggleTutorialModal] = useState(false)
	const [ilmxUser, setIlmxUser] = useState('')

	useEffect(() => {
		const user = localStorage.getItem('user')
		setIlmxUser(user)
	}, [])

	const toggleTutorialWindow = () => {
		setToggleTutorialModal(!toggleTutorialModal)
		hideScroll()
	}

	const onCloseTutorialWindow = () => {
		setToggleTutorialModal(false)
		showScroll()
	}

	const { title, link } =
		props.title && props.link
			? props
			: ilmxUser
			? getIlmxLinkForPath(pathname)
			: getLinkForPath(pathname)

	return (
		<>
			<img
				src={HelpIcon}
				className="help-button"
				onClick={toggleTutorialWindow}
				title={'MISchool Help'}
				alt="help"
			/>
			{toggleTutorialModal && (
				<Modal>
					<TutorialWindow title={title} link={link} onClose={onCloseTutorialWindow} />
				</Modal>
			)}
		</>
	)
}

export default HelpButton
