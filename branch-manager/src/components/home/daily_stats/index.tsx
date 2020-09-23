import React from 'react'

type P1 = {
	title?: string
	attendance?: {
		present: number
		absent: number
		leave: number
	}
}

type P2 = {
	title?: string
	payment: {
		count: number
		amount: number
	}
}

const AttendanceCard: React.FC<P1> = ({ title, attendance }) => (

	<div className="w-full md:w-1/3 px-2">
		<div className="rounded-lg shadow-sm mb-4">
			<div className="rounded-lg bg-white shadow-lg md:shadow-xl relative overflow-hidden">
				<div className="px-3 pt-8 pb-10 text-center relative z-10">
					<h4 className="text-sm uppercase text-gray-500 leading-tight">{title}</h4>
					<p className="text-xs text-green-500 leading-tight">Present: {attendance?.present}</p>
					<p className="text-xs text-red-500 leading-tight">Absent: {attendance?.absent}</p>
					<p className="text-xs text-blue-500 leading-tight">Leave: {attendance?.leave}</p>
				</div>
			</div>
		</div>
	</div>
)

const PaymentReceivedCard: React.FC<P2> = ({ title, payment }) => (

	<div className="w-full md:w-1/3 px-2">
		<div className="rounded-lg shadow-sm mb-4">
			<div className="rounded-lg bg-white shadow-lg md:shadow-xl relative overflow-hidden">
				<div className="px-3 pt-8 pb-10 text-center relative z-10">
					<h4 className="text-sm uppercase text-gray-500 leading-tight">{title}</h4>
					<p className="text-xs text-green-500 leading-tight">Students: {payment?.count}</p>
					<p className="text-xs text-red-500 leading-tight">Amount: {payment?.amount}</p>
				</div>
			</div>
		</div >
	</div >
)

const CardWrapper: React.FC = ({ children }) => (
	<div className="min-w-screen min-h-screen bg-gray-200 flex items-center justify-center px-5 py-5">
		<div className="w-full max-w-3xl">
			<div className="-mx-2 md:flex">
				{
					children
				}
			</div>
		</div>
	</div>

)

export { AttendanceCard, PaymentReceivedCard, CardWrapper }