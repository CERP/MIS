import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'

import { store } from 'components/store'
import { Provider } from 'react-redux'
import { AppRoutes } from 'routes'

import './styles/helper.css'
import './styles/main.css'



ReactDOM.render(
	<Provider store={store}>
		<AppRoutes />
	</Provider>,
	document.getElementById('root')
)

serviceWorker.register({
	onUpdate: (registration: ServiceWorkerRegistration) => {
		registration.installing && registration.installing.postMessage({
			type: "SKIP_WAITING"
		})
	}
})