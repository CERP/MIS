import React from 'react'
import cond from 'cond-construct'
import { RouteComponentProps } from 'react-router-dom'

import Card from 'components/cards/pill-button'
import { AppLayout } from 'components/Layout/appLayout'
import { FeeSettings } from './settings'

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
		link: "/school/fee/reset",
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
			[page === Pages.VOUCHER_SETTINGS, <FeeSettings key={Pages.FEE_SETTINGS} />],
			[page === Pages.PRINT_VOUCHER, <FeeSettings key={Pages.FEE_SETTINGS} />],
			[page === Pages.FEE_COLLECTION, <FeeSettings key={Pages.FEE_SETTINGS} />],
			[page === Pages.FEE_RESET, <FeeSettings key={Pages.FEE_SETTINGS} />],
		])
	)

	return (
		<>
			{
				page === undefined ?
					<AppLayout title={"School Fees"}>
						<div className="p-6 md:w-2/5 mx-auto">
							<div className="text-center text-lg mb-6 font-semibold">School Fee</div>
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
