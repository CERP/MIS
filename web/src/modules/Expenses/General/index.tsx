import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router';
import Former from '../../../utils/former';

import '../style.css'
import { connect } from 'react-redux';
import checkCompulsoryFields from '../../../utils/checkCompulsoryFields'
import numberWithCommas from '../../../utils/numberWithCommas';
import { addExpense, addSalaryExpense } from '../../../actions'
import moment from 'moment'
import Banner from '../../../components/Banner';
import { PrintHeader } from '../../../components/Layout';


interface P {
  teachers: RootDBState["faculty"]
  expenses: RootDBState["expenses"]
  settings: RootDBState["settings"]
  schoolLogo: RootDBState["assets"]["schoolLogo"]
  addExpense: (amount: number, label: string, type: string, category: string, quantity: number ) => any
}

interface S {
  banner: {
		active: boolean
		good: boolean
		text: string
	}
  payment: {
    active: boolean
    amount: string
    type: string
    category: string
    faculty_id: string
    quantity: string
    label: string
  }
  monthFilter: string
  yearFilter: string
}

interface Routeinfo {
  id: string
}

type propTypes = RouteComponentProps<Routeinfo> & P

class Expenses extends Component <propTypes, S> {

  former: Former
  constructor(props: propTypes) {
    super(props)

    this.state = {
      banner: {
				active: false,
				good: true,
				text: "Saved!"
			},
      payment:{
        active: false,
        amount: "",
        label:"",
        type: "PAYMENT_GIVEN",
        category: "",
        faculty_id: "",
        quantity: "",
      },
      monthFilter: "",
      yearFilter: ""
    }

    this.former = new Former (this,[])
  }

  newPayment = () => {
    this.setState({ 
      payment: {
        ...this.state.payment,
        active: !this.state.payment.active,
        amount: "",
        label:"",
        type: "PAYMENT_GIVEN",
        category: "",
        faculty_id: "",
        quantity: "",
      }
    })
  }

  addPayment = () => {

    const payment = this.state.payment

    let compulsoryFields
    
    if (this.state.payment.category){
      compulsoryFields = checkCompulsoryFields(this.state.payment, [
        ["amount"], ["label"], ["type"], ["quantity"]
      ])
    }
    else {
      compulsoryFields = checkCompulsoryFields(this.state.payment, [
        ["category"]
      ])
    }

    if(compulsoryFields){
      const erroText = `Please Fill ${(compulsoryFields as string[][]).map(x => x[0] === "faculty_id" ? "Teacher" : x[0]).join(", ")} !`

      return this.setState({
        banner:{
          active: true,
          good: false,
          text: erroText
        }
      })
    }

    console.log("Adding expense")
    this.props.addExpense( parseFloat(payment.amount), payment.label, "PAYMENT_GIVEN", payment.category, parseFloat(payment.quantity))
    
    this.setState({
      banner: {
        active: true,
        good: true,
        text: "Saved"
      }
    })

    setTimeout(() => {
      this.setState({
        banner:{
          ...this.state.banner,
          active: false
        }
      })
    }, 1000)
  }

  getFilterCondition = (year: string, month: string, payment: any) =>
  {
    //when both are empty
    if(month === "" && year === "") {
      return true
    }
    //when month is empty	
    if(month === "" && year !== ""){
      return  moment(payment.date).format("YYYY") === year;

    }
    //when year is empty
    if(month !== "" && year === ""){
      return moment(payment.date).format("MMMM") === month

    }
    //when both are not empty
    if(month !== "" && year !== "")
    {
      return moment(payment.date).format("MMMM") === month && moment(payment.date).format("YYYY") === year;
    }
  }

  render() {

    const { expenses, teachers, settings, schoolLogo } = this.props

    let Months  = new Set([])
    let Years = new Set([])
  
    for(let e of Object.values(expenses)){
      if(e.expense === "MIS_EXPENSE")
      {
        Months.add(moment(e.date).format("MMMM"))
        Years.add(moment(e.date).format("YYYY"))
      }
    }

    const totalGeneralExpense = Object.values(expenses)
      .filter(e => e.expense === "MIS_EXPENSE")  
      .reduce((agg, curr) => agg + curr.amount, 0)

     return <div className="expenses">
          { this.state.banner.active ? <Banner isGood={this.state.banner.good} text={this.state.banner.text} /> : false }

          <PrintHeader settings={settings} logo={schoolLogo}/>
            <div className="divider">Expense Information</div>
            <div className="table row">
              <label>Total General:</label>
              <div>{totalGeneralExpense}</div>
            </div>

            <div className="divider">Ledger</div>

            <div className="filter row no-print" style={{marginBottom:"10px"}}>
              <select className="" {...this.former.super_handle(["monthFilter"])} style={{ width: "150px" }}>
                <option value="">Select Month</option>
                {
                  [...Months].map( Month => {
                    return <option key={Month} value={Month}>{Month}</option>	
                  })
                }
              </select>
              
              <select className="" {...this.former.super_handle(["yearFilter"])}>
                <option value="">Select Year</option>
                {
                  [...Years].map( year => {
                    return <option key={year} value={year}> {year} </option>
                  })
                }
              </select>
            </div>

            <div className="payment-history section">
              <div className="table row heading">
                <label><b> Date   </b></label>
                <label><b> Label  </b></label>
                <label><b> Category   </b></label>
                <label><b> Quantity</b></label>
                <label><b> Amount </b></label>
              </div>

              {
                Object.values(expenses)
                .filter(e => e.expense === "MIS_EXPENSE" && this.getFilterCondition(this.state.yearFilter, this.state.monthFilter, e))
                .sort((a,b) => a.date - b.date)
                .map( e => {
                    return <div className="table row">
                      <label> {moment(e.date).format("DD-MM")} </label>
                      <label> {e.label}</label>
                      <label> {e.category}</label>
                      <label style={{textAlign: "center"}}> {e.expense === "MIS_EXPENSE" ? e.quantity: "-"} </label>
                      <label> <span style={ e.type === "PAYMENT_DUE" ? { color: "#fc6171"}: {color: "#5ecdb971"}}>{numberWithCommas(e.amount)}</span></label>
                    </div>
                })
              }
              <div className="table row last">
                <label><b> Total Paid:</b></label>
                <div><b>{totalGeneralExpense}</b></div>
              </div>
            </div>
            <div className="form">
              <div className={`button ${this.state.payment.active ? "orange" : "green"}`} style={{marginTop:"10px"}} onClick={this.newPayment}>{this.state.payment.active ? "Cancel" : "New Entry"}</div>

              {this.state.payment.active && <div className="new-payment">
                <div className="row">
                  <label>Category</label>
                  <select {...this.former.super_handle(["payment", "category"])}>
                    <option value="">Select</option>                    
                    <option value="UTILITY_BILLS">Utility Bills</option>
                    <option value="MISC">Miscellaneous</option>
                    <option value="STATIONARY">Stationary/Books</option>
                    <option value="Activity">Student Activity</option>
                    <option value="TRIP">Trip</option>
                    <option value="MAINTENANCE">Repair/Maintenance</option>
                  </select>
                </div>
                { this.state.payment.category === "SALARY" && <div className="row">
                  <label> Teacher </label>
                  <select {...this.former.super_handle(["payment", "faculty_id"])}>
                    <option value=""> SELECT</option>
                    {
                      Object.values(teachers)
                      .map(t => {
                        return <option key={t.id} value={t.id}> {t.Name} </option>
                      })
                    }
                  </select>
                </div>}

                <div className="row">
                  <label>Label</label>
                  <input type="text" {...this.former.super_handle(["payment", "label"])} placeholder="Enter Name" />
                </div>
                <div className="row">
                  <label>Amount</label>
                  <input type="number" {...this.former.super_handle(["payment", "amount"])} placeholder="Enter Amount" />
                </div>
                <div className="row">
                  <label>Quantity</label>
                  <input type="number" {...this.former.super_handle(["payment", "quantity"])} placeholder="Enter Quantity" />
                </div>

                <div className="button save" onClick={this.addPayment}>Add Payment</div>
              </div> }
                <div className="print button" style={{marginTop:"5px"}} onClick={()=> window.print()} >Print</div>
              </div>
         </div>
  }
}

export default connect ( (state: RootReducerState) => ({
  teachers: state.db.faculty,
  expenses: state.db.expenses,
  settings : state.db.settings,
  schoolLogo: state.db.assets ? state.db.assets.schoolLogo || "" : ""
}), ( dispatch : Function ) => ({
  addExpense: (amount: number, label: string, type: string, category: string, quantity: number ) => dispatch(addExpense(amount, label, type, category, quantity )),
  addSalaryExpense: (id: string, amount: number, label: string, type: string, category: string, faculty_id: string) => dispatch(addSalaryExpense(id, amount, label, type, category, faculty_id))
}))( Expenses )
