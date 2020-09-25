import React from 'react'

type P1 = {
    title: string
    attendance?: {
        present: number
        absent: number
        leave: number
    }
}

type P2 = {
    title: string
    payment: {
        count: number
        amount: number
    }
}

const AttendanceCard: React.FC<P1> = ({ title, attendance }) => (
    <CardWrapperInner>
        <CardTitle title={title} />
        <p className="text-xs text-green-500 leading-tight">Present: {attendance?.present}</p>
        <p className="text-xs text-red-500 leading-tight">Absent: {attendance?.absent}</p>
        <p className="text-xs text-blue-500 leading-tight">Leave: {attendance?.leave}</p>
    </CardWrapperInner>
)

const PaymentReceivedCard: React.FC<P2> = ({ title, payment }) => (
    <CardWrapperInner>
        <CardTitle title={title} />
        <p className="text-sm text-green-500 leading-tight">Students: {payment?.count}</p>
        <p className="text-sm text-red-500 leading-tight">Amount: {payment?.amount}</p>
    </CardWrapperInner>
)

const CardWrapperInner: React.FC = ({ children }) => (
    <div className="w-full md:w-1/2 px-2">
        <div className="rounded-lg shadow-md border mb-4">
            <div className="rounded-lg bg-white shadow relative overflow-hidden h-32">
                <div className="px-3 pt-5 pb-10 text-center relative z-10 space-y-2">
                    {children}
                </div>
            </div>
        </div>
    </div>
)

const CardTitle: React.FC<{ title: string }> = ({ title }) => (
    <h4 className="text-sm uppercase font-semibold text-gray-700 leading-tight">{title}</h4>
)

const CardWrapper: React.FC = ({ children }) => (
    <div className="flex items-center justify-center px-5 py-5">
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