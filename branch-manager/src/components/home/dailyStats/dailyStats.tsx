import React, { useEffect, useState } from 'react'

import { getDailyStats } from 'services'
import { AttendanceCard, CardWrapper, PaymentReceivedCard } from './cards'


type P = {
	school_id: string
}

type S = {
	attendance: Attendance
	teacher_attendance: Attendance
	payment: {
		count: number
		amount: number
	}
}


interface Attendance {
	present: number
	leave: number
	absent: number
}

const DailyStats: React.FC<P> = ({ school_id }) => {

	const [stats, setStats] = useState<S>({
		attendance: {
			present: 0,
			leave: 0,
			absent: 0
		},
		teacher_attendance: {
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

		getDailyStats(school_id)
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
			<AttendanceCard title={"Teacher Attendance"} attendance={stats.teacher_attendance} />
			<PaymentReceivedCard title={"Fee Collection"} payment={stats.payment} />
		</CardWrapper>
	)
}

export { DailyStats }