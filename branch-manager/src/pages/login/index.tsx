import React, { useState } from 'react'

import { AppLayout } from 'components/layout'

type P = {

}

type S = {
	usernmae: string
	password: string
	remember: boolean
}

export const Login: React.FC<P> = ({ }) => {

	const [state, set_state] = useState<S>()

	const handle_click_login_btn = () => { }

	return (
		<AppLayout>
			<div className="h-full rounded py-12 px-12 flex flex-col items-center justify-center">
				<div className="mb-4 mt-8">
					<div className="mb-4">
						<label className="sr-only">Username</label>
						<input className="border-solid border border-gray-400 rounded px-2 py-3" type="email" placeholder="usernmae" required />
					</div>
					<div>
						<label className="sr-only">Password</label>
						<input className="border-solid border border-gray-400 rounded px-2 py-3" type="password" placeholder="Password" required />
					</div>
					<div className="my-4 flex items-center">
						<input className="h-4 w-4 mr-2" type="checkbox" />
						<label className="text-md text-gray-700">Remember me</label>
					</div>
					<button className="bg-gray-500 hover:bg-gray-600 rounded text-white font-bold w-full py-3">Login</button>
				</div>
			</div>
		</AppLayout>
	)
}