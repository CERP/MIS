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

export const DailyStats: React.FC<P> = ({ school_id }) => {

	const [loading, setLoading] = useState(false)

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

		setLoading(true)

		setTimeout(() => {
			getDailyStats(school_id)
				.then(
					data => {
						setLoading(false)
						console.log(data)
						setStats(data)
					},
					error => {
						setLoading(false)
						console.log(error)
					}
				)
		}, 100);

	}, [school_id])

	return (
		<CardWrapper>
			<AttendanceCard
				title={"Student Attendance"}
				attendance={stats.attendance}
				loading={loading}
			/>
			<AttendanceCard
				title={"Teacher Attendance"}
				attendance={stats.teacher_attendance}
				loading={loading}
			/>
			<PaymentReceivedCard title={"Fee Collection"} payment={stats.payment} />
		</CardWrapper>
	)
}