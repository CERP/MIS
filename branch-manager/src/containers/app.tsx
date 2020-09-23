import React from 'react'
import { Provider } from 'react-redux'
import { RootReducerCombinedState } from 'reducers'
import { Store } from 'redux'

import { AppRoutes } from 'routes'

type P = {
	store: Store<RootReducerCombinedState>
}

const App: React.FC<P> = ({ store }) => (
	<Provider store={store}>
		<AppRoutes />
	</Provider>
)

export default App