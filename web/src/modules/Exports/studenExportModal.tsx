import React, { useState, useMemo } from 'react'
import moment from 'moment'

import { downloadAsCSV } from 'utils/downloadCSV'

import './style.css'
import getSectionsFromClasses from 'utils/getSectionsFromClasses'

const CSVHeaders = [
	'Name',
	'BForm',
	'Gender',
	'Phone',
	'Active',
	'FatherName',
	'FatherCNIC',
	'Birthdate',
	'Address',
	'StartDate',
	'AdmissionNumber',
	'AlternatePhone',
	'BloodType',
	'Religion'
]

type PropsType = {
	students: RootDBState['students']
	classes: RootDBState['classes']
	onClose: () => void
}

const StudentExportModal: React.FC<PropsType> = ({ students, classes, onClose }) => {
	const [sectionID, setSectionID] = useState('')
	const [active, setActive] = useState(true)
	const sections = useMemo(() => getSectionsFromClasses(classes), [classes])

	const generateCSV = () => {
		// for filename
		let section_name = sectionID
			? sections.find(section => section.id === sectionID).namespaced_name
			: 'all-students'

		const csv_data = Object.values(students)
			.filter(student => {
				return (
					student &&
					student.Name &&
					active === student.Active &&
					(sectionID ? sectionID === student.section_id : true)
				)
			})
			.reduce((agg, curr) => {
				const dob = moment(curr.Birthdate).format('DD/MM/YYYY')

				return [
					...agg,
					{
						Name: curr.Name,
						BForm: curr.BForm || '',
						Gender: curr.Gender || '',
						Phone: curr.Phone || '',
						AlternatePhone: curr.AlternatePhone || '',
						Active: curr.Active ? 'Yes' : 'No',
						FatherName: curr.ManName || '',
						FatherCNIC: curr.ManCNIC || '',
						Birthdate: dob.toLowerCase() !== 'invalid date' ? dob : '',
						Address: curr.Address
							? curr.Address.split(',').join('-').split('#').join(' no. ')
							: '',
						StartDate: moment(curr.StartDate).format('DD/MM/YYYY') || '',
						AdmissionNumber: curr.AdmissionNumber || '',
						BloodType: curr.BloodType || '',
						Religion: curr.Religion || ''
					}
				]
			}, [])

		// download csv using papa parser
		downloadAsCSV(csv_data, CSVHeaders, section_name)
	}

	return (
		<div className="exports-modal w-full">
			<div className="close button red" onClick={onClose}>
				✕
			</div>
			<div className="title">Export Students</div>
			<div className="space-y-4">
				<div>Export all or single class students</div>
				<div className="row" style={{ marginTop: 5 }}>
					<select
						className="tw-select"
						autoFocus={true}
						onChange={e => setSectionID(e.target.value)}
						style={{ width: '100%' }}>
						<option value="">All Classes</option>
						{sections
							.sort((a, b) => a.classYear - b.classYear)
							.map(section => (
								<option key={section.id} value={section.id}>
									{' '}
									{section.namespaced_name}{' '}
								</option>
							))}
					</select>
				</div>
				<div className="flex flex-row items-center">
					<input
						className="form-checkbox text-teal-brand rounded w-5 h-5"
						type="checkbox"
						onChange={e => setActive(e.target.checked)}
						defaultChecked={active}></input>
					<label className="ml-2">Only Active</label>
				</div>
				<button className="tw-btn-blue w-full" onClick={generateCSV}>
					Export as CSV
				</button>
			</div>
		</div>
	)
}

export default StudentExportModal
