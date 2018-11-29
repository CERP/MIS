import React, { Component } from 'react'
import { smsIntentLink } from 'utils/intent'

import '../style.css'
import former from 'utils/former'


export default class ToAllTeachers extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		  text: ""
	  }

	  this.former = new former(this, [])
	}
	
  render() {

	const { teachers, sendMessage } = this.props;
	
	const message = { messages : [ teachers.filter(teacher => {teacher.Phone !== undefined && student.Phone !== ""})
						.map(T => [{ number: T.Phone, text : this.state.text }])
					]
				}

	return (
			<div>
				<div className="row">
					<label>Message</label>
					<textarea {...this.former.super_handle(["text"])} placeholder="Write text message here" />
				</div> 
					{ !this.props.connected ? 
						<div className="button" onClick={sendMessage}>Send</div> : 
						<a href={smsIntentLink({
							message,
							return_link: window.location.href 
							})} className="button blue">Send using Local SIM</a> }
			</div>
		)
  }
}

