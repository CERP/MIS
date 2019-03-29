import React, { Component } from 'react'
import former from 'utils/former'
import checkCompulsoryFields from 'utils/checkCompulsoryFields'
import Banner from 'components/Banner'
import { createSignUp } from 'actions'
import {connect} from 'react-redux'

import './style.css'

class SignUp extends Component {


    constructor(props) {
      super(props)
    
      this.state = {
        profile:{
          name:"",
          phone:"",
          city:"",
          schoolName:"",
          packageName: "Taleem-1"
        },
        banner: {
          active: false,
          good: true,
          text: "Saved!"
        }
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

      this.props.createSignUp(this.state.profile)

      this.setState({
        banner:{
          active: true,
          good: true,
          text: "Thanks for signing up, We'll get back to you shortly"
        }
      })
      setTimeout(()=>{
        this.setState({
          banner:{
            active: false,
            good: true,
          },
        })
      }, 1000)
    }
    
  render() {
    return (
      <div className="card section sign-up" style={{display:"flex", flexDirection:"column", maxWidth: "1000px"}}>
      		{ this.state.banner.active ? <Banner style={{color:"blue"}} isGood={this.state.banner.good} text={this.state.banner.text} /> : false }
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
            <label> Select Package </label>
            <select {...this.former.super_handle(["profile","packageName"])}>
              <option value="Taleem-1">Taleem-1</option>
              <option value="Taleem-2">Taleem-2</option>
              <option value="Taleem-3">Taleem-3</option>
            </select>
          </div>
          <div className="button red" onClick={() => this.onSave()}> Submit</div>

      </div>
    )
  }
}
export default connect(state => ({}), dispatch => ({
	createSignUp: (profile) => dispatch(createSignUp(profile)),
 }))(SignUp);