import React, { Component } from 'react'
import former from 'utils/former'
import checkCompulsoryFields from 'utils/checkCompulsoryFields'
import Banner from 'components/Banner'
import { createSignUp } from 'actions'
import {connect} from 'react-redux'
import { getStrategies } from 'constants/generic'

import './style.css'
import moment from 'moment';

class SignUp extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
        profile:{
          name:"",
          phone:"",
          city:"",
          schoolName:"",
          schoolPassword:"",
          packageName: "Free-Trial",
          typeOfLogin: ""
        },
        banner: {
          active: false,
          good: true,
          text: "Saved!"
        },
        isOtherLogin: false
      }

      this.former = new former(this, [])
    }

    onSave = () => {

      const compulsoryFields = checkCompulsoryFields(this.state.profile, [
        ["name"], ["phone"]
      ]);

      if(compulsoryFields)
      {
        const errorText = "Please Fill " + compulsoryFields  + " !!!";

        return this.setState({
          banner:{
            active: true,
            good: false,
            text: errorText
          }
        })
      }

      this.props.createSignUp({...this.state.profile, date: moment.now()})
    }
    
    componentWillReceiveProps(props) {
      const sign_up_form = props.sign_up_form

      if( sign_up_form.loading === false &&
        sign_up_form.succeed === false &&
        sign_up_form.reason !== "" ) 
      { 
        this.setState({
          banner:{
            active:true,
            good: false,
            text:"SignUp Failed, Please try again."
          }
        })
      }
      if( sign_up_form.loading === true) 
      { 
        this.setState({
          banner:{
            active:true,
            good: true,
            text:"LOADING"
          }
        })
      }
      if( sign_up_form.loading === false &&
        sign_up_form.succeed === true &&
        sign_up_form.reason === "" ) 
      { 
        this.setState({
          banner:{
            active:true,
            good: true,
            text:"Thanks for Signing-Up,We will get back to you"
          }
        })

        setTimeout(()=>{
          this.setState({
            banner:{
              active: false,
              good: true,
            }
          })
        }, 1000)
      }
    }

    getTypeOfLogin = (e) => {
      e.target.value === 'OTHER' ?
        this.setState({ isOtherLogin: true }) :
        this.setState({ 
          profile: { 
            ...this.state.profile, 
            typeOfLogin: e.target.value } 
        })
    }

    setOther = (e) => {
      this.setState({ 
        profile: { 
          ...this.state.profile, 
          typeOfLogin: e.target.value } 
      })
    }

  render() {
    const Span = () => <span style={{ color: "red" }}>*</span>

    return (
      <div className=" section card sign-up">
	  	{ this.state.banner.active ? <Banner isGood={this.state.banner.good} text={this.state.banner.text} /> : false }
          <div className="row">
            <label> Name </label>
            <input type="text" {...this.former.super_handle(["profile","name"])}></input>
          </div>
          <div className="row">
            <label> Phone </label>
            <input type="text" {...this.former.super_handle(["profile","phone"])}></input>
          </div>
          <div className="row">
            <label> City/District </label>
            <input type="text" {...this.former.super_handle(["profile","city"])}></input>
          </div>
          <div className="row">
            <label> School Name </label>
            <input type="text" {...this.former.super_handle(["profile","schoolName"])}></input>
          </div>
          <div className="row">
            <label> School Password </label>
            <input type="password" {...this.former.super_handle(["profile","schoolPassword"])}></input>
          </div>
          <div className="row">
						<label>Strategy <Span /></label>
						<select {...this.former.super_handle(["profile", "typeOfLogin"])} onChange={this.getTypeOfLogin}>
							<option value="">Select Strategy</option>
							{
								[...getStrategies()]
									.sort()
									.map(strategy => {
										const str = strategy.replace(' ', "_").toUpperCase()
										return <option key={str} value={str}>{strategy}</option>
									})
							}
						</select>
					</div>
        { this.state.isOtherLogin &&
          <div className="row">
          <label> Other </label>
          <input type="text" onChange={this.setOther}></input>
        </div>
        }
          <div className="row">
            <label> Select Package </label>
            <select style={{marginTop: 5}} {...this.former.super_handle(["profile","packageName"])}>
              <option value="Free-Trial">Free-Trial</option>
              {/* <option value="Taleem-1">Taleem-1</option>
              <option value="Taleem-2">Taleem-2</option>
              <option value="Taleem-3">Taleem-3</option> */}
            </select>
          </div>

          <div className="button red" onClick={() => this.onSave()}> Submit</div>

      </div>
    )
  }
}
export default connect(state => ({
  sign_up_form: state.sign_up_form
}), dispatch => ({
	createSignUp: (profile) => dispatch(createSignUp(profile)),
 }))(SignUp);