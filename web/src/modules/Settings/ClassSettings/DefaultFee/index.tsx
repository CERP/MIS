import React, { Component } from 'react'
import { connect } from 'react-redux'
import { mergeSettings } from 'actions'
import Former from 'utils/former'

import './../style.css'

interface P {
	classId: string
	settings: RootDBState["settings"]
	mergeSettings: (settings: RootDBState["settings"]) => void
}

type S = {
	fee: MISStudentFee
}


class DefaultFeeSettings extends Component<P, S> {

	former: Former
	constructor(props: P) {
		super(props)
		this.state = {
			fee: props.settings.classes.defaultFee[props.classId] || this.setDefaultFee()
		}

		this.former = new Former(this, [])

	}

	setDefaultFee = (): MISStudentFee => {
		return {
			name: "",
			type: "FEE",
			amount: "",
			period: "MONTHLY"
		}
	}

	isDisabled = (): boolean => {

		const amount = this.state.fee.amount.trim()
		const name = this.state.fee.name.trim()

		return amount.length === 0 || isNaN(parseFloat(amount)) || name.length === 0
	}

	onSaveDefaultFee = (): void => {

		if (this.isDisabled())
			return

		const amount = parseFloat(this.state.fee.amount)
		const settings = this.props.settings
		const class_id = this.props.classId

		let modified_settings: MISSettings

		if (settings && settings.classes) {
			modified_settings = {
				...settings,
				classes: {
					...settings.classes,
					defaultFee: {
						...settings.classes.defaultFee,
						[class_id]: {
							...this.state.fee,
							name: this.state.fee.name.trim(),
							amount: Math.abs(amount).toString()
						}
					}
				}
			}
		} else {
			modified_settings = {
				...settings,
				classes: {
					defaultFee: {
						[class_id]: {
							...this.state.fee,
							name: this.state.fee.name.trim(),
							amount: Math.abs(amount).toString() // fee must be absolute value
						}
					}
				}
			}
		}

		// updating MISSettings
		this.props.mergeSettings(modified_settings)
		alert("Default Fee has been added")
	}

	render() {
		const disabled = this.isDisabled()

		return <div className="class-settings">
			<div className="divider">Default Fee</div>
			<div className="section form default-fee">
				<div className="row">
					<label>Type</label>
					<input type="text" disabled value={this.state.fee.type} />
				</div>
				<div className="row">
					<label>Name</label>
					<input type="text" {...this.former.super_handle(["fee", "name"])} placeholder="Enter Name" />
				</div>
				<div className="row">
					<label>Amount</label>
					<input type="number" {...this.former.super_handle(["fee", "amount"])} placeholder="Enter Amount" />
				</div>
				<div className="row">
					<label>Fee Period</label>
					<input type="text" disabled value={this.state.fee.period} />
				</div>

				<div className="note-message"><span>Note:</span> This is default class fee (MONTHLY) which will be added to every newly created student</div>
				<div className={`button blue ${disabled ? 'disabled' : ''}`} onClick={this.onSaveDefaultFee}>Set Default Fee </div>

			</div>
		</div>
	}
}
export default connect(() => ({
}),
	(dispatch: Function) => ({
		mergeSettings: (settings: RootDBState["settings"]) => dispatch(mergeSettings(settings)),
	}))(DefaultFeeSettings);
