import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import { AppLayout } from 'components/Layout/appLayout'
import { DefaultExamGrades } from 'constants/index'
import { UploadImage } from 'components/image'
import { exportToJSON } from 'utils/indexedDb'
import { TModal } from 'components/Modal'
import { createMerges } from 'actions/core'
import StudentExportModal from 'modules/Exports/studenExportModal'
import toast from 'react-hot-toast'

type State = {
	templates: RootDBState['sms_templates']
	settings: MISSettings
	toggleExportModal: boolean
}

interface ExamGrade {
	grade: string
	percent: string
	remarks: string
}

function getDefaultSettings(): MISSettings {
	return {
		shareData: true,
		schoolName: '',
		schoolAddress: '',
		schoolPhoneNumber: '',
		schoolCode: '',
		schoolSession: {
			start_date: moment().startOf('year').unix() * 1000,
			end_date: moment().add(1, 'year').startOf('year').unix() * 1000
		},
		vouchersPerPage: '1',
		sendSMSOption: 'SIM', // API
		devices: {},
		exams: DefaultExamGrades,
		classes: {
			defaultFee: {},
			additionalFees: {},
			feeVoucher: {
				dueDays: '',
				feeFine: '',
				notice: '',
				bankInfo: {
					name: '',
					accountTitle: '',
					accountNo: ''
				},
				options: {
					showDueDays: false,
					showFine: false,
					showNotice: false,
					showBankInfo: false
				}
			}
		}
	}
}

const classFeeSettings = (settings: MISSettings): MISSettings['classes'] => {
	const defaultSettings = getDefaultSettings()

	return {
		additionalFees: {
			...(settings?.classes ?? defaultSettings.classes).additionalFees
		},
		defaultFee: {
			...(settings
				? (settings.classes || defaultSettings.classes).defaultFee
				: defaultSettings.classes.defaultFee)
		},
		feeVoucher: {
			...(settings?.classes ?? defaultSettings.classes).feeVoucher
		}
	}
}

const reconstructGradesObject = (settings: MISSettings): MISSettings['exams']['grades'] => {
	if (settings?.exams) {
		const grades_values = Object.values(settings.exams.grades)

		// check if new structure already exists
		if (typeof grades_values[0] === 'object') {
			return settings.exams.grades
		}

		// else construct new structure using previous information
		const grades = Object.entries(settings.exams.grades).reduce((agg, [grade, val]) => {
			return {
				...agg,
				[grade]: {
					percent: val,
					remarks: ''
				}
			}
		}, {})

		// return new grades structure
		return grades
	}

	// return default grades in case of settings don't have exams
	return DefaultExamGrades.grades
}

// @ts-ignore
const MIS_VERSION = window.version || 'no version'

export const Settings = () => {
	const dispatch = useDispatch()
	const { db, client_id } = useSelector((state: RootReducerState) => state)

	const defaultSettings = getDefaultSettings()
	const settings: MISSettings = {
		...(db.settings || defaultSettings),
		schoolSession: db.settings?.schoolSession ?? defaultSettings.schoolSession,
		devices: db.settings?.devices ?? {},
		exams: {
			...DefaultExamGrades,
			grades: {
				...reconstructGradesObject(db.settings)
			}
		},
		classes: classFeeSettings(db.settings)
	}

	const [state, setState] = useState<State>({
		templates: db.sms_templates,
		settings,
		toggleExportModal: false
	})

	useEffect(() => {
		setState(prevState => ({
			...prevState,
			settings: {
				...prevState.settings,
				...(db.settings || getDefaultSettings())
			}
		}))
	}, [db.settings])

	const handleRemoveLogo = () => {
		dispatch(
			createMerges([
				{
					path: ['db', 'assets', 'schoolLogo'],
					value: ''
				}
			])
		)

		toast.success('Logo has been removed')
	}

	const handleUploadLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files[0]
		const reader = new FileReader()

		if (!file) {
			return
		}

		reader.onloadend = () => {
			dispatch(
				createMerges([
					{
						path: ['db', 'assets', 'schoolLogo'],
						value: reader.result as string
					}
				])
			)

			toast.success('Logo has been updated')
		}
		reader.readAsDataURL(file)
	}

	return (
		<AppLayout title="School Profile">
			<div className="p-5 md:p-10 md:pb-0">
				<div className="text-2xl font-bold mt-4 mb-8 text-center">School Profile</div>
				<div className="text-white md:w-4/5 md:mx-auto space-y-4 rounded-2xl bg-gray-700 pb-6 my-4 md:mt-8">
					<div className="pt-2 flex flex-row mx-auto items-baseline justify-between w-3/5 md:w-1/4">
						<UploadImage
							src={db?.assets?.schoolLogo}
							handleImageChange={handleUploadLogo}
							removeImage={handleRemoveLogo}
						/>
					</div>
					<form
						id="staff-form"
						className="space-y-2 px-4 w-full md:w-3/5  mx-auto"
						onSubmit={() => console.log('hello')}>
						<div>School Name</div>
						<input
							type="text"
							value={state.settings.schoolName}
							className="tw-input w-full focus-within:bg-transparent"
							placeholder="Type school name"
						/>
						<div>School Phone</div>
						<input
							type="text"
							value={state.settings.schoolPhoneNumber}
							className="tw-input w-full focus-within:bg-transparent"
							placeholder="Type school phone "
						/>
						<div>School Address</div>
						<textarea
							rows={4}
							value={state.settings.schoolAddress}
							className="tw-input w-full focus-within:bg-transparent"
							placeholder="Type school address"
						/>
						<div className="flex w-full justify-between">
							<div className="space-y-2 w-1/2">
								<div>Session Start</div>
								<input
									name="start_date"
									type="date"
									defaultValue={moment(
										state.settings.schoolSession.start_date
									).format('YYYY-MM-DD')}
									className="pr-0 tw-input w-11/12 text-gray-500 focus-within:bg-transparent"
								/>
							</div>
							<div className="space-y-2 w-1/2">
								<div>Session End</div>
								<input
									name="end_date"
									type="date"
									defaultValue={moment(
										state.settings.schoolSession.end_date
									).format('YYYY-MM-DD')}
									className="mr-auto tw-input w-11/12 text-gray-500 focus-within:bg-transparent"
								/>
							</div>
						</div>
						<div>
							<button className="my-2 tw-btn-blue w-full">Save Profile</button>
						</div>
					</form>
					<div className="px-4 w-full md:w-3/5  mx-auto">
						<div className="flex flex-row justify-between">
							<div>Device Name</div>
							<div className="text-sm">
								{state.settings.devices[client_id] || 'not set'}
							</div>
						</div>
						<div className="flex flex-row justify-between">
							<div>MISchool Version</div>
							<div className="text-sm">{MIS_VERSION}</div>
						</div>
						<div className="flex flex-row justify-between">
							<div>Client ID</div>
							<div className="text-sm">{client_id?.split('-')?.[0]}</div>
						</div>
					</div>
					<div className="px-4 w-full md:w-3/5  mx-auto">
						<div className="text-lg mt-2 mb-4 font-semibold text-center">
							Package Information
						</div>
						<div className="flex flex-row justify-between">
							<div>Current Package</div>
							<div className="text-sm">not set</div>
						</div>
						<div className="flex flex-row justify-between">
							<div>Max Students</div>
							<div className="text-sm">{db.max_limit}</div>
						</div>
						<div className="flex flex-row justify-between">
							<div>Expiring on</div>
							<div className="text-sm">not set</div>
						</div>
					</div>

					<div className="px-4 w-full md:w-3/5  mx-auto">
						<div className="text-lg mt-2 mb-4 font-semibold text-center">
							Payment History
						</div>
						<div className="text-center text-red-brand">
							Need to discuss with Ilmx Team
						</div>
					</div>

					<div className="px-4 w-full md:w-3/5  mx-auto">
						<div className="text-lg mt-2 mb-4 font-semibold text-center">
							School Data
						</div>
						{state.toggleExportModal && (
							<TModal>
								<StudentExportModal
									students={db.students}
									classes={db.classes}
									onClose={() =>
										setState({
											...state,
											toggleExportModal: !state.toggleExportModal
										})
									}
								/>
							</TModal>
						)}
						<button
							onClick={exportToJSON}
							className="mb-2 tw-btn bg-orange-brand text-white w-full">
							Create Backup
						</button>
						<button
							onClick={() =>
								setState({ ...state, toggleExportModal: !state.toggleExportModal })
							}
							className="tw-btn-blue w-full">
							Export to CSV
						</button>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
