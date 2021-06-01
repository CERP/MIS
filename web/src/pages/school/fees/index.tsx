import React from 'react'
import cond from 'cond-construct'
import { Link, RouteComponentProps } from 'react-router-dom'

import { FeeSettings } from './settings'
import { VoucherSettings } from './voucher-settings'
import { Family } from 'pages/family/list'
import { ResetFee } from './reset'
import { PrintVoucher } from './print-voucher'
import { AppLayout } from 'components/Layout/appLayout'
import Card from 'components/cards/pill-button'

import iconFeeSettings from './assets/fee-settings.svg'
import iconSinglePayment from './assets/single-payment.svg'
import iconMultiplePayments from './assets/multiple-payments.svg'
import iconPrinter from './assets/printer.png'
import iconVoucherSettings from './assets/voucher-settings.png'
import { StudentList } from 'pages/students/list'

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
		title: 'Family Payments',
		link: '/fees/families',
		icon: iconMultiplePayments
	},
	{
		title: 'Student Payments',
		link: '/fees/students',
		icon: iconSinglePayment
	}
]

enum Pages {
	FEE_SETTINGS = 'settings',
	VOUCHER_SETTINGS = 'voucher-settings',
	PRINT_VOUCHER = 'print-voucher',
	FAMILY_PAYMENTS = 'families',
	STUDENT_PAYMENTS = 'students',
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
			[
				page === Pages.FAMILY_PAYMENTS,
				<Family key={Pages.FAMILY_PAYMENTS} forwardTo="payments" pageTitle="Families" />
			],
			[
				page === Pages.STUDENT_PAYMENTS,
				<StudentList
					forwardTo={'payments'}
					excludeFamilyStudents={true}
					key={Pages.STUDENT_PAYMENTS}
				/>
			],

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
