import React from 'react'

import { AppLayout } from 'components/Layout/appLayout'
import { Spinner } from './spinner'

export const DBLoader = () => (
	<AppLayout>
		<div className="flex justify-center">
			<div className="flex flex-col items-center justify-center space-y-4  mt-32 md:mt-48">
				<Spinner className="w-10 h-10" />
				<div className="animate-pulse">Loading Database, Please wait</div>
			</div>
		</div>
	</AppLayout>
)
