import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppLayout } from 'components/layout'

import { user_actions } from 'actions'

type P = {

}

type S = {
	username: string
	password: string
}

export const Login: React.FC<P> = () => {

	const [submitted, set_submitted] = useState(false)
	const [state, set_state] = useState<S>({
		username: '',
		password: ''
	})

	const dispatch = useDispatch()
	const { username, password } = state

	const handle_change = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		set_state({ ...state, [name]: value })
	}

	const handle_login = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		set_submitted(true)

		if (username && password) {
			dispatch(user_actions.login(username, password))
		}
	}

	return (
		<AppLayout>
			<form className="h-full rounded py-12 px-12 flex flex-col items-center justify-center" onSubmit={(e) => handle_login(e)}>
				<div className="mb-4 mt-8">
					<div className="mb-4">
						<label className="sr-only">Username</label>
						<input className="border-solid border border-gray-400 rounded px-2 py-3" type="text"
							name="username" placeholder="usernmae" onChange={(e) => handle_change(e)} required />
					</div>
					<div className="mb-4">
						<label className="sr-only">Password</label>
						<input className="border-solid border border-gray-400 rounded px-2 py-3" type="password"
							name="password" placeholder="Password" onChange={(e) => handle_change(e)} required />
					</div>
					<button className="bg-gray-500 hover:bg-gray-600 rounded text-white font-bold w-full py-3">
						Login
					</button>
				</div>
			</form>
		</AppLayout>
	)
}