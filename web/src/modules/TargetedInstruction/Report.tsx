//@ts-nocheck
import React, { useEffect, useState } from 'react'
import Modal from 'components/Modal'
import IlmxRedirectModal from 'components/Ilmx/redirectModal'
import { showScroll, hideScroll } from 'utils/helpers'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { smsIntentLink } from 'utils/intent'
import moment from 'moment'
import { replaceSpecialCharsWithUTFChars } from 'utils/stringHelper'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface P {
    type: any
    data: any
    stdId: any
    testId: any
    testType: any
    allStudents: any
    client_id: string
    faculty_id: string
    selectedClass: string
    auth: RootReducerState["auth"]
    students: RootDBState["students"]
    settings: RootDBState["settings"]

    setReport: () => any
    sendMessage: (text: string, number: string) => any
    sendBatchMessages: (messages: MISSms[]) => any
    logSms: (history: MISSMSHistory) => any
}

const Report: React.FC<P> = ({ settings, students, auth, client_id, testType, testId, stdId, allStudents, type, faculty_id, selectedClass, data, setReport }) => {

    const [phone, setPhone] = useState('')
    const [toggleModal, setToggleModal] = useState(false)
    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
        const phone = localStorage.getItem("ilmx")
        setPhone(phone)
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const handleResize = () => {
        setWidth(window.innerWidth)
    }

    let test, allStds;
    if (stdId) {
        test = students && students[stdId].report[testType][testId && testId]
        if (type === "All Students") {
            allStds = Object.values(students)
                .reduce((agg, std) => {
                    let stdObj = {}
                    const report = std.report && std.report[testType][testId]
                    if (report) {
                        stdObj = {
                            ...stdObj,
                            "Student": {
                                "id": std.id,
                                "name": std.Name
                            }
                        }
                        for (let [slo, sloObj] of Object.entries(report)) {
                            stdObj = {
                                ...stdObj,
                                [slo]: sloObj.percentage
                            }
                        }

                    }
                    return [...agg,
                        stdObj]
                }, [])
        }
    }

    const getStudentId = (e: any) => {
        setReport("Single Student")
        test = students && students[e.target.id].report[testType][testId && testId]
    }

    const handleRedirectToIlmx = (input_phone?: string) => {

        const link = `http://localhost:3001/auto-login?type=SCHOOL&id=${auth.school_id}&key=${auth.token}&cid=${client_id}&phone=${phone || input_phone}`

        if (input_phone) {
            localStorage.setItem("ilmx", input_phone)
            window.location.href = link
            return
        }

        if (phone) {
            window.location.href = link
        } else {
            setToggleModal(!toggleModal)
            hideScroll()
        }
    }

    const handleToggleModal = () => {
        setToggleModal(!toggleModal)
        showScroll()
    }

    const logSms = (messages: MISSms[]) => {

        if (messages.length === 0) {
            console.log("No Messaged to Log")
            return
        }

        const historyObj = {
            faculty: faculty_id,
            date: new Date().getTime(),
            type: "REPORT",
            count: messages.length,
        }

        logSms(historyObj)
    }

    const reportString = (): string => {
        const curr_date = `Date: ${moment().format("DD MMMM YYYY")}\n`
        const section_name = `Class: ${selectedClass}\n`
        const diary_message = ["Humna", "ALeem", "Software", "Develper"]
        // const diary_message = Object.entries(this.state.diary[this.state.selected_section_id])
        //     .map(([subject, { homework }]) => `${subject}: ${homework}`)

        const raw_diary_string = curr_date + section_name + diary_message.join("\n")
        const diary_string = replaceSpecialCharsWithUTFChars(raw_diary_string)

        return diary_string
    }

    const getMessages = (): MISSms[] => {
        let phone
        if (stdId) {
            phone = students[stdId].Phone
        }
        const report = reportString()

        // in case of single student
        if (phone) {
            return [{ number: phone, text: report }]
        }
        const messages = allStudents
            .reduce((agg, student) => {

                const index = agg.findIndex(s => s.number === student.Phone)

                if (index >= 0) {
                    return agg
                }

                return [
                    ...agg,
                    {
                        number: student.Phone,
                        text: report
                    }
                ]

            }, [])

        return messages
    }
    let messages
    if (type) {
        messages = getMessages()
    }

    return <>
        {
            toggleModal && <Modal>
                <IlmxRedirectModal
                    redirectToIlmx={handleRedirectToIlmx}
                    onClose={handleToggleModal}
                />
            </Modal>
        }
        {
            type === 'Single Student' ? <div className="section form">
                <table className="report-table">
                    <tr>
                        <th className="table-header" style={{ textAlign: "left" }}>SLO</th>
                        <th className="table-header" >POSSIBLE</th>
                        <th className="table-header" >CORRECT</th>
                        <th className="table-header" >PERCENTAGE</th>
                    </tr>
                    {Object.keys(test && test).map(function (key) {
                        return <tr key={key}>
                            <td className="slo" onClick={handleRedirectToIlmx}>{key}</td>
                            <td className="table-data">{test[key].possible}</td>
                            <td className="table-data">{test[key].correct}</td>
                            <td className="table-data">{`${test[key].percentage}%`}</td>
                        </tr>

                    })}
                </table>
                <div className="send-btn-div">
                    {
                        settings.sendSMSOption === "SIM" ?
                            <a className="button blue mb"
                                href={smsIntentLink({
                                    // messages,
                                    return_link: window.location.href
                                })}
                                onClick={() => logSms(messages)}>
                                Send Report using Local SIM </a>
                            :
                            <div className="row button" onClick={() => sendBatchMessages(messages)} style={{ width: "20%" }}>Send</div>
                    }
                </div>
            </div> :
                type === 'All Students' ?
                    <>
                        <div className="graph-div">
                            <BarChart
                                width={width <= 425 ? 350 : 700}
                                height={500}
                                data={data && data}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="percentage" fill="#82ca9d" />
                            </BarChart>
                        </div>
                        <div className="section">
                            <table className="report-table">
                                <tr>
                                    {allStds && allStds.slice(0, 1).map((std) => {
                                        return <> {Object.keys(std).map(function (key) {
                                            if (key === 'Student') {
                                                return <th className="table-header" style={{ textAlign: "left" }} key={std}>{key}</th>
                                            } else {
                                                return <th className="table-header" key={std}>{key}</th>
                                            }
                                        })}</>
                                    })}
                                </tr>
                                {Object.keys(test && test).map(function () {
                                    return <>
                                        {allStds && allStds.map((std) => {
                                            return <tr key={std}> {Object.keys(std).map(function (key) {
                                                if (key === 'Student') {
                                                    return <td className="std-name" key={std} id={std[key].id} onClick={getStudentId}>{std[key].name}</td>
                                                } else {
                                                    return <td className="table-data" key={std}>{`${std[key]}%`}</td>
                                                }
                                            })}</tr>
                                        })}
                                    </>

                                })}
                            </table>
                            <div className="send-btn-div">
                                {
                                    settings.sendSMSOption === "SIM" ?
                                        <a className="button blue mb"
                                            href={smsIntentLink({
                                                messages,
                                                return_link: window.location.href
                                            })}
                                            onClick={() => logSms(messages)}>
                                            Send Report using Local SIM </a>
                                        :
                                        <div className="row button" onClick={() => sendBatchMessages(messages)} style={{ width: "20%" }}>Send</div>
                                }
                            </div>
                        </div>
                    </> :
                    null
        }
    </>
}

export default connect((state: RootReducerState) => ({
    auth: state.auth,
    client_id: state.client_id,
    students: state.db.students,
    settings: state.db.settings,
    faculty_id: state.auth.faculty_id,
}), (dispatch: Function) => ({
    sendMessage: (text: string, number: string) => dispatch(sendSMS(text, number)),
    sendBatchMessages: (messages: MISSms[]) => dispatch(sendBatchSMS(messages)),
    logSms: (history: MISSMSHistory) => dispatch(logSms(history)),
}))(withRouter(Report))

