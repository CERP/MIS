import React, { useState } from 'react'
import tutorials from './tutorials.json'

import Modal from 'components/Modal'
import TutorialWindow from 'components/Tutorial'
import { showScroll, hideScroll } from 'utils/helpers'

import './style.css'

type Tutorial = {
	title: string
	titleShort: string
	link: string
}

const HelpTutorial = () => {

	const [toggleModal, setToggleModal] = useState(false)
	const [tutorial, setTutorial] = useState<Tutorial>()

	const handleOnClickTutorial = (tutorial: Tutorial) => {
		setTutorial(tutorial)
		setToggleModal(!toggleModal)
		hideScroll()
	}

	const handleToggleModal = () => {
		setToggleModal(!toggleModal)
		showScroll()
	}

	return (
		<div className="help-tutorial section">
			<div style={{ width: "inherit" }}>
				<h3 className="text-center">Setting up School in Learning Management System</h3>
				{
					toggleModal &&
					<Modal>
						<TutorialWindow
							title={tutorial.titleShort}
							link={tutorial.link}
							onClose={handleToggleModal}
						/>
					</Modal>
				}
				<ul>
					{
						tutorials.map((tutorial, index) => <li key={index}>
							<p className="p-link" onClick={() => handleOnClickTutorial(tutorial)}>{tutorial.title}</p>
						</li>)
					}
				</ul>
			</div>
		</div>
	)
}

export default HelpTutorial