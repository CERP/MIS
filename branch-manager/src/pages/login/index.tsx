import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from 'reducers'

import { login } from 'actions/user'
import { clear } from 'actions/alert'
import { AppLayout } from 'components/layout'
import { Spinner } from 'components/animation'
import { ShowPassword, HidePassword } from 'components/password'
import { Link } from 'react-router-dom'

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
		<AppLayout title="Login">
			<div className="h-screen w-full" style={{ backgroundColor: 'var(--primary)' }}>
				<div className="p-6 md:px-10 text-center md:text-left">
					<Link to="/" className="mt-5 text-white font-bold text-xl" > MISchool.pk </Link>
				</div>
				<div className="mt-12 md:mt-20">
					<div className="p-8 md:px-10 md:pt-12 md:pb-10 w-80 rounded-2xl bg-white mx-auto">
						<form className="flex flex-col items-center justify-center" onSubmit={handle_submit}>
							<div className="mb-4">
								<input
									className="w-full border-solid border border-gray-400 rounded-xl p-3" type="text"
									name="username"
									placeholder="Usernmae"
									autoCapitalize="off"
									autoCorrect="off"
									autoComplete="off"
									onChange={handle_change}
									required
								/>
							</div>
							<div className="mb-4">
								<div className="relative">
									<input
										className="w-full border-solid border border-gray-400 rounded-xl p-3"
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
							<button className={"bg-red-600 border font-medium hover:bg-red-500 inline-flex py-3 rounded-xl text-base text-white w-full"}>
								{false && <Spinner />}
								<span className="mx-auto">Login</span>
							</button>
							<p className="text-sm pt-2 h-2 text-red-700">{ }</p>
						</form >
					</div>
				</div>
			</div>
		</AppLayout >
	)
}