import React from 'react'

import { AppLayout } from 'components/Layout/appLayout'
import { Spinner } from './spinner'

export const DBLoader = () => (
	<AppLayout>
		<div className="flex justify-center">
			<span className="inline-block align-middle h-screen" aria-hidden="true">
				&#8203;
			</span>
			<div className="flex flex-col items-center justify-center space-y-4">
				<Spinner className="w-10 h-10" />
				<div className="animate-pulse">Loading Database</div>
			</div>
		</div>
	</AppLayout>
)
