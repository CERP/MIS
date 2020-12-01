import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from 'reducers'

import { login } from 'actions/user'
import { clear } from 'actions/alert'
import { AppLayout } from 'components/layout'
import { Spinner } from 'components/animation'
import { ShowPassword, HidePassword } from 'components/password'

type S = {
	username: string
	password: string
}

export const Login = () => {

	const dispatch = useDispatch()
	const alert = useSelector((state: AppState) => state.alert)

	const [showPassword, setShowPassword] = useState(false)

	const [state, setState] = useState<S>({
		username: '',
		password: ''
	})

	useEffect(() => {

		if (alert.type) {
			setTimeout(() => {
				dispatch(clear())
			}, 3000)
		}

	}, [alert, dispatch])

	const handle_change = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setState({ ...state, [name]: value })
	}

	const handle_submit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { username, password } = state

		if (username && password) {
			dispatch(login(username, password))
		}
	}

	return (
		<AppLayout>
			<form className="h-full rounded py-12 px-12 flex flex-col items-center justify-center" onSubmit={handle_submit}>
				<div className="mb-4 mt-8">
					<div className="mb-4">
						<label className="sr-only">Username</label>
						<input
							className="border-solid border border-gray-400 rounded px-2 py-2" type="text"
							name="username"
							placeholder="usernmae"
							autoCapitalize="off"
							autoCorrect="off"
							autoComplete="off"
							onChange={handle_change}
							required
						/>
					</div>
					<div className="mb-4">
						<label className="sr-only">Password</label>
						<div className="relative">
							<input
								className="border-solid border border-gray-400 rounded px-2 py-2"
								type={showPassword ? 'text' : 'password'}
								name="password"
								placeholder="Password"
								autoCapitalize="off"
								autoCorrect="off"
								autoComplete="off"
								onChange={handle_change}
								required
							/>
							<div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer">
								{showPassword ? <HidePassword onHide={() => setShowPassword(false)} /> : <ShowPassword onShow={() => setShowPassword(true)} />}
							</div>
						</div>
					</div>
					<button className={"inline-flex px-4 py-2 border text-base font-medium leading-6 text-center rounded text-white bg-red-600 hover:bg-red-500 w-full"}>
						{false && <Spinner />}
						<span className="mx-auto">Login</span>
					</button>
					<p className="text-sm my-2 text-red-700">{alert.message}</p>
				</div>
			</form >
		</AppLayout >
	)
}