import React from 'react'
import cond from 'cond-construct'
import { Link, RouteComponentProps } from 'react-router-dom'

import { FeeSettings } from './settings'
import { VoucherSettings } from './voucher-settings'
import { FamilyPayments } from './payments/family'
import { StudentPayments } from './payments/student'
import { ResetFee } from './reset'
import { PrintVoucher } from './print-voucher'
import { AppLayout } from 'components/Layout/appLayout'
import Card from 'components/cards/pill-button'

import iconFeeSettings from './assets/fee-settings.svg'
import iconSinglePayment from './assets/single-payment.svg'
import iconMultiplePayments from './assets/multiple-payments.svg'
import iconPrinter from './assets/printer.png'
import iconVoucherSettings from './assets/voucher-settings.png'

const MenuItems = [
	{
		title: 'Fee Settings',
		link: '/fees/settings',
		icon: iconFeeSettings
	},
	{
		title: 'Voucher Settings',
		link: '/fees/voucher-settings',
		icon: iconVoucherSettings
	},
	{
		title: 'Print Voucher',
		link: '/fees/print-voucher',
		icon: iconPrinter
	},
	{
		title: 'Family Payment',
		link: '/fees/family',
		icon: iconMultiplePayments
	},
	{
		title: 'Student Payment',
		link: '/fees/student',
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
					<div className="p-6 mx-auto space-y-4 md:w-2/5">
						<div className="text-2xl font-bold text-center">Manage Fees</div>
						<div className="text-right">
							<Link to="/fees/reset" className="shadow-md tw-btn-red rounded-3xl">
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
