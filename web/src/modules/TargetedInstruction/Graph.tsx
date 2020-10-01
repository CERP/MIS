import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './style.css'

interface P {
    name: string
}

const data = [
    { name: 'Fraction', percentage: 30 },
    { name: 'Adition', percentage: 90 },
    { name: 'Multiplication', percentage: 78 },
    { name: 'Division', percentage: 63 },
];

const ReportGraph: React.FC<P> = (props: any) => {

    return <div style={{ textAlign: 'center' }}>
        <BarChart
            width={1000}
            height={500}
            data={data}
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

export default ReportGraph