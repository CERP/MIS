import React from 'react'
import cond from 'cond-construct'
import { RouteComponentProps } from 'react-router-dom'

import { FeeSettings } from './settings'
import { VoucherSettings } from './voucher-settings'
import { FeeCollection } from './collection'
import { ResetFee } from './reset'
import { PrintVoucher } from './print-voucher'

import Card from 'components/cards/pill-button'
import { AppLayout } from 'components/Layout/appLayout'

const MenuItems = [
	{
		title: "Fee Settings",
		link: "/school/fees/settings",
		icon: ""
	},
	{
		title: "Voucher Settings",
		link: "/school/fees/voucher-settings",
		icon: ""
	},
	{
		title: "Print Voucher",
		link: "/school/fees/print-voucher",
		icon: ""
	},
	{
		title: "Fees Collection",
		link: "/school/fees/collection",
		icon: ""
	},
	{
		title: "Reset Fees",
		link: "/school/fees/reset",
		icon: ""
	}
]

enum Pages {
	FEE_SETTINGS = "settings",
	VOUCHER_SETTINGS = "voucher-settings",
	PRINT_VOUCHER = "print-voucher",
	FEE_COLLECTION = "collection",
	FEE_RESET = "reset"
}

type Props = RouteComponentProps<{ page: string }>

export const SchoolFees: React.FC<Props> = ({ match }) => {

	const { page } = match.params

	const renderComponent = () => (
		cond([
			[page === Pages.FEE_SETTINGS, <FeeSettings key={Pages.FEE_SETTINGS} />],
			[page === Pages.VOUCHER_SETTINGS, <VoucherSettings key={Pages.VOUCHER_SETTINGS} />],
			[page === Pages.PRINT_VOUCHER, <PrintVoucher key={Pages.PRINT_VOUCHER} />],
			[page === Pages.FEE_COLLECTION, <FeeCollection key={Pages.FEE_COLLECTION} />],
			[page === Pages.FEE_RESET, <ResetFee key={Pages.FEE_RESET} />],
		])
	)

	return (
		<>
			{
				page === undefined ?
					<AppLayout title={"School Fees"}>
						<div className="p-6 md:w-2/5 mx-auto">
							<div className="text-center text-2xl mb-4 font-bold">School Fee</div>
							{
								MenuItems.map((item, index) => (
									<Card key={item.link + index} {...item} />
								))
							}
						</div>
					</AppLayout>
					:
					renderComponent()
			}
		</>
	)
}
