import React from 'react'
import cond from 'cond-construct'
import { Link, RouteComponentProps } from 'react-router-dom'

import { FeeSettings } from './settings'
import { VoucherSettings } from './voucher-settings'
import { FamilyPayments } from './payments/family'
import { StudentPayments } from './payments/student'
import { ResetFee } from './reset'
import { PrintVoucher } from './print-voucher'
import Card from 'components/cards/pill-button'
import { AppLayout } from 'components/Layout/appLayout'

import iconFeeSettings from './assets/fee-settings.svg'
import iconSinglePayment from './assets/single-payment.svg'
import iconMultiplePayments from './assets/multiple-payments.svg'
import iconPrinter from './assets/printer.png'
import iconVoucherSettings from './assets/voucher-settings.png'

const MenuItems = [
	{
		title: 'Fee Settings',
		link: '/school/fees/settings',
		icon: iconFeeSettings
	},
	{
		title: 'Voucher Settings',
		link: '/school/fees/voucher-settings',
		icon: iconVoucherSettings
	},
	{
		title: 'Print Voucher',
		link: '/school/fees/print-voucher',
		icon: iconPrinter
	},
	{
		title: 'Family Payment',
		link: '/school/fees/family',
		icon: iconMultiplePayments
	},
	{
		title: 'Student Payment',
		link: '/school/fees/student',
		icon: iconSinglePayment
	}
]

enum Pages {
	FEE_SETTINGS = 'settings',
	VOUCHER_SETTINGS = 'voucher-settings',
	PRINT_VOUCHER = 'print-voucher',
	FAMILY_PAYMENTS = 'family',
	STUDENT_PAYMENTS = 'student',
	FEE_RESET = 'reset'
}

type Props = RouteComponentProps<{ page: string }>

export const SchoolFees: React.FC<Props> = ({ match }) => {
	const { page } = match.params

	const renderComponent = () =>
		cond([
			[page === Pages.FEE_SETTINGS, <FeeSettings key={Pages.FEE_SETTINGS} />],
			[page === Pages.VOUCHER_SETTINGS, <VoucherSettings key={Pages.VOUCHER_SETTINGS} />],
			[page === Pages.PRINT_VOUCHER, <PrintVoucher key={Pages.PRINT_VOUCHER} />],
			[page === Pages.FAMILY_PAYMENTS, <FamilyPayments key={Pages.FAMILY_PAYMENTS} />],
			[page === Pages.STUDENT_PAYMENTS, <StudentPayments key={Pages.STUDENT_PAYMENTS} />],

			[page === Pages.FEE_RESET, <ResetFee key={Pages.FEE_RESET} />]
		])

	return (
		<>
			{page === undefined ? (
				<AppLayout title={'School Fees'}>
					<div className="p-6 md:w-2/5 mx-auto space-y-4">
						<div className="text-center text-2xl font-bold">Manage Fees</div>
						<div className="text-right">
							<Link
								to="/school/fees/reset"
								className="tw-btn-red rounded-3xl shadow-md">
								Reset
							</Link>
						</div>
						<div className="space-y-4">
							{MenuItems.map((item, index) => (
								<Card key={item.link + index} {...item} />
							))}
						</div>
					</div>
				</AppLayout>
			) : (
				renderComponent()
			)}
		</>
	)
}
