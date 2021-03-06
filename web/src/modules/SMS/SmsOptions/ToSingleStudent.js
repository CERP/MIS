import React, { Component } from 'react'
import { smsIntentLink } from 'utils/intent'
import former from 'utils/former'
import { replaceSpecialCharsWithUTFChars } from 'utils/stringHelper'
import ShareButton from 'components/ShareButton'

class ToSingleStudent extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected_student_number: "",
			text: ""
		}

		this.former = new former(this, [])
	}

	logSms = () => {

		if (this.state.selected_student_number === "") {
			console.log("No Message to Log")
			return
		}

		const historyObj = {
			faculty: this.props.faculty_id,
			date: new Date().getTime(),
			type: "STUDENT",
			count: 1,
			text: this.state.text
		}

		this.props.logSms(historyObj)
	}

	render() {

		const { students, sendMessage, smsOption } = this.props;

		// const text_string = portal_link ? `${this.state.text}\n${portal_link}${student.id}` : this.state.text

		const sms_text = replaceSpecialCharsWithUTFChars(this.state.text)

		return (
			<div>

				<div className="row">
					<label>Select Student</label>
					<datalist id="student-list">
						{[...Object.entries(students)
							.filter(([, student]) => (student && student.id && student.Name && student.section_id && (student.tags === undefined || !student.tags["PROSPECTIVE"])) && student.Phone)
							.sort(([, a], [, b]) => a.Name.localeCompare(b.Name))
							.map(([id, student]) => <option key={id} value={student.Phone}>{student.Name}</option>)
						]}
					</datalist>
					<input list="student-list" {...this.former.super_handle(["selected_student_number"])} placeholder="Select Student" />
				</div>

				<div className="row">
					<label>Message</label>
					<textarea {...this.former.super_handle(["text"])} placeholder="Write text message here" />
				</div>
				{
					smsOption === "SIM" ?
						<a href={this.state.selected_student_number && smsIntentLink({
							messages: [{ number: this.state.selected_student_number, text: sms_text }],
							return_link: window.location.href
						})} onClick={this.logSms} className="button blue">Send using Local SIM</a> :

						<div className="button" onClick={() => sendMessage(this.state.text, this.state.selected_student_number)}>Send</div>
				}
				<div className="is-mobile-only" style={{ marginTop: 10 }}>
					<ShareButton title={"SMS"} text={this.state.text} />
				</div>
			</div>
		)
	}
}
export default ToSingleStudent