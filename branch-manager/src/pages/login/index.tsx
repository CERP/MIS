import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { alert_actions, user_actions } from 'actions'
import { AppLayout } from 'components/layout'
import { Spinner } from 'components/animation'
import { ShowPassword, HidePassword } from 'components/password'

type P = {

}

type S = {
	username: string
	password: string
}

export const Login: React.FC<P> = () => {

	const dispatch = useDispatch()
	const alert = useSelector((state: any) => state.alert)
	const logging = useSelector((state: any) => state.authentication.loggingIn)

	const [toggle, set_toggle] = useState(false)
	const [state, set_state] = useState<S>({
		username: '',
		password: ''
	})

	useEffect(() => {

		dispatch(user_actions.logout())

		// don't dispatch to many time, just it when alert message set
		if (alert && alert.type) {
			setTimeout(() => {
				dispatch(alert_actions.clear())
			}, 5000)
		}

	}, [alert, dispatch])

	const handle_change = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		set_state({ ...state, [name]: value })
	}

	const handle_login = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { username, password } = state

		if (username && password) {
			dispatch(user_actions.login(username, password))
		}
	}

	const handle_show_hide = () => {
		set_toggle(!toggle)
	}

	return (
		<AppLayout>
			<form className="h-full rounded py-12 px-12 flex flex-col items-center justify-center" onSubmit={(e) => handle_login(e)}>
				<div className="mb-4 mt-8">
					<div className="mb-4">
						<label className="sr-only">Username</label>
						<input className="border-solid border border-gray-400 rounded px-2 py-2" type="text"
							name="username" placeholder="usernmae" autoCapitalize="off" autoCorrect="off" autoComplete="off" onChange={(e) => handle_change(e)} required />
					</div>
					<div className="mb-4">
						<label className="sr-only">Password</label>
						<div className="relative">
							<input className="border-solid border border-gray-400 rounded px-2 py-2" type={`${toggle ? 'text' : 'password'}`}
								name="password" placeholder="Password" autoCapitalize="off" autoCorrect="off" autoComplete="off" onChange={(e) => handle_change(e)} required />
							<div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer">
								{toggle ? <HidePassword onHide={handle_show_hide} /> : <ShowPassword onShow={handle_show_hide} />}
							</div>
						</div>
					</div>
					<button className={`inline-flex px-4 py-2 border text-base font-medium leading-6 text-center 
										rounded text-white bg-red-600 hover:bg-red-500 w-full ${logging ? 'cursor-not-allowed' : ''}`}>
						{logging && <Spinner />}
						<span className="mx-auto">Login</span>
					</button>
					<p className="text-sm my-2 text-red-700">{alert && alert.message}</p>
				</div>
			</form >
		</AppLayout >
	)
}