import React, { Component } from 'react'
import { smsIntentLink } from 'utils/intent'
import former from 'utils/former'
import ShareButton from 'components/ShareButton'
import { replaceSpecialCharsWithUTFChars } from 'utils/stringHelper'

class ToSingleTeacher extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		  selected_teacher_number: "",
		  text: ""
	  }

	  this.former = new former(this, [])
	}
	
	logSms = () =>{
		if(this.state.selected_teacher_number === ""){
			console.log("No Message to Log")
			return
		}
		const historyObj = {
			faculty: this.props.faculty_id,
			date: new Date().getTime(),
			type: "TEACHER",
			count: 1,
			text: this.state.text
		}

		this.props.logSms(historyObj)
	}

  render() {

	const { teachers, sendMessage, smsOption } = this.props;
	
	const sms_text =  replaceSpecialCharsWithUTFChars(this.state.text)
	
	return (
	<div>
		<div className="row">
			<label>Select Teacher</label>		
			<select {...this.former.super_handle(["selected_teacher_number"])}>
				{
					[<option key="abcd" value="" disabled>Select a Teacher</option>,
					...Object.entries(teachers)
					.filter(([id, teacher]) => teacher.Phone)
					.sort(([, a], [, b]) => a.Name.localeCompare(b.Name))
					.map(([id, teacher]) => <option key={id} value={teacher.Phone}>{teacher.Name}</option>)
					]
				}
			</select>
		</div>
		<div className="row">
			<label>Message</label>
			<textarea {...this.former.super_handle(["text"])} placeholder="Write text message here" />
		</div>
			{
				smsOption === "SIM" ? 
					<a href={smsIntentLink({
						messages: [{ number: this.state.selected_teacher_number, text: sms_text }],
						return_link: window.location.href 
						})} onClick={this.logSms} className="button blue">Send using Local SIM</a> :
				
					<div className="button" onClick={() => sendMessage( this.state.text, this.state.selected_teacher_number)}>Can only send using Local SIM</div>
			}
		<div className="is-mobile-only" style={{marginTop: 10}}>
			<ShareButton title={"SMS"} text={this.state.text} />
		</div>
	</div>
	)
  }
}
export default ToSingleTeacher