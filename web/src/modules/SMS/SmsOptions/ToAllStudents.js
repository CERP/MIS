import React, { Component } from 'react'
import { smsIntentLink } from 'utils/intent'
import former from 'utils/former'


export default class ToAllStudents extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		  text: ""
	  }

	  this.former = new former(this, [])
	}
	
  render() {

	const { students, sendBatchMessages, smsOption } = this.props;
	console.log(smsOption)

	const messages = Object.values(students).filter(s => s.Phone !== undefined && s.Phone !== "")
										.reduce((agg,student)=> {
											const index  = agg.findIndex(s => s.number === student.Phone)		
											if(index >= 0 ){
												return agg
											}

											return [...agg,{
												number: student.Phone,
												text : this.state.text
											}]
										}, [])
										
	console.log(messages)
	return (
		<div>
			<div className="row">
				<label>Message</label>
				<textarea {...this.former.super_handle(["text"])} placeholder="Write text message here" />
			</div> 
				{ smsOption === "SIM" ? 
					<a href={smsIntentLink({
						messages,
						return_link: window.location.href 
					})} className="button blue">Send using Local SIM</a> : 
					<div className="button" onClick={() => sendBatchMessages(messages)}>Can Only send using Local SIM</div> }
		</div>
		)
  }
}

