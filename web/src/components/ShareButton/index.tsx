import React from 'react'

import { ShareIcon } from 'assets/icons'
import './style.css'

type PropsType = {
	title?: string
	text: string
}

const ShareButton: React.FC<PropsType> = ({ title, text }) => {
	const share = () => {
		//@ts-ignore
		if (navigator.share) {
			//@ts-ignore
			navigator
				.share({
					title: title,
					text: text,
				})
				.then(() => console.log('Successful share'))
				.catch((error: any) => console.log('Error sharing', error))
		}
	}

	return (
		<>
			<div className="text-center">Share {title}</div>
			<div className="share-button container">
				<div onClick={share} className="share-button container button">
					<img src={ShareIcon} alt="share" height="30" width="32" />
				</div>
			</div>
		</>
	)
}

export default ShareButton
