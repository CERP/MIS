import React, { Component } from 'react'
import Layout from 'components/Layout'
import {connect} from 'react-redux'
import { sendSMS, sendBatchSMS } from 'actions/core'
import { logSms, addDiary } from 'actions'
import Banner from 'components/Banner'
import { smsIntentLink } from 'utils/intent'
import {getSectionsFromClasses} from 'utils/getSectionsFromClasses';
import former from 'utils/former'
import moment from 'moment'
import v4 from 'node-uuid'

class Diary extends Component {
    constructor(props) {
      super(props)

      const curr_date = moment().format("DD/MM/YYYY")
      
      this.state = {
        banner: {
            active: false,
            good: true,
            text: "Saved!"
        },
		selected_section_id: "",
        diary: props.diary && props.diary.date === curr_date ? props.diary : {}
        }
        
        this.former = new former(this, [])

    }
    
    logSms = (messages) =>{
		if(messages.length === 0){
			console.log("No Messaged to Log")
			return
		}
		const historyObj = {
			faculty: this.props.faculty_id,
			date: new Date().getTime(),
			type: "DIARY",
			count: messages.length,
		}

		this.props.logSms(historyObj)
    }

    onSave = () => {
        const curr_date = moment().format("DD/MM/YYYY")
        const diary = {
            ...this.state.diary,
            date: curr_date
        }
        this.props.addDiary(diary)
        this.setState({
			banner: {
				active: true,
				good: true,
				text: "Saved!"
			}
		})

		setTimeout(() => {
			this.setState({
				banner: {
					active: false
				}
			})
		}, 1000);
    }
    
    diaryString = () => {
        
        if(this.state.selected_section_id === "" || this.state.diary[this.state.selected_section_id] === undefined ){
            console.log("Not running diary")
            return []
        }
        const curr_date = `Date: ${moment().format("DD/MM")}\n`
        
        const diary_message = Object.entries(this.state.diary[this.state.selected_section_id])
                .map( ([subject, homework]) => {
                    return `${subject}: ${homework},`
            })
        return curr_date + diary_message.join("\n")
    }



  render() {

    const { classes, students, sendBatchMessages, smsOption } = this.props;
    
    const subjects = new Set()
    
    for(let c of Object.values(classes)){
        if(this.state.selected_section_id !== "" && c.sections[this.state.selected_section_id] !== undefined){
            Object.keys(c.subjects).forEach(s => subjects.add(s))
        }
    }

    const messages = Object.values(students)
                    .filter(s => s.section_id === this.state.selected_section_id && (s.tags === undefined || !s.tags["PROSPECTIVE"]) && s.Phone !== undefined && s.Phone !== "")
                    .reduce((agg,student)=> {

                        const index  = agg.findIndex(s => s.number === student.Phone)		
                        if(index >= 0 ){
                            return agg
                        }
                        const diary_string = this.diaryString()
                        return [...agg,{
                            number: student.Phone,
                            text : diary_string
                        }]
                    }, [])
    
    return <Layout history={this.props.history}>
            <div className="sms-page">
            { this.state.banner.active ? <Banner isGood={this.state.banner.good} text={this.state.banner.text} /> : false }

            <div className="title">Diary</div>
            <div className="form">
                <div className="divider">Send Diary for {moment().format("DD/MM/YYYY")}</div>
                
                <div className="section">
                    <div className="row">
                        <label>Select Class/Section</label>
                            <select {...this.former.super_handle(["selected_section_id"])}>
                                {
                                    [<option key="abcd" value="" disabled>Select Section</option>,
                                    ...Object.entries(getSectionsFromClasses(classes))
                                    .map(([id, C]) => <option key={id} value={C.id}>{C.namespaced_name}</option>)
                                    ]
                                }
                            </select>
                    </div>
                </div>

                {this.state.selected_section_id !== "" ?<div className="section">
                {
                    Array.from(subjects)
                        .map(s => {
                            return <div className="table row" key={s}>
                                    <div>{s}</div>
                                    <input type="text" {...this.former.super_handle(["diary", this.state.selected_section_id, s])} placeholder="Enter Homework"/>
                                </div>})
                }
                { Array.from(subjects).length === 0 ? false : <div className="button blue" onClick={this.onSave}>Save</div> }
                </div> : false}

                {Array.from(subjects).length === 0 ? false : smsOption === "SIM" ? 
                <a href={smsIntentLink({
                    messages,
                    return_link: window.location.href 
                    })} onClick={() => this.logSms(messages)} className="button blue" style={{width: "20%"}}>Send using Local SIM</a> 
                    : <div className="button" onClick={() => sendBatchMessages(messages)} style={{width: "20%"}}>Send</div>}
                
            </div>
        </div>
    </Layout>
  }
}
export default connect(state => ({
    faculty_id: state.auth.faculty_id,
    diary: state.db.diary,
	students: state.db.students,
	classes: state.db.classes,
	smsOption: state.db.settings.sendSMSOption
}), dispatch => ({
	sendMessage: (text, number) => dispatch(sendSMS(text, number)),
	sendBatchMessages: (messages ) => dispatch(sendBatchSMS(messages)),
    logSms: (faculty_id, history) => dispatch(logSms(faculty_id, history)),
    addDiary: (diary) => dispatch(addDiary(diary))
}))(Diary);