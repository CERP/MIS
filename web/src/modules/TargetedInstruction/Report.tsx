import React from 'react'
import { logSms } from 'actions'
import { connect } from 'react-redux'
import { smsIntentLink } from 'utils/intent'
import moment from 'moment'
import { isMobile } from 'utils/helpers'
import { replaceSpecialCharsWithUTFChars } from 'utils/stringHelper'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import DataTable from 'react-data-table-component';

interface P {
    type: string
    data: object[]
    stdId: string
    testId: string
    testType: string
    allStudents: MISStudent[]
    faculty_id: string
    selectedClass: string
    students: RootDBState["students"]

    setReport?: (type: string) => any
    logSms?: (history: MISSMSHistory) => any
}

type columns = {
    name: string
    selector: string
    sortable: boolean
}

const Report: React.FC<P> = ({ students, testType, testId, stdId, allStudents, type, faculty_id, selectedClass, data, setReport, logSms }) => {

    let testReport: MISReport, allStds, singleStd, columns: columns[] = [];

    const getSingleStdData = () => {
        testReport = students && students[stdId] && students[stdId].report[testType][testId]
        if (testReport) {
            singleStd = Object.entries(testReport)
                .reduce((agg, [slo, obj]) => {
                    let stdObject = {}
                    stdObject = {
                        "slo": slo,
                        "correct": obj.correct,
                        "possible": obj.possible,
                        "percentage": obj.percentage
                    }
                    return [...agg,
                        stdObject]
                }, [])
        }
    }

    const getAllStdData = () => {
        allStds = Object.values(students)
            .reduce((agg, std) => {
                let stdObj = {}
                const report = std.report && std.report[testType] && std.report[testType][testId]
                if (report) {
                    stdObj = {
                        ...stdObj,
                        "student": std.Name
                    }
                    if (!columns.find(col => col.name === 'student name')) {
                        columns.push({
                            "name": "student name",
                            "selector": "student",
                            "sortable": true
                        })
                    }
                    for (let [slo, sloObj] of Object.entries(report)) {
                        stdObj = {
                            ...stdObj,
                            [slo]: sloObj.percentage
                        }
                        if (!columns.find(col => col.name === slo)) {
                            columns.push({
                                "name": slo,
                                "selector": slo,
                                "sortable": true
                            })
                        }
                    }
                }
                return [...agg,
                    stdObj]
            }, [])
    }

    if (stdId) {
        getSingleStdData()
        if (type === "All Students") {
            getAllStdData()
        }
    }

    const getStudentId = (e: any) => {
        setReport("Single Student")
        getSingleStdData()
    }

    const logMessages = (messages: MISSms[]) => {
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

    const reportString = (stdId: string): string => {
        const curr_date = `Date: ${moment().format("DD MMMM YYYY")}\n`
        const section_name = `Class: ${selectedClass}\n`
        const test_type = `Test Type: ${testType}\n`
        const test_name = `Test Name: ${testId}\n`
        const stdReport = students[stdId].report && students[stdId].report[testType] && students[stdId].report[testType][testId]
        if (stdReport) {
            const stdName = students[stdId].Name
            let message = []
            message.push(`${stdName} scored`)
            for (let [testName, testObj] of Object.entries(stdReport)) {
                if (testObj.percentage <= 50) {
                    message.push(`${testObj.percentage}% marks in ${testName} kindly follow this link ${testObj.link}`)
                } else {
                    message.push(`${testObj.percentage}% marks in ${testName}`)
                }
            }
            const raw_report_string = curr_date + section_name + test_type + test_name + message.join(" \n ")
            const report_string = replaceSpecialCharsWithUTFChars(raw_report_string)
            return report_string
        }
    }

    const getMessages = (): MISSms[] => {

        if (type === 'Single Student') {
            let phone
            if (stdId) {
                phone = students[stdId].Phone
            }
            const report = reportString(stdId)

            return [{ number: phone, text: report }]
        } else if (type === 'All Students') {

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
                            text: reportString(student.id)
                        }
                    ]
                }, [])
            return messages
        }
    }

    let messages = getMessages()

    const customStyles = {
        rows: {
            style: {
                minHeight: "48px",
            },
        },
        headCells: {
            style: {
                padding: "20px 20px 30px 20px ",
                fontSize: "18px",
                fontWeight: 700,
                color: "black",
                backgroundColor: "rgb(250, 250, 250)",
                textTransform: "capitalize"
            },
        },
        cells: {
            style: {
                paddingLeft: "20px",
                paddingRight: "20px",
                color: "black",
                fontSize: "14px",
                backgroundColor: "rgb(250, 250, 250)"
            },
        },
        pagination: {
            style: {
                backgroundColor: "rgb(250, 250, 250)",
                color: "black",
            },
        },
    };

    const singleStdColumns = [
        {
            name: 'SLO',
            selector: 'slo',
            sortable: true,

        },
        {
            name: 'Correct',
            selector: 'correct',
            sortable: true,

        },
        {
            name: 'Possible',
            selector: 'possible',
            sortable: true,

        },
        {
            name: 'Percentage',
            selector: 'percentage',
            sortable: true,

        }
    ]

    return <>
        {
            type === 'Single Student' ? <div className="section form">
                <DataTable
                    columns={singleStdColumns}
                    customStyles={customStyles}
                    data={singleStd && singleStd}
                    pagination={true}
                    noHeader={true}
                    highlightOnHover={true}
                    responsive={true}
                    style={{ backgroundColor: "rgb(250, 250, 250)" }}
                />
                {/* <table className="report-table">
                    <tbody>
                        <tr>
                            <th className="table-header" style={{ textAlign: "left" }}>SLO</th>
                            <th className="table-header" >POSSIBLE</th>
                            <th className="table-header" >CORRECT</th>
                            <th className="table-header" >PERCENTAGE</th>
                        </tr>
                        {Object.keys(test && test).map(function (key) {
                            return <tr key={key}>
                                <td className="slo" id={test[key].link}>{key}</td>
                                <td className="table-data">{test[key].possible}</td>
                                <td className="table-data">{test[key].correct}</td>
                                <td className="table-data">{`${test[key].percentage}%`}</td>
                            </tr>

                        })}
                    </tbody>
                </table> */}
                <div className="send-btn-div">
                    <a className="button blue mb mobile-mode"
                        href={smsIntentLink({
                            messages,
                            return_link: window.location.href
                        })}
                        onClick={() => logMessages(messages)}>
                        Send Report using Local SIM </a>
                </div>
            </div> :
                type === 'All Students' ?
                    <>
                        <div className="graph-div">
                            <BarChart
                                width={isMobile() ? 350 : 700}
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
                            <DataTable
                                columns={columns}
                                customStyles={customStyles}
                                data={allStds && allStds}
                                pagination={true}
                                noHeader={true}
                                highlightOnHover={true}
                                responsive={true}
                                style={{ backgroundColor: "rgb(250, 250, 250)" }}
                            />
                            <div className="send-btn-div">
                                <a className="button blue mb mobile-mode"
                                    href={smsIntentLink({
                                        messages,
                                        return_link: window.location.href
                                    })}
                                    onClick={() => logMessages(messages)}>
                                    Send Report using Local SIM </a>
                            </div>
                        </div>
                    </> :
                    null
        }
    </>
}

export default connect((state: RootReducerState) => ({
    students: state.db.students,
    faculty_id: state.auth.faculty_id,
}), (dispatch: Function) => ({
    logSms: (history: MISSMSHistory) => dispatch(logSms(history)),
}))(Report)

