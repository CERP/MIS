import React from 'react'
import { Provider } from 'react-redux'
import { AppState } from 'reducers'
import { Store } from 'redux'

import { AppRoutes } from 'routes'

type P = {
	store: Store<AppState>
}

const App: React.FC<P> = ({ store }) => (
	<Provider store={store}>
		<AppRoutes />
	</Provider>
)

export default App