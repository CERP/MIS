import { Spinner } from 'components/animation'
import React from 'react'

type P1 = {
	title: string
	attendance?: {
		present: number
		absent: number
		leave: number
	}
	loading: boolean
}

type P2 = {
	title: string
	payment: {
		count: number
		amount: number
	}
}

const AttendanceCard: React.FC<P1> = ({ title, attendance, loading }) => (
	<CardWrapperInner>
		<CardTitle title={title} />
		<div className="flex justify-between p-2 text-white text-sm">
			<div className="bg-green-500 leading-tight p-3 mr-2 rounded-lg w-24">
				<p>Present</p>
				{loading ? <Spinner className="mx-auto" /> : <p>{attendance?.present || '0'}</p>}
			</div>
			<div className="bg-red-500 leading-tight p-3 mr-2 rounded-lg w-24">
				<p>Absent</p>
				{loading ? <Spinner className="mx-auto" /> : <p>{attendance?.absent || '0'}</p>}
			</div>
			<div className="bg-blue-500 leading-tight p-3 rounded-lg w-24">
				<p>Leave</p>
				{loading ? <Spinner className="mx-auto" /> : <p>{attendance?.leave || '0'}</p>}
			</div>
		</div>
	</CardWrapperInner>
)

const PaymentReceivedCard: React.FC<P2> = ({ title, payment }) => (
	<CardWrapperInner>
		<CardTitle title={title} />
		<div className="flex justify-center p-2 text-white text-sm">
			<div className="bg-green-500 leading-tight p-3 mr-2 rounded-lg w-24">
				<p>Students</p>
				<p>{payment?.count || '0'}</p>
			</div>
			<div className="bg-red-500 leading-tight p-3 mr-2 rounded-lg w-24">
				<p>Amount</p>
				<p>{payment?.amount || '0'}</p>
			</div>
		</div>
	</CardWrapperInner>
)

const CardWrapperInner: React.FC = ({ children }) => (
	<div className="w-full md:w-1/2 px-2">
		<div className="rounded-lg border shadow-md mb-4 h-40">
			<div className="px-3 py-5 text-center text-lg relative z-10 space-y-2">
				{children}
			</div>
		</div>
	</div>
)

const CardTitle: React.FC<{ title: string }> = ({ title }) => (
	<h4 className="font-semibold leading-tight mb-4 text-gray-700 text-lg uppercase">{title}</h4>
)

const CardWrapper: React.FC = ({ children }) => (
	<div className="flex flex-row items-center justify-between">
		<div className="w-full max-w-4xl">
			<div className="-mx-2 md:flex">
				{
					children
				}
			</div>
		</div>
	</div>

)

export { AttendanceCard, PaymentReceivedCard, CardWrapper }