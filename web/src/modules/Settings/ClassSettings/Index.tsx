import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router'
import Layout from 'components/Layout'
import Banner from 'components/Banner'
import Former from 'utils/former'
import { connect } from 'react-redux'
import { mergeSettings } from 'actions'

import './style.css'

interface P {
    classes: RootDBState["classes"]
    settings: RootDBState["settings"]

    mergeSettings: (settings: RootDBState["settings"]) => void
}

type S = {
    selected_class_id: string
    disabled: boolean
    fee: MISStudentFee
    banner: {
        active: boolean
        good?: boolean
        text?: string
    }
    is_default_fee: boolean
    is_fee_voucher: boolean
} & MISSettings["classes"]["feeVoucher"]

type propsType = RouteComponentProps & P

class ClassSettings extends Component<propsType, S> {

    former: Former
    constructor(props: propsType) {
        super(props)

        const settings = this.props.settings
        const feeVoucher = settings.classes && settings.classes.feeVoucher ? settings.classes.feeVoucher : this.setFeeVoucherSetings()

        this.state = {
            fee: this.setDefaultFee(),
            selected_class_id: "",
            disabled: true,
            banner: {
                active: false,
                good: false,
                text: ""
            },
            ...feeVoucher,
            is_default_fee: true,
            is_fee_voucher: false
        }

        this.former = new Former(this, [])
    }

    setDefaultFee = () => {

        const default_fee = {
            name: "",
            type: "FEE",
            amount: "",
            period: "MONTHLY"
        } as MISStudentFee

        return default_fee
    }

    setFeeVoucherSetings = () => {
        return {
            dueDays: "",
            feeFine: "",
            notice: "",
            bankInfo: {
                name: "",
                accountTitle: "",
                accountNo: ""
            }
        } as MISSettings["classes"]["feeVoucher"]
    }

    onSectionChange = () => {

        const settings = this.props.settings
        const class_id = this.state.selected_class_id

        if (settings.classes && settings.classes.defaultFee[class_id]) {
            this.setState({
                fee: settings.classes.defaultFee[class_id]
            })
        } else {

            this.setState({
                fee: this.setDefaultFee()
            })
        }

        // in case class not selected
        this.checkFieldsFill()
    }

    checkFieldsFill = (): void => {

        const amount = this.state.fee.amount.trim()
        const name = this.state.fee.name.trim()

        if (amount.length > 0 && name.length > 0 && this.state.selected_class_id !== "") {
            this.setState({ disabled: false })
        } else {
            this.setState({ disabled: true })
        }
    }

    onSaveDefaultFee = (): void => {

        // if any field has invalid value
        if (this.state.disabled)
            return

        const amount = parseFloat(this.state.fee.amount)
        const settings = this.props.settings
        const class_id = this.state.selected_class_id

        let modified_settings: MISSettings

        if (isNaN(amount)) {
            alert("Please enter valid amount")
            return
        }

        if (settings.classes) {
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
                    ...settings.classes,
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

        this.setState({
            banner: {
                active: true,
                good: true,
                text: "Default Fee has been saved!"
            }
        })

        // updating MISSettings
        this.props.mergeSettings(modified_settings)

        setTimeout(() => this.setState({ banner: { active: false } }), 3000)

    }

    onSaveFeeVoucher = (): void => {

        const { dueDays, feeFine, notice, bankInfo } = this.state
        const settings = this.props.settings

        let modified_settings: MISSettings

        if (settings && settings.classes) {
            modified_settings = {
                ...settings,
                classes: {
                    ...settings.classes,
                    feeVoucher: {
                        dueDays,
                        feeFine,
                        notice,
                        bankInfo
                    }
                }
            }
        } else {
            modified_settings = {
                ...settings,
                classes: {
                    defaultFee: {},
                    feeVoucher: {
                        dueDays,
                        feeFine,
                        notice,
                        bankInfo
                    }
                }
            }
        }

        this.setState({
            banner: {
                active: true,
                good: true,
                text: "Voucher Settings has been saved!"
            }
        })

        // updating MISSettings
        this.props.mergeSettings(modified_settings)

        setTimeout(() => this.setState({ banner: { active: false } }), 3000)
    }

    showDefaultFeeSection = () => {
        this.setState({ is_default_fee: true }, () => {
            this.setState({ is_fee_voucher: false })
        })
    }

    showDefaultFeeVoucherSection = () => {
        this.setState({ is_fee_voucher: true }, () => {
            this.setState({ is_default_fee: false })
        })
    }

    render() {
        const { is_default_fee, is_fee_voucher } = this.state
        const { classes } = this.props

        return <Layout history={this.props.history}>
            <div className="class-settings">
                {this.state.banner.active ? <Banner isGood={this.state.banner.good} text={this.state.banner.text} /> : false}
                <div className="row tags" style={{ marginTop: 10 }}>
                    <div className={`button ${is_default_fee ? 'blue' : 'grey'}`} style={{ margin: 10 }} onClick={this.showDefaultFeeSection}>Default Fee</div>
                    <div className={`button ${is_fee_voucher ? 'blue' : 'grey'}`} style={{ margin: 10 }} onClick={this.showDefaultFeeVoucherSection}>Fee Voucher</div>
                </div>
                {is_default_fee && <>
                    <div className="divider">Default Fee</div>
                    <div className="section form default-fee">
                        <div className="row">
                            <label>Class</label>
                            <select {...this.former.super_handle(["selected_class_id"], () => true, () => this.onSectionChange())}>
                                <option value="">Select Class</option>
                                {
                                    Object.values(classes)
                                        .sort((a, b) => a.classYear - b.classYear)
                                        .map((mis_class: MISClass) =>
                                            <option key={mis_class.id} value={mis_class.id}>
                                                {mis_class.name}
                                            </option>)
                                }
                            </select>
                        </div>
                    </div>
                    <div className="section form default-fee">
                        <div className="row">
                            <label>Type</label>
                            <input type="text" disabled value={this.state.fee.type} />
                        </div>
                        <div className="row">
                            <label>Name</label>
                            <input type="text" {...this.former.super_handle(["fee", "name"], () => true, () => this.checkFieldsFill())} placeholder="Enter Name" />
                        </div>
                        <div className="row">
                            <label>Amount</label>
                            <input type="number" {...this.former.super_handle(["fee", "amount"], () => true, () => this.checkFieldsFill())} placeholder="Enter Amount" />
                        </div>
                        <div className="row">
                            <label>Fee Period</label>
                            <input type="text" disabled value={this.state.fee.period} />
                        </div>

                        <div className="note-message"><span>Note:</span> This is default class fee (MONTHLY) which will be added to every newly created student</div>

                        <div className={`button blue ${this.state.disabled ? 'disabled' : ''}`} onClick={this.onSaveDefaultFee}>Set Default Fee </div>
                    </div>
                </>
                }
                {is_fee_voucher && <>
                    <div className="divider">Fee Voucher</div>
                    <div className="section form fee-voucher">
                        <div className="row">
                            <label>No. of Fee due Days</label>
                            <input type="number" {...this.former.super_handle(["dueDays"])}
                                placeholder="e.g. 2 days after first of each month" />
                        </div>
                        <div className="row">
                            <label>Late Fee Fine</label>
                            <input type="number"{...this.former.super_handle(["fineFine"])}
                                placeholder="e.g. Rs. 10 per day" />
                        </div>
                        <div className="row">
                            <label>Fee Notice</label>
                            <textarea {...this.former.super_handle(["notice"])}
                                placeholder="School fee notice for the students" style={{ borderRadius: 4 }} />
                        </div>
                        <div>
                            <fieldset>
                                <legend>Bank Information</legend>
                                <div className="row">
                                    <label>Bank Name</label>
                                    <input type="text" {...this.former.super_handle(["bankInfo", "name"])}
                                        placeholder="e.g. HBL" />
                                </div>
                                <div className="row">
                                    <label>Account Title</label>
                                    <input type="text" {...this.former.super_handle(["bankInfo", "accountTitle"])}
                                        placeholder="e.g. MISCHOOL" />
                                </div>
                                <div className="row">
                                    <label>Account No</label>
                                    <input type="text" {...this.former.super_handle(["bankInfo", "accountNo"])}
                                        placeholder="e.g. 01782338901" />
                                </div>
                            </fieldset>
                        </div>
                        <div className="button blue" style={{ marginTop: 10 }} onClick={this.onSaveFeeVoucher}>Save</div>
                    </div>
                </>
                }
            </div>
        </Layout>
    }
}
export default connect((state: RootReducerState) => ({
    classes: state.db.classes,
    settings: state.db.settings
}), (dispatch: Function) => ({
    mergeSettings: (settings: RootDBState["settings"]) => dispatch(mergeSettings(settings)),
}))(ClassSettings)