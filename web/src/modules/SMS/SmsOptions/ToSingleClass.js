import React, { Component } from 'react'
import { smsIntentLink } from 'utils/intent'

import {getSectionsFromClasses} from 'utils/getSectionsFromClasses'

import former from 'utils/former'
import ShareButton from 'components/ShareButton'
import { replaceSpecialCharsWithUTFChars } from 'utils/stringHelper'


class ToSingleClass extends Component {
	constructor(props) {
		super(props)
		
		this.state = {
			selected_section_id: "",
			selected_student_number: "",
			text: ""
		}

		this.former = new former(this, [])
	}

	logSms = (messages) => {
		if(messages.length === 0){
			console.log("No Messaged to Log")
			return
		}
		const historyObj = {
			faculty: this.props.faculty_id,
			date: new Date().getTime(),
			type: "CLASS",
			count: messages.length,
			text: this.state.text
		}

		this.props.logSms(historyObj)
	}

	getMessages = () => {

		const { students, portal_link } = this.props

		const messages = Object.values(students)
			.filter(s => s.section_id === this.state.selected_section_id && (s.tags === undefined || !s.tags["PROSPECTIVE"]) && s.Phone)
			.reduce((agg,student)=> {
					const index  = agg.findIndex(s => s.number === student.Phone)		
					if(index >= 0 ){
						return agg
				}

				const text_string = portal_link ? `${this.state.text}\nName: ${student.Name}\nStudent portal link: ${portal_link}${student.id}` 
					: replaceSpecialCharsWithUTFChars (this.state.text)

				return [...agg,{
					number: student.Phone,
					text:  text_string
				}]

			}, [])

		return messages
	}

	render() {

	const { classes, sendBatchMessages, smsOption } = this.props;

	const messages = this.getMessages()
	
	return (
			<div>
				<div className="row">
					<label>Select Class/Section</label>		
						<select {...this.former.super_handle(["selected_section_id"])}>
									{
										[<option key="abcd" value="" disabled>Select Section</option>,
										...Object.entries(getSectionsFromClasses(classes))
										.sort(([, a], [, b]) => (a.classYear || 0) - (b.classYear || 0))
										.map(([id, C]) => <option key={id} value={C.id}>{C.namespaced_name}</option>)
										]
									}
						</select>
				</div>
				<div className="row">
					<label>Message</label>
					<textarea {...this.former.super_handle(["text"])} placeholder="Write text message here" />
				</div>
					{ smsOption === "SIM" ? 
						<a href={smsIntentLink({
							messages,
							return_link: window.location.href 
							})} onClick={() => this.logSms(messages)} className="button blue">Send using Local SIM</a> 
							: <div className="button" onClick={() => sendBatchMessages(messages)}>Send</div>
					}
				<div className="is-mobile-only" style={{marginTop: 10}}>
					<ShareButton title={"SMS"} text={this.state.text} />
				</div>
			</div>
		)
	}
}

export default ToSingleClass