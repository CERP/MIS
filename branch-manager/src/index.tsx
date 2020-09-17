import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import App from 'containers/app'

import { store } from 'helpers'

import './styles/helper.css'
import './styles/main.css'


ReactDOM.render(<App store={store} />, document.getElementById('root'))

serviceWorker.register({
	onUpdate: (registration: ServiceWorkerRegistration) => {
		registration.installing && registration.installing.postMessage({
			type: "SKIP_WAITING"
		})
	}
})