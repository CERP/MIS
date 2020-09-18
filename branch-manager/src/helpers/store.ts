import { applyMiddleware, AnyAction, createStore, Store } from 'redux'
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk'
import { RootReducerCombinedState, root_reducer } from 'reducers/index'

const create_store: Store<RootReducerCombinedState> = createStore(
    root_reducer,
    applyMiddleware(thunkMiddleware as ThunkMiddleware<RootReducerCombinedState, AnyAction>)
)

export const store = create_store