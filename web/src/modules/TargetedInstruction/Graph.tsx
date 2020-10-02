//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './style.css'

interface P {
    testId: any
    testType: any
    students: RootDBState["students"]
}

const ReportGraph: React.FC<P> = (props: any) => {
    const [data, setData] = useState([])

    useEffect(() => {
        let graphData = {}
        if (props.testId) {
            for (let [id, student] of Object.entries(props.students)) {
                const test = student.report && student.report[props.testType][props.testId]
                if (test) {
                    for (let [testId, testObj] of Object.entries(test)) {
                        if (graphData[testId]) {
                            graphData[testId] += testObj.percentage
                        } else {
                            graphData[testId] = testObj.percentage
                        }
                    }
                }
            }
            let arr = []
            for (let [id, graphObj] of Object.entries(graphData)) {
                arr.push(
                    { name: id, percentage: Math.round(graphObj / Object.entries(props.students).length) }
                )
            }
            setData(arr)
        }
    }, [])

    return <div style={{ textAlign: 'center' }}>
        <BarChart
            width={1000}
            height={500}
            data={data && data}
            margin={{
                top: 5, right: 30, left: 20, bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="percentage" fill="#82ca9d" />
        </BarChart>
    </div>
}

export default connect((state: RootReducerState) => ({
    students: state.db.students,
    auth: state.auth,
    client_id: state.client_id,
}))(ReportGraph)
