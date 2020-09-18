import { applyMiddleware, AnyAction, createStore, Store } from 'redux'
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk'
import reducer from 'reducers'
import debounce from 'utils/debounce'
import { loadDB, saveDB } from 'utils/localStorage'

const initial_state = loadDB()

const create_store: Store<RootReducerState> = createStore(
    reducer,
    initial_state,
    applyMiddleware(thunkMiddleware as ThunkMiddleware<RootReducerState, AnyAction>)
)

const save_bounce = debounce(() => {
    const state = create_store.getState()
    saveDB(state)
}, 500)

create_store.subscribe(save_bounce as () => void)

export const store = create_store