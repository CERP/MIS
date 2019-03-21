import React, { Component } from 'react'

import Layout from "components/Layout"
import logo from './favicon.ico'
import cerpLogo from './images/cerp-logo.jpg'
import setup from "./images/setup1.png"
import action from "./images/action.png"
import dail_stats from "./images/daily_stats2.png"
import bg from "./images/home.png"

import attendanceIcon from '../Landing/icons/attendance/checklist_1.svg'
import teacherAttendanceIcon from '../Landing/icons/attendance/Attendance.svg'
import feesIcon from '../Landing/icons/fees/accounting.svg'
import marksIcon from '../Landing/icons/Marks/exam.svg'
import analyticsIcon from '../Landing/icons/Analytics/increasing-stocks-graphic-of-bars.svg'
import resultIcon from '../Landing/icons/result_card/exam-a-plus.svg'
import smsIcon from '../Landing/icons/SMS/sms_1.svg'
import Help from '../Landing/icons/Help/help.svg'
import diary from '../Landing/icons/Diary/diary.svg'
import teachersIcon from '../Landing/icons/Teacher/teacher_1.svg'
import studentsIcon from '../Landing/icons/Student/student_profile_1.svg'
import classesIcon from '../Landing/icons/Classes/classes_1.svg'
import settingsIcon from '../Landing/icons/Settings/settings-gears.svg'
import switchUserIcon from '../Landing/icons/switch_user/logout.svg'
import prospective from '../Landing/icons/Prospective/prospective.svg'

import './style.css'

export default class Front extends Component {
    
  render() {
    return <Layout history={this.props.history}>
      <div className="mischool-resume">
        {/*Header*/}
        <div className="headers bg-red">
            <div style={{
               width:"20%",
               display:"flex",
               flexDirection:"column",
               alignItems:"center",
               borderRight: "1px solid #fafafa"
            }}>
              <img src={logo} className="logo"/>
            </div>
            <div style={{ width:"60%", marginLeft:"10px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            اسی ایک پل کی تلاش میں
شب و روز میں ماہ و سال میں </div>
            <div style={{
               width:"20%",
               display:"flex",
               flexDirection:"column",
               alignItems:"center",
               borderLeft: "1px solid #fafafa"
            }}>
              <img src={cerpLogo} className="logo" style={{ borderRadius:"0px", animation:"none"}}/>
            </div>
        </div>


        {/**BODY */}
        <div className="body">
          
            <div className="card-video">
                <iframe src='https://youtube.com/embed/cm73XDWTiNQ'
                  height = "290px"
                  width ="100%"
                  frameBorder ='0'
                  allowFullScreen
                  title='video'
                />
            </div>

          {/** ==========================> CARD-1 <======================================== */}
          <div className="card">
            
{/*             <div className="img-container">
                <img className="image" src={action} />
            </div> */}
            <div className="info" >
              <h2 className="card-title">What is MISchool?</h2>
              <p className="para">
                MISchool is a management information system for schools. MISchool enables school to collect,
                organize, and store records giving your school full control of all academic, 
                finance, wellbeing, and administrative information. It consists of almost everything that is 
                required by the school administration.
              </p>
            </div>
          </div>
          
          {/**======================> what are we offering? <============================== */}
          <h1 style={{
            display:"flex",
            flexDirection:"row",
            justifyContent:"center",
            color:"#fc6171",
            
          }}> What is MISchool Offering? </h1>


          {/** =========================================== */}

          {/** ==========================> CARD-1 <======================================== */}
          <div className="card">
            <div className="info" >
              <h2 className="card-title"> Actions </h2>
              <p className="para">
                Actions provides the user easy access to daily used modules such as,
              </p>

              <div className="icard-row">
                
                <div className="icon-card">
                  
                  <div className="icard-image-container">
                    <img className="icard-image" src={attendanceIcon}/>
                  </div>
      
                  <p className="icard-para">
                  Instant and easy access, One click process
                  </p>

                </div>

                <div className="icon-card">
                  
                  <div className="icard-image-container">
                    <img className="icard-image" src={teacherAttendanceIcon}/>
                  </div>
      
                  <p className="icard-para">
                    MISchool teacher attendance module keeps the record of teachers attendance and timings as well.                  </p>

                </div>
                
              </div>

              <div className="icard-row">
                
                <div className="icon-card">
                  
                  <div className="icard-image-container">
                    <img className="icard-image" src={feesIcon}/>
                  </div>
      
                  <p className="icard-para">
                    Computerized vouchers
                    Automatic calculations 
                    Safe record keeping
                  </p>

                </div>

                <div className="icon-card">
                  
                  <div className="icard-image-container">
                    <img className="icard-image" src={marksIcon}/>
                  </div>
      
                  <p className="icard-para">
                  Automatic grade calculations.
                  Print result card of all your students in one click
                  </p>

                </div>
                
              </div>

              <div className="icard-row">
                
                <div className="icon-card">
                  
                  <div className="icard-image-container">
                    <img className="icard-image" src={analyticsIcon}/>
                  </div>
      
                  <p className="icard-para">
                  Graphical representation of your data
                  Informed decision by comparing old and new data                  
                  </p>

                </div>

                <div className="icon-card">
                  
                  <div className="icard-image-container">
                    <img className="icard-image" src={resultIcon}/>
                  </div>
      
                  <p className="icard-para">
                    The result card module prints or send sms result card of all students of a class in one click.
                  </p>

                </div>
                
              </div>

              <div className="icard-row">
                
                <div className="icon-card">
                  
                  <div className="icard-image-container">
                    <img className="icard-image" src={smsIcon}/>
                  </div>
      
                  <p className="icard-para">
                  Connects you with parents, faculty and staff efficiently 
                  </p>

                </div>

                <div className="icon-card">
                  
                  <div className="icard-image-container">
                    <img className="icard-image" src={diary}/>
                  </div>
      
                  <p className="icard-para">
                  A bonus module connecting faculty, students and parents
                  </p>

                </div>
                
              </div>
              {/**============>_icard_<============== */}

            </div>
            <div className="img-container">
              <img className="image" src={action} />
            </div>
          </div>

          {/** =========================================== */}


          {/** ==========================> CARD-2 <======================================== */}
          <div className="card">
            <div className="img-container">
              <img className="image" src={setup} />
            </div>
            <div className="info" >

              <h2 className="card-title"> Setup </h2>
              <p className="para">
              It is the section through which school would setup the system according to their school,
              add/make/maintain record of the profiles of their teachers and students.
              </p>

              <div className="icard-row">
                
                <div className="icon-card">
                  
                  <div className="icard-image-container">
                    <img className="icard-image" src={teachersIcon}/>
                  </div>
      
                  <p className="icard-para">
                  Teacher’s profile module facilitates schools to keep a detailed record of all teachers. 
                  </p>

                </div>

                <div className="icon-card">
                  
                  <div className="icard-image-container">
                    <img className="icard-image" src={studentsIcon}/>
                  </div>
      
                  <p className="icard-para">
                  Student’s profile module saves all required information of students. 
                  </p>

                </div>
                
              </div>

              <div className="icard-row">
                
                <div className="icon-card">
                  
                  <div className="icard-image-container">
                    <img className="icard-image" src={classesIcon}/>
                  </div>
      
                  <p className="icard-para">
                  Schools can add classes or sections according to their system.
                  </p>

                </div>

                <div className="icon-card">
                  
                  <div className="icard-image-container">
                    <img className="icard-image" src={settingsIcon}/>
                  </div>
      
                  <p className="icard-para">
                  Settings let the user setup basic things in MISchool such as teacher’s permission,
                  logo, school information for header in printing etc.
                  </p>

                </div>
                
              </div>

              <div className="icard-row">
                
                <div className="icon-card">
                  
                  <div className="icard-image-container">
                    <img className="icard-image" src={prospective}/>
                  </div>
      
                  <p className="icard-para">
                  Prospective students is especially made for schools marketing so through this
                  schools can send a message to
                  the parents that inquired about fees/school but didn’t come back for admission.                  </p>

                </div>

                <div className="icon-card">
                  
                  <div className="icard-image-container">
                    <img className="icard-image" src={Help}/>
                  </div>
      
                  <p className="icard-para">
                  Help button connects the user instantly to our customer service.
                  </p>

                </div>
                
              </div>

              <div className="icard-row">
                
                <div className="icon-card">
                  
                  <div className="icard-image-container">
                    <img className="icard-image" src={switchUserIcon}/>
                  </div>
      
                  <p className="icard-para">
                  Switch users with just a click
                  </p>

                </div>
                
              </div>
              {/**============>_icard_<============== */}

            </div>
          </div>

          {/** =========================================== */}

          {/** ==========================> CARD-3 <======================================== */}
          <div className="card">
            <div className="info" >
              <h2 className="card-title">Daily Statistics</h2>
              <p className="para">
              Daily statistics lets the owner get daily updates about no. 
              of students present, no. of teachers present, status of fee 
              collection
              </p>
              
            </div>
            <div className="img-container">
              <img className="image" src={dail_stats} style={{ width:"200px"}}/>
            </div>
          </div>

          {/** ===================> Packages <======================== */}

          <div className="package-container" >
              <h2 style={{ color: "#fc6171" }}>Packages</h2>
              <div className="pcard-container">
                <div className="pcard"> 
                  
                  <h4 className="bg-blue">Taleem-1</h4>
                  <div className="para">
                    <li>Student capacity - 150 </li>
                    <li>Price: <strong>7,500 Pkr</strong></li>
                  </div>

                </div>

                <div className="pcard">
                  
                  <h4 className="bg-green">Taleem-2</h4>
                  <div className="para">
                    <li>Student capacity - 150 </li>
                    <li>Price: <strong>10,500 Pkr</strong></li>
                  </div>

                </div>

                <div className="pcard">
                  
                  <h4 className="bg-red">Taleem-3</h4>
                  <div className="para">
                    <li>Student capacity - 150 </li>
                    <li>Price: <strong>14,500 Pkr</strong></li>
                  </div>

                </div>

                <div className="pcard">
                  
                  <h4 className="bg-purple">Special offer </h4>
                  <div className="para">
                    <li>Free 15 days Trial</li>
                    <li>Free data entry</li>
                    <li>Free staff training</li>
                  </div>

                </div> 

              </div>
          </div>

          {/**======================> About Us <============================== */}
          <h1 style={{
            display:"flex",
            flexDirection:"row",
            justifyContent:"center",
            color:"#fc6171",
            
          }}> About Us </h1>

          {/** ==========================> CARD-4 <======================================== */}
          <div className="card" style={{ justifyContent:"center"}}>


            <div className="info" >
              <h2 className="card-title"> Who are we?</h2>
              <p className="para">
              MISchool is developed by the <a href="https://cerp.org.pk">Centre for Economic Research in Pakistan (CERP)</a>. 
              CERP, is a leading independent nonpartisan policy institution that, 
              amongst other areas, has been working towards the betterment of private schools 
              since the last 15 years.
              </p>
            </div>

            <div className="img-container">
              <img className="image" src={cerpLogo} style={{ width:"200px"}}/>
            </div>
          </div>




        </div>
        
        {/**FOOTER */}
        <div className="footer bg-red">

          <div>
            <h2>Contact Us</h2>
            <li>Phone: +92 123 4567891</li>
            <li>Phone: +92 123 4567891</li>
            <li>Phone: +92 123 4567891</li>
          </div>

          
        </div>
      </div>
    

    </Layout>
  }
}
