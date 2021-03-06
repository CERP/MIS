import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'

import { createTemplateMerges } from 'actions'
import { mergeSettings, addLogo } from 'actions'
import Former from 'utils/former'
import Layout from 'components/Layout'
import Banner from 'components/Banner'
import moment from 'moment'
import { openDB } from 'idb'
import { isMobile, hideScroll, showScroll, getIlmxUser } from 'utils/helpers'
import StudentExportModal from 'modules/Exports/studenExportModal'
import Modal from 'components/Modal'

//import newBadge from "Landing/icons/New/new.svg";

import './style.css'

interface P {
	client_id: string
	settings: RootDBState['settings']
	students: RootDBState['students']
	classes: RootDBState['classes']
	user: RootDBState['faculty']['MISTeacher']
	sms_templates: RootDBState['sms_templates']
	schoolLogo: string
	max_limit: number
	unsyncd: number
	ilmxUser: string

	saveTemplates: (templates: RootDBState['sms_templates']) => void
	saveSettings: (settings: RootDBState['settings']) => void
	addLogo: (logo_string: string) => void
}
interface S {
	templates: RootDBState['sms_templates']
	settings: RootDBState['settings']
	templateMenu: boolean
	gradeMenu: boolean
	banner: {
		active: boolean
		good?: boolean
		text?: string
	}
	client_id: string
	schoolLogo: string
	addGrade: boolean
	newGrade: NewGrade
	toggleMoreSettings: boolean
	toggleExportModal: boolean
}
interface NewGrade {
	grade: string
	percent: string
	remarks: string
}

type propsType = RouteComponentProps & P

export const defaultExams = {
	grades: {
		'A+': {
			percent: '90',
			remarks: 'Excellent'
		},
		A: {
			percent: '80',
			remarks: 'Good'
		},
		'B+': {
			percent: '70',
			remarks: 'Satisfactory'
		},
		B: {
			percent: '65',
			remarks: 'Must work hard'
		},
		'C+': {
			percent: '60',
			remarks: 'Poor, work hard'
		},
		C: {
			percent: '55',
			remarks: 'Very poor'
		},
		D: {
			percent: '50',
			remarks: 'Very very poor'
		},
		F: {
			percent: '40',
			remarks: 'Fail'
		}
	}
}

function getDefaultSettings(): RootDBState['settings'] {
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
		exams: defaultExams,
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
class Settings extends Component<propsType, S> {
	former: Former
	constructor(props: propsType) {
		super(props)

		const aggGrades = this.reconstructGradesObject()

		const defaultSettings = getDefaultSettings()
		const settings = {
			...(props.settings || defaultSettings),
			schoolSession: props.settings
				? props.settings.schoolSession || defaultSettings.schoolSession
				: defaultSettings.schoolSession,
			devices: props.settings ? props.settings.devices || {} : {},
			exams: {
				...defaultExams,
				grades: {
					...aggGrades
				}
			},
			classes: this.classFeeSettings()
		} as RootDBState['settings']

		this.state = {
			templates: this.props.sms_templates,
			settings,
			templateMenu: false,
			gradeMenu: false,
			banner: {
				active: false,
				good: true,
				text: 'Saved!'
			},
			client_id: this.props.client_id,
			schoolLogo: props.schoolLogo,
			addGrade: false,
			newGrade: {
				grade: '',
				percent: '',
				remarks: ''
			},
			toggleMoreSettings: false,
			toggleExportModal: false
		}

		this.former = new Former(this, [])
	}

	reconstructGradesObject = () => {
		if (this.props.settings && this.props.settings.exams) {
			const grades_values = Object.values(this.props.settings.exams.grades)

			// check if new structure already exists
			if (typeof grades_values[0] === 'object') {
				return this.props.settings.exams.grades
			}

			// else construct new structure using previous information
			const grades = Object.entries(this.props.settings.exams.grades).reduce(
				(agg, [grade, val]) => {
					return {
						...agg,
						[grade]: {
							percent: val,
							remarks: ''
						}
					}
				},
				{}
			)

			// return new grades structure
			return grades
		}

		// return default grades in case of settings don't have exams
		return defaultExams.grades
	}

	classFeeSettings = (): RootDBState['settings']['classes'] => {
		const { settings } = this.props

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

	toggleExportModal = () => {
		this.setState({
			toggleExportModal: !this.state.toggleExportModal
		})

		hideScroll()
	}

	onCloseExportModal = () => {
		this.setState({
			toggleExportModal: false
		})

		showScroll()
	}

	changeSMStemplates = () => {
		return (
			<div>
				<div className="divider">Attendance Template</div>
				<div className="section">
					<div className="row">
						<div>
							Use <code>$NAME</code> to insert the student's name.
						</div>
					</div>
					<div className="row">
						<div>
							Use <code>$FNAME</code> to insert the student's father name.
						</div>
					</div>
					<div className="row">
						<div>
							Use <code>$STATUS</code> to insert the attendance status.
						</div>
					</div>
					<div className="row">
						<label>Attendance Template</label>
						<textarea
							{...this.former.super_handle(['templates', 'attendance'])}
							placeholder="Enter SMS template here"
						/>
					</div>
				</div>

				<div className="divider">Fees Template</div>
				<div className="section">
					<div className="row">
						<div>
							Use <code>$NAME</code> to insert the student's name.
						</div>
					</div>
					<div className="row">
						<div>
							Use <code>$FNAME</code> to insert the student's father name.
						</div>
					</div>
					<div className="row">
						<div>
							Use <code>$AMOUNT</code> to insert the fee amount.
						</div>
					</div>
					<div className="row">
						<div>
							Use <code>$BALANCE</code> to insert the total fee balance.
						</div>
					</div>
					<div className="row">
						<label>Fees Template</label>
						<textarea
							{...this.former.super_handle(['templates', 'fee'])}
							placeholder="Enter SMS template here"
						/>
					</div>
				</div>

				<div className="divider">Result/Report Template</div>
				<div className="section">
					<div className="row">
						<div>
							Use <code>$NAME</code> to insert the student's name.
						</div>
					</div>
					<div className="row">
						<div>
							Use <code>$FNAME</code> to insert the student's father name.
						</div>
					</div>
					<div className="row">
						<div>
							Use <code>$REPORT</code> to send report line by line.
						</div>
					</div>
					<div className="row">
						<label>Result/Report Template</label>
						<textarea
							{...this.former.super_handle(['templates', 'result'])}
							placeholder="Enter SMS template here"
						/>
					</div>
				</div>
			</div>
		)
	}

	gradeMenu = () => {
		const { exams } = this.state.settings
		return (
			<div className="grade-menu">
				{Object.entries(exams.grades).map(([grade, curr]) => {
					return (
						<div key={grade} className="row">
							<label> {grade} </label>
							<div className="editable-row">
								<input
									type="text"
									{...this.former.super_handle([
										'settings',
										'exams',
										'grades',
										grade,
										'remarks'
									])}
								/>
								<input
									type="number"
									{...this.former.super_handle([
										'settings',
										'exams',
										'grades',
										grade,
										'percent'
									])}
								/>
								<div className="button red" onClick={() => this.removeGrade(grade)}>
									x
								</div>
							</div>
						</div>
					)
				})}

				{!this.state.addGrade && (
					<div className="row">
						<div
							className="button green"
							onClick={() => this.setState({ addGrade: !this.state.addGrade })}>
							+
						</div>
					</div>
				)}

				{this.state.addGrade && (
					<div className="add-grade section">
						<div className="divider">New Grade</div>
						<div className="row">
							<label>Grade</label>
							<input
								type="text"
								{...this.former.super_handle(['newGrade', 'grade'])}
							/>
						</div>
						<div className="row">
							<label>Percent</label>
							<input
								type="number"
								{...this.former.super_handle(['newGrade', 'percent'])}
							/>
						</div>
						<div className="row">
							<label>Remarks</label>
							<input
								type="text"
								{...this.former.super_handle(['newGrade', 'remarks'])}
							/>
						</div>
						<div className="row">
							<div className="button green" onClick={() => this.addGrade()}>
								+
							</div>
						</div>
					</div>
				)}
			</div>
		)
	}

	addGrade = () => {
		const newGrade = this.state.newGrade

		if (!newGrade.grade || !newGrade.percent) {
			this.setState({
				banner: {
					active: true,
					good: false,
					text: 'Please Fill all fields !'
				}
			})

			setTimeout(() => {
				this.setState({
					banner: {
						active: false
					}
				})
			}, 1000)

			return
		}

		this.setState({
			settings: {
				...this.state.settings,
				exams: {
					...this.state.settings.exams,
					grades: {
						...this.state.settings.exams.grades,
						[newGrade.grade]: {
							percent: newGrade.percent,
							remarks: newGrade.remarks
						}
					}
				}
			},
			addGrade: false,
			newGrade: {
				grade: '',
				percent: '',
				remarks: ''
			}
		})
	}
	removeGrade = (x: string) => {
		const { grades } = this.state.settings.exams

		const { [x]: removed, ...rest } = grades

		this.setState({
			settings: {
				...this.props.settings,
				exams: {
					...this.state.settings.exams,
					grades: rest
				}
			}
		})
	}

	onSave = () => {
		this.props.saveSettings(this.state.settings)
		this.props.saveTemplates(this.state.templates)
		if (this.state.schoolLogo === '' || this.state.schoolLogo !== this.props.schoolLogo) {
			this.props.addLogo(this.state.schoolLogo)
		}
		this.setState({ templateMenu: false })

		this.setState({
			banner: {
				active: true,
				good: true,
				text: 'Saved!'
			}
		})

		setTimeout(() => this.setState({ banner: { active: false } }), 2000)
	}
	onLogoRemove = () => {
		this.setState({
			schoolLogo: ''
		})
		this.props.addLogo('')
		this.setState({
			banner: {
				active: true,
				good: false,
				text: 'Logo Removed!'
			}
		})

		setTimeout(() => this.setState({ banner: { active: false } }), 2000)
	}

	logoHandler = (e: any) => {
		const file = e.target.files[0]
		const reader = new FileReader()

		reader.onloadend = () => {
			this.setState({
				schoolLogo: reader.result as string
			})
		}
		reader.readAsDataURL(file)
	}

	UNSAFE_componentWillReceiveProps(nextProps: propsType) {
		console.log(nextProps)

		const settings = {
			...(nextProps.settings || getDefaultSettings()),
			devices: nextProps.settings ? nextProps.settings.devices || {} : {}
		} as RootDBState['settings']

		this.setState({
			settings
		})
	}
	onExport = async () => {
		if (!window.confirm('Are you sure, you want to export data to your device?')) {
			return
		}
		try {
			const db = await openDB('db', 1, {
				upgrade(db) {
					db.createObjectStore('root-state')
				}
			})

			const IdbData = await db.get('root-state', 'db')

			if (IdbData) {
				console.log('Exporting From idb')

				const a = document.createElement('a')
				const client_id = localStorage.getItem('client_id')

				a.href = URL.createObjectURL(
					new Blob([JSON.stringify(IdbData)], { type: 'text/json' })
				)
				a.download = `mischool_export_idb_${client_id}_${moment().format(
					'DD-MM-YYYY'
				)}.json`
				a.click()
			} else {
				const db = localStorage.getItem('backup')

				if (db) {
					console.log('Exporting From ls')
					const a = document.createElement('a')
					const client_id = localStorage.getItem('client_id')

					a.href = URL.createObjectURL(new Blob([db], { type: 'text/json' }))
					a.download = `mischool_export_${client_id}_${moment().format(
						'DD-MM-YYYY'
					)}.json`
					a.click()
				}
			}
		} catch (err) {
			console.error('Export', err)
		}
	}

	toggleMoreSettings = () => {
		this.setState({ toggleMoreSettings: !this.state.toggleMoreSettings })
	}

	render() {
		const studentLength = Object.values(this.props.students).filter(
			x =>
				x.Name &&
				x.Active &&
				(x.tags ? !x.tags['PROSPECTIVE'] && !x.tags['FINISHED_SCHOOL'] : true)
		).length

		//@ts-ignore
		const mis_version = window.version || 'no version set'

		return (
			<Layout history={this.props.history}>
				<div className="settings" style={{ width: '100%' }}>
					{this.state.banner.active ? (
						<Banner isGood={this.state.banner.good} text={this.state.banner.text} />
					) : (
						false
					)}

					<div className="title">Settings</div>

					<div className="section-container form">
						{isMobile() && (
							<div className="row">
								<label>MISchool SMS Companion App</label>
								<a
									className="button green"
									href="https://github.com/CERP/MIS/raw/master/android/app/release/app-release.apk">
									Download Android App
								</a>
							</div>
						)}

						<div className="row">
							<img
								className="school logo"
								src={this.state.schoolLogo}
								style={{ borderRadius: this.state.schoolLogo ? 15 : '0.25rem' }}
								alt={'No Logo Found'}
							/>
						</div>

						<div className="row">
							<label>School Logo</label>
							{this.state.schoolLogo === '' ? (
								<div className="badge-container">
									<div className="file-container button green">
										<div>Select A Logo</div>
										<input type="file" onChange={this.logoHandler} />
									</div>
								</div>
							) : (
								<div className="button red" onClick={this.onLogoRemove}>
									{' '}
									Remove{' '}
								</div>
							)}
						</div>
						<div className="row">
							<label>School Name</label>
							<input
								type="text"
								{...this.former.super_handle(['settings', 'schoolName'])}
								placeholder="School Name"
							/>
						</div>

						<div className="row">
							<label>School Address</label>
							<input
								type="text"
								{...this.former.super_handle(['settings', 'schoolAddress'])}
								placeholder="School Address"
							/>
						</div>

						<div className="row">
							<label>School Phone Number</label>
							<input
								type="text"
								{...this.former.super_handle(['settings', 'schoolPhoneNumber'])}
								placeholder="School Phone Number"
							/>
						</div>
						{this.props.ilmxUser && (
							<div
								style={{ marginTop: '1.25rem', marginBottom: '1rem' }}
								className="button blue"
								onClick={this.toggleMoreSettings}>
								{this.state.toggleMoreSettings
									? 'Hide more Settings'
									: 'Show more Settings'}
							</div>
						)}
						{(this.props.ilmxUser ? this.state.toggleMoreSettings : true) && (
							<>
								<div className="row">
									<label>School Code (Optional)</label>
									<input
										type="text"
										{...this.former.super_handle(['settings', 'schoolCode'])}
										placeholder="School Code"
									/>
								</div>

								<div className="row">
									<label>School Session Start Period</label>
									<input
										type="date"
										{...this.former.super_handle([
											'settings',
											'schoolSession',
											'start_date'
										])}
										value={moment(
											this.state.settings.schoolSession.start_date
										).format('YYYY-MM-DD')}
										placeholder="session start"
									/>
								</div>
								<div className="row">
									<label>School Session End Period</label>
									<input
										type="date"
										{...this.former.super_handle([
											'settings',
											'schoolSession',
											'end_date'
										])}
										value={moment(
											this.state.settings.schoolSession.end_date
										).format('YYYY-MM-DD')}
										placeholder="session end"
									/>
								</div>

								<div className="row">
									<label>SMS Option</label>
									<select
										{...this.former.super_handle([
											'settings',
											'sendSMSOption'
										])}>
										<option value="">Select SMS Option</option>
										<option value="SIM">Send SMS from Local SIM Card</option>
										<option value="API" disabled>
											Send SMS from API
										</option>
									</select>
								</div>
								<div className="row">
									<label>Data Sharing</label>
									<select
										{...this.former.super_handle(['settings', 'shareData'])}>
										<option value="true">Yes</option>
										<option value="false">No</option>
									</select>
								</div>

								<div className="row">
									<label>Device Name</label>
									<input
										type="text"
										{...this.former.super_handle([
											'settings',
											'devices',
											this.state.client_id
										])}
										placeholder="Device Name"
									/>
								</div>

								<div className="row">
									<label>MISchool Version</label>
									<label>{mis_version}</label>
								</div>

								<div className="row">
									<label>Client Id</label>
									<label>{this.state.client_id}</label>
								</div>

								<div className="row">
									<label>Student Limit</label>
									<label>
										{this.props.max_limit >= 0
											? `${studentLength} out of ${this.props.max_limit}`
											: 'Unlimited'}
									</label>
								</div>

								{!this.props.ilmxUser && (
									<div
										className="button grey"
										onClick={() =>
											this.setState({
												templateMenu: !this.state.templateMenu
											})
										}>
										Change SMS Templates
									</div>
								)}
							</>
						)}
						{this.state.templateMenu ? this.changeSMStemplates() : false}
						{this.props.user.Admin && !this.props.ilmxUser && (
							<div
								className="button grey"
								onClick={() => this.setState({ gradeMenu: !this.state.gradeMenu })}>
								Grade Settings
							</div>
						)}
						{this.state.gradeMenu && this.gradeMenu()}
						{!this.props.ilmxUser && (
							<>
								<Link className="button grey" to="settings/class">
									Fee Voucher Settings
								</Link>
								<Link className="button grey" to="/settings/promote">
									Promote Students
								</Link>
								<Link className="button grey" to="/settings/excel-import/students">
									Import From Excel
								</Link>
							</>
						)}
						{this.props.user.Admin && !this.props.ilmxUser ? (
							<>
								<div className="button grey" onClick={() => this.onExport()}>
									Export school data to File{' '}
								</div>
								<div
									className="button grey"
									onClick={() => this.toggleExportModal()}>
									{' '}
									Export students data to CSV
								</div>
								{this.state.toggleExportModal && (
									<Modal>
										<StudentExportModal
											students={this.props.students}
											classes={this.props.classes}
											onClose={this.onCloseExportModal}
										/>
									</Modal>
								)}
							</>
						) : (
							false
						)}
					</div>
					<div
						className="button save"
						onClick={this.onSave}
						style={{ marginTop: '15px', marginRight: '5%', alignSelf: 'flex-end' }}>
						Save
					</div>
				</div>
			</Layout>
		)
	}
}

export default connect(
	(state: RootReducerState) => ({
		client_id: state.client_id,
		settings: state.db.settings,
		students: state.db.students,
		classes: state.db.classes,
		user: state.db.faculty[state.auth.faculty_id],
		sms_templates: state.db.sms_templates,
		schoolLogo: state.db.assets ? state.db.assets.schoolLogo || '' : '',
		max_limit: state.db.max_limit || -1,
		unsyncd: Object.keys(state.queued.mutations || {}).length,
		ilmxUser: getIlmxUser()
	}),
	(dispatch: Function) => ({
		saveTemplates: (templates: RootDBState['sms_templates']) =>
			dispatch(createTemplateMerges(templates)),
		saveSettings: (settings: RootDBState['settings']) => dispatch(mergeSettings(settings)),
		addLogo: (logo_string: string) => dispatch(addLogo(logo_string))
	})
)(Settings)
