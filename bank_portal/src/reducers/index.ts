import * as redux from 'redux'
import locations from './narrowed.json'

import {Actions, SELECT_LOCATION, SelectLocationAction, ADD_SCHOOL, addSchoolAction, SET_FILTER, SetFilterAction } from '~/src/actions'


const initialState : RootBankState = {
	school_locations: locations,
	school_db: {},
	selected: undefined,
	auth: {
		id: undefined,
		token: undefined,
		username: undefined,
		attempt_failed: false,
		loading: false,
		client_type: "bank_portal"
	},
	filter_text: ""
}

const rootReducer = (state : RootBankState = initialState, action: Actions) : RootBankState => {

	console.log(action.type)

	switch(action.type) {
		case SELECT_LOCATION:
		{
			return {
				...state,
				selected: (<SelectLocationAction>action).loc
			}
		}

		case ADD_SCHOOL:
		{
			return {
				...state,
				school_db: {
					...state.school_db,
					[(action as addSchoolAction).school.id]: (action as addSchoolAction).school
				}
			}
		}

		case SET_FILTER:
		{
			return {
				...state,
				filter_text: (action as SetFilterAction).filter_text
			}
		}

		default:
			return state
	}
}

export default rootReducer;