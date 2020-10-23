import React from 'react'

import siteConfig from 'constants/siteConfig.json'
import './style.css'

const ErrorPage = ({ err, errInfo }) => {

	const helpline = siteConfig.helpLineIlmx

	return <div className="section-container error-page">
		<h1>MISchool Error</h1>
		<h2>Please call <a href={`tel:${helpline.phoneInt}`}>{helpline.phoneAlt}</a> or send screenshot</h2>
		<p>To try and continue, press back and refresh page.</p>
		<p>{err.toString()}</p>
		<p>{errInfo.componentStack}</p>
	</div>
}

export default ErrorPage