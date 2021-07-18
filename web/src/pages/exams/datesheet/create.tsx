import React from 'react'
import { AppLayout } from 'components/Layout/appLayout'

export const CreateOrUpdateDatesheet = () => {
	return (
		<AppLayout title="Datesheet" showHeaderTitle>
			<div className="md:w-11/12 flex mx-auto md:pt-8 md:pb-0 text-gray-700 relative">
				<div className="w-2/5">Radio Group</div>
				<div className="w-full">Form</div>
			</div>
		</AppLayout>
	)
}
