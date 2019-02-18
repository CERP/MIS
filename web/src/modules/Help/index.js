import React, { Component } from 'react'
import Layout from 'components/Layout'
import {connect} from  'react-redux'
import former from 'utils/former'
import { smsIntentLink } from 'utils/intent'
import {logSms} from 'actions'
import {sendSMS} from 'actions/core'



class Help extends Component {
    constructor(props) {
      super(props)    
      
      this.state = {
        text: ""
      }

      this.former = new former(this, [])
    }

    logSms = () =>{
      const historyObj = {
        faculty: this.props.faculty_id,
        date: new Date().getTime(),
        type: "HELP",
        count: 1,
        text: this.state.text
      }
  
      this.props.logSms(historyObj)
    }
    
  render() {

    const { sendMessage, smsOption } = this.props;
    const number = "03360472067"

    return (
      <Layout history={this.props.history}>
        <div className="help-page">
          <div className="form" style={{ width: "75%" }}>
            <div className="title">Help</div>
            <div className="section">
              <h3>PLEASE Contact the following numbers for immediate Help</h3>
              <li>
                Call Center - <a href="tel:+923360472067">0336-0472067</a>
              </li>
              <h3>or Visit our Website for more Information</h3>
              <li>
                Website - <strong> <a href="https://google.com">mischool.pk </a></strong>
              </li>
            </div>
              
            <div className="divider">Ask Us</div>
              <div className="section">
                
                <div className="row">
                <label>Message</label>
                <textarea {...this.former.super_handle(["text"])} placeholder="Write text message here" />
                </div>
                <div>
                {
                  smsOption === "SIM" ? 
                    <a href={smsIntentLink({
                      messages: [{ number, text: this.state.text }],
                      return_link: window.location.href 
                      })} onClick={this.logSms} className="button blue">Send using Local SIM</a> :
                  
                    <div className="button" onClick={() => sendMessage( this.state.text, number)}>Can only send using Local SIM</div>
                }
                </div>
            </div>
          </div>
        </div>
        
          

      </Layout>
    )
  }
}
export default connect(state => ({
    faculty_id: state.auth.faculty_id,
	connected: state.connected,
	smsOption: state.db.settings.sendSMSOption
}), dispatch => ({
	sendMessage: (text, number, type) => dispatch(sendSMS(text, number)),
	logSms: (faculty_id, history) => dispatch(logSms(faculty_id, history))
}))(Help);
