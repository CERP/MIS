import Dynamic from '@ironbay/dynamic'
import { MERGES, DELETE, DELETES, CONFIRM_SYNC, CONFIRM_SYNC_DIFF, QUEUE, SNAPSHOT, ON_CONNECT, ON_DISCONNECT, LOGIN_FAIL, LOGIN_SUCCEED, SNAPSHOT_DIFF } from 'actions/core'
import { LOCAL_LOGIN, SCHOOL_LOGIN, LOCAL_LOGOUT } from '../actions'

const rootReducer = (state, action) => {

	console.log(action)
	switch(action.type) {
		case MERGES:
		{
			const nextState = action.merges.reduce((agg, curr) => {
				return Dynamic.put(agg, curr.path, curr.value)
			}, JSON.parse(JSON.stringify(state)))

			// we shouldn't accept snapshots until we get a confirm....
			// 

			return {
				...nextState,
				acceptSnapshot: false
			};
		}

		case DELETES: 
		{

			const nextState = action.paths.reduce((agg, curr) => {
				console.log(curr.path)
				return Dynamic.delete(agg, curr.path)
			}, JSON.parse(JSON.stringify(state)));

			console.log(nextState)

			return {
				...nextState,
				acceptSnapshot: false
			}
		}
		
		// don't need this anymore i think
		case DELETE:
		{
			return {...Dynamic.delete(state, action.path)}
		}

		case QUEUE:
		{
			return {
				...state,
				queued: {
					...state.queued,
					...action.payload
				},
				acceptSnapshot: false
			}
		}

		case CONFIRM_SYNC: 
		{
			const last = action.date;
			// action = {db: {}, date: number}

			// remove all queued writes less than this last date.
			const newQ = Object.keys(state.queued)
				.filter(t => state.queued[t].date > last)
				.reduce((agg, curr_key) => {
					return {...agg, [curr_key]: state.queued[curr_key]}
				}, {})

			let next = Dynamic.put(state, ["queued"], newQ);

			if(Object.keys(action.db).length > 0) {
				next = Dynamic.put(next, ["db"], {...state.db, ...action.db}) // this way if we add new fields on client which arent on db it wont null them. only top level tho....
			}

			return {
				...next,
				acceptSnapshot: true,
				lastSnapshot: new Date().getTime()
			}
		}

		case CONFIRM_SYNC_DIFF:
		{
			console.log("confirm sync diff: ", Object.keys(action.new_writes).length, " changes synced")

			const newQ = Object.keys(state.queued)
				.filter(t => {
					console.log(state.queued[t].date, action.date, state.queued[t].date - action.date);
					return state.queued[t].date > action.date
				})
				.reduce((agg, curr) => {
					console.log(curr)
					return Dynamic.put(agg, ["queued", curr.action.path], curr.action)
				}, {})

			if(Object.keys(action.new_writes).length > 0) {
				// remove queued items

				const nextState = Object.values(action.new_writes)
					.reduce((agg, curr) => Dynamic.put(agg, curr.path, curr.value), JSON.parse(JSON.stringify(state)))

				return  {
					...nextState, 
					queued: newQ,
					acceptSnapshot: true,
					lastSnapshot: new Date().getTime()
				}
			}

			return {
				...state,
				queued: newQ,
				acceptSnapshot: true,
				lastSnapshot: new Date().getTime()
			}
		}

		case SNAPSHOT_DIFF: 
		{

			console.log("snapshot_diff: ", Object.keys(action.new_writes).length, "changes broadcasted")

			if(state.acceptSnapshot && Object.keys(action.new_writes).length > 0) {

				const nextState = Object.values(action.new_writes)
					.reduce((agg, curr) => Dynamic.put(agg, curr.path, curr.value), JSON.parse(JSON.stringify(state)))
				
				return {
					...nextState,
					lastSnapshot: new Date().getTime()
				}
			}

			return {
				...state,
				lastSnapshot: new Date().getTime()
			};
		}

		case SNAPSHOT:
		{
			if(state.acceptSnapshot && Object.keys(action.db).length > 0) {
				console.log('applying snapshot')

				//const next = JSON.parse(JSON.stringify(Dynamic.put(state, ["db"], action.db)))
				return {
					...state,
					db: action.db,
					lastSnapshot: new Date().getTime()
				}
			}

			return state;
		}

		case LOCAL_LOGIN:
		{

			const user = Object.values(state.db.users)
				.find(u => u.name === action.name)

			if(user === undefined) {
				return {
					...state,
					auth: {
						...state.auth,
						attempt_failed: true
					}
				}
			}

			if(action.password === user.password) {

				const faculty = Object.values(state.db.faculty)
					.find(f => f.Name === user.name);

				return {
					...state,
					auth: {
						...state.auth,
						name: user.name,
						faculty_id: faculty.id
					}
				}
			}

			return {
				...state,
				auth: {
					...state.auth,
					attempt_failed: true
				}
			}
		}

		case LOCAL_LOGOUT: 
		{
			return {
				...state,
				auth: {
					...state.auth,
					name: undefined,
					faculty_id: undefined,
					attempt_failed: false
				}
			}
		}

		case ON_CONNECT: 
		{
			return {...state, connected: true}
		}

		case ON_DISCONNECT:
		{
			return {...state, connected: false }
		}

		case SCHOOL_LOGIN: 
		{
			return {
				...state,
				auth: {
					...state.auth,
					loading: true
				}
			}
		}

		case LOGIN_SUCCEED: 
		{
			const auth = {
				...state.auth,
				loading: false,
				token: action.token,
				attempt_failed: false,
				school_id: action.school_id
			};

			return {
				...state,
				auth,
				db: {
					...state.db,
					...action.db
				},
				lastSnapshot: new Date().getTime()
			}
		}

		case LOGIN_FAIL: 
		{
			return {
				...state,
				auth: {
					...state.auth,
					loading: false,
					attempt_failed: true
				}
			}
		}

		default: 
			return state;
	}
}

export default rootReducer;
