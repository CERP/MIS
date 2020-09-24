import React, { useEffect, useState } from 'react'

import { user_service } from 'services'
import { AttendanceCard, CardWrapper, PaymentReceivedCard } from './cards'


type P = {
    school_id: string
}

type S = {
    attendance: {
        present: number
        leave: number
        absent: number
    }
    payment: {
        count: number
        amount: number
    }
}

const DailyStats: React.FC<P> = ({ school_id }) => {

    const [stats, setStats] = useState<S>({
        attendance: {
            present: 0,
            leave: 0,
            absent: 0
        },
        payment: {
            count: 0,
            amount: 0,
        }
    })

    useEffect(() => {

        user_service.fetch_daily_stats(school_id)
            .then(
                data => {
                    console.log(data)
                    setStats(data)
                },
                error => {
                    console.log(error)
                }
            )

    }, [school_id])

    return (
        <CardWrapper>
            <AttendanceCard title={"Student Attendance"} attendance={stats.attendance} />
            <PaymentReceivedCard title={"Student Payments"} payment={stats.payment} />
        </CardWrapper>
    )
}

export { DailyStats }