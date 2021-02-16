import React from 'react'
import { AppLayout } from 'components/Layout/appLayout'

import iconManualEntry from '../assets/manual-entry.svg'
import iconExcelSheet from '../assets/excelsheet.svg'
import { TextDivider } from 'components/divider'
import { Link } from 'react-router-dom'

export const AddStudentSelect = () => {
	return (
		<AppLayout title={"Add Students"}>
			<div className="p-5 md:p-10 md:pb-0 text-gray-700 relative print:hidden space-y-8">
				<div className="text-center font-bold text-2xl">Add Students</div>
				<div className="w-full md:w-3/5 mx-auto">
					<Link to="/students/excel-import">
						<div className="bg-blue-brand inline-block mx-auto rounded-lg w-full">
							<div className="p-5 flex flex-col items-center justify-center">
								<img className="w-20 h-20" src={iconExcelSheet} alt="icon" />
								<div className="text-white mt-4 text-lg">Upload Excel</div>
							</div>
						</div>
					</Link>
				</div>
				<TextDivider dividerColor={"bg-gray-900"} textBgColor={"bg-white"} textColor={"text-gray-900"} />
				<div className="w-full md:w-3/5 mx-auto">
					<Link to="/students/new">
						<div className="inline-block bg-orange-brand mx-auto rounded-lg w-full">
							<div className="p-5 flex flex-col items-center justify-center">
								<img className="w-20 h-20" src={iconManualEntry} alt="icon" />
								<div className="text-white mt-4 text-lg">Manual Entry</div>
							</div>
						</div>
					</Link>
				</div>
			</div>
		</AppLayout>
	)
}