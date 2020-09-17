import React from 'react'
import { Provider } from 'react-redux'
import { Store } from 'redux'

import { Routes } from 'routes'

type P = {
	store: Store<RootReducerState>
}

const App: React.FC<P> = ({ store }) => (
	<Provider store={store}>
		<Routes />
	</Provider>
)

export default App