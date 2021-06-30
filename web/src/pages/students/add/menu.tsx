import React from 'react'
import { Link } from 'react-router-dom'

import { AppLayout } from 'components/Layout/appLayout'
import { TextDivider } from 'components/divider'

import iconManualEntry from '../assets/manual-entry.svg'
import iconExcelSheet from '../assets/excelsheet.svg'

// TODO: Think about better solution

export const AddStudentMenu = () => (
	<AppLayout title={'Add Students'} showHeaderTitle>
		<div className="relative p-5 space-y-8 text-gray-700 md:p-10 md:pt-5 md:pb-0 print:hidden">
			<div className="w-full mx-auto md:w-3/5">
				<Link to="/students/excel-import">
					<div className="inline-block w-full mx-auto rounded-lg cursor-pointer bg-blue-brand hover:shadow-md">
						<div className="flex flex-col items-center justify-center p-5">
							<img className="w-20 h-20" src={iconExcelSheet} alt="icon" />
							<div className="mt-4 text-lg text-white">Upload Excel</div>
						</div>
					</div>
				</Link>
			</div>
			<TextDivider
				dividerColor={'bg-gray-900'}
				textBgColor={'bg-white'}
				textColor={'text-gray-900'}
			/>
			<div className="w-full mx-auto md:w-3/5">
				<Link to="/students/new">
					<div className="inline-block w-full mx-auto rounded-lg cursor-pointer bg-orange-brand hover:shadow-md">
						<div className="flex flex-col items-center justify-center p-5">
							<img className="w-20 h-20" src={iconManualEntry} alt="icon" />
							<div className="mt-4 text-lg text-white">Manual Entry</div>
						</div>
					</div>
				</Link>
			</div>
		</div>
	</AppLayout>
)
