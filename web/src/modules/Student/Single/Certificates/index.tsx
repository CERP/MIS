import React, { Component, FC } from 'react'
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import moment from 'moment'
import {capitalize} from '../../../../utils/capitalize'
import { getGenderSpecificText } from "../../../../utils/getGenderSpecificText"
import {getSectionsFromClasses} from '../../../../utils/getSectionsFromClasses';

import './style.css'
import Former from '../../../../utils/former';
import { PrintHeader } from '../../../../components/Layout';

interface P {
  students: RootDBState['students']
  teachers: RootDBState["faculty"]
  settings: RootDBState["settings"]
  schoolLogo: RootDBState["assets"]["schoolLogo"]
  classes: RootDBState["classes"]
}

interface S {
  selectedCertificate: string
}

interface RouteInfo {
  id: string
}

type propTypes = RouteComponentProps < RouteInfo > & P 

class StudentCertificates extends Component < propTypes, S > {

  former: Former
  constructor(props: propTypes) {
      super(props)

      this.state = {
        selectedCertificate: "CHARACTER"
      }

      this.former = new Former(this,[])
    }

    student = () : MISStudent => {
      const id = this.props.match.params.id
      return this.props.students[id]
    }



    getSelectedCertificate = ( relvSection: any) =>
    {
      switch(this.state.selectedCertificate){
        case "CHARACTER":
          return <CharacterCertificate curr_student={this.student()} relevant_section={relvSection} />
        case "SCHOOL_LEAVING":
          return <SchoolLeavingCertificate curr_student={this.student()} relevant_section={relvSection} />
        case "SPORTS":
          return <SportsCertificate curr_student={this.student()} relevant_section={relvSection} />
      }
    }

  render() {
    const {settings, schoolLogo, classes} = this.props
    const sections = getSectionsFromClasses(classes);
    const relevant_section = sections.find(section => this.student().section_id === section.id);

    return (
      <div className="certificate">
          <PrintHeader settings={settings} logo={schoolLogo}/>
          <div className="no-print">
            <h2 className="text-center">Certificates</h2>
          </div>

          <div className="cert-Info no-print">
            <div className="row">
                <label>Type</label>
                <select {...this.former.super_handle(["selectedCertificate"])}>
                    <option value="SCHOOL_LEAVING">School Leaving</option>
                    <option value="CHARACTER">Character</option>
                    <option value="SPORTS"> Sports </option>
                </select>
            </div>
            <div className="button blue" onClick={()=> window.print()}>Print</div>
          </div>
          {this.getSelectedCertificate(relevant_section)}

      </div>
    )
  }
}
export default connect ((state : RootReducerState) => ({
  students: state.db.students,
  teachers: state.db.faculty,
  settings: state.db.settings,
  classes: state.db.classes,
  schoolLogo: state.db.assets ? state.db.assets.schoolLogo || "" : ""
}))(StudentCertificates)

interface CertificateProps {
  curr_student: MISStudent,
  relevant_section: any
}
const CharacterCertificate: React.FC <CertificateProps> = ({ curr_student , relevant_section}) => {

  const gender = curr_student.Gender
  
  const stdClass = relevant_section ? relevant_section.className : ""

  return(<div className="certificate-page">

    <div className="head">
      <div className="divider" style={{textDecoration:"underline"}}>CHARACTER CERTIFICATE</div>
      <div className="sub-divider"> To Whom it May Concern</div>
    </div>

    <div className="body">
      <div className="para">
        This is to certify that <span style={{fontWeight:"bold", textDecoration:"underline"}}>{curr_student.Name}</span>, {getGenderSpecificText("son/daughter", gender)} of <span style={{fontWeight:"bold", textDecoration:"underline"}}>{curr_student.ManName}</span>, is a bonafide student of this school and bears a good moral character. {capitalize(getGenderSpecificText("his/her", gender))} behaviour was good with teachers and students. {capitalize(getGenderSpecificText("he/she", gender))} has neither displayed persistent violent or aggressive behavior nor any desire to harm other. 
      </div>

      <div className="cert-row"> {capitalize(getGenderSpecificText("his/her", gender))} data according to our record is as follows;</div>
      <div className="cert-row">
        <label>Admission No.: </label>
        <div>
          { curr_student.AdmissionNumber ? `${curr_student.AdmissionNumber}`: "" }
        </div>
      </div>
      <div className="cert-row">
        <label>Roll No.: </label>
        <div>
          { curr_student.RollNumber ? `${curr_student.RollNumber}`: ""}
        </div>
      </div>
      <div className="cert-row">
        <label>Class: </label>
        <div>
          { stdClass }
        </div>
      </div>
      <div className="cert-row">
        <label>Date of Birth: </label>
        <div>
          { curr_student.Birthdate ? `${moment( curr_student.Birthdate).format("DD-MM-YYYY") }`: ""}
        </div>
      </div>
      <div className="cert-row">
        <label>Exam Board: </label>
        <div>
          
        </div>
      </div>
      <div className="cert-row">
        <label>Marks: </label>
        <div>
          
        </div>
      </div>
      <div className="cert-row">
        <label>Session: </label>
        <div>
          
        </div>
      </div>

    </div>

    <div className="footer">
      <div className="left">
        <div> Date of Issue</div>
      </div>
      <div className="right">
        <div> Principal Signature</div>
      </div>
    </div>
  </div>
  );
}

const SchoolLeavingCertificate: React.FC <CertificateProps> = ({ curr_student , relevant_section}) => {
  
  const gender = curr_student.Gender
  const stdClass = relevant_section ? relevant_section.className : ""

  return (
  <div className="certificate-page">
    
    <div className="head">
      <div className="divider">SCHOOL LEAVING CERTIFICATE</div>
      <div className="sub-divider"> To whom it may concern</div>
    </div>

    <div className="body">
      
      <div className="para">
        This is to certify that <span style={{fontWeight:"bold", textDecoration:"underline"}}>{curr_student.Name}</span>, {`${getGenderSpecificText("son/daughter", gender)}`} of <span style={{fontWeight:"bold", textDecoration:"underline"}}>{curr_student.ManName}</span>, has Passed/Failed the Annual Examination held in ________________ for promotion to Class ____________________.
      </div>

      <div className="cert-row"> {capitalize(getGenderSpecificText("his/her", gender))} data according to our record is as follows;
      </div>

      <div className="cert-row">
        <label>Admission No.: </label>
        <div>
          { curr_student.AdmissionNumber ? curr_student.AdmissionNumber: "" }
        </div>
      </div>

      <div className="cert-row">
        <label>Roll No.: </label>
        <div>
          { curr_student.RollNumber ? curr_student.RollNumber: ""}
        </div>
      </div>
      
      <div className="cert-row">
        <label>Admission Date: </label>
        <div>
          { curr_student.StartDate ? `${moment( curr_student.StartDate).format("DD-MM-YYYY")}`: "" }
        </div>
      </div>

      <div className="cert-row">
        <label>Class of Admission: </label>
        <div>
          
        </div>
      </div>

      <div className="cert-row">
        <label className="slc-label">Class of Leaving: </label>
        <div>
          { stdClass } 
        </div>
      </div>
      
      <div className="cert-row">
        <label>Session: </label>
        <div>
        </div>
      </div>

      <div className="cert-row">
        <label>Conduct: </label>
        <div>
        </div>
      </div>

      <div className="cert-row">
        <label>Remarks:</label>
        <div/>
      </div>

    </div>
    
    <div className="footer">

      <div className="left">
        <div> Date of Issue</div>
      </div>

      <div className="right">
        <div> Principal Signature</div>
      </div>

    </div>
  </div>)
}

const SportsCertificate: React.FC <CertificateProps> = ({ curr_student, relevant_section }) => {

  const gender = curr_student.Gender
  const stdClass = relevant_section ? relevant_section.className : ""

  return <div className="certificate-page">

    <div className="head">
      <div className="divider">SPORTS CERTIFICATE</div>
      <div className="sub-divider"> To Whom it May Concern</div>
    </div>

    <div className="body">
      <div className="para">
      This certificate is awarded to <span style={{fontWeight:"bold", textDecoration:"underline"}}>{curr_student.Name}</span>, {` ${getGenderSpecificText("son/daughter", gender)}`} of <span style={{fontWeight:"bold", textDecoration:"underline"}}>{curr_student.ManName}</span>, for {getGenderSpecificText("his/her", gender)} excellent athletics performance in ____________________ at our school.
      </div>

      <div className="cert-row">
        <label>Admission No.: </label>
        <div>
          { curr_student.AdmissionNumber ? curr_student.AdmissionNumber: "" }
        </div>
      </div>
      <div className="cert-row">
        <label>Admission Date: </label>
        <div>
          { curr_student.StartDate ? `${moment( curr_student.StartDate).format("DD-MM-YYYY")}`: "" }
        </div>
      </div>
      <div className="cert-row">
        <label>Class/Section: </label>
        <div>
          {stdClass}
        <div/>
      </div>
    </div>

    <div className="footer">
      <div className="left">
        <div> Date of Issue</div>
      </div>
      <div className="right">
        <div> Principal Signature</div>
      </div>
    </div>
  </div>
  </div>
} 