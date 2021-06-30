import React, { useState } from 'react'
import cond from 'cond-construct'

import { Tabbar } from 'components/tabs'
import { AppLayout } from 'components/Layout/appLayout'

import { DefaultFee } from './default'
import { AdditionalFee } from './additional-fee'
import { Scholarship } from './scholarship'

enum Tabs {
	CLASS_FEE,
	ADDITIONAL,
	SCHOLARSHIP
}

const TabbarContent = [
	{
		tab: Tabs.CLASS_FEE,
		title: 'Class Fee'
	},
	{
		tab: Tabs.ADDITIONAL,
		title: 'Additionals'
	},
	{
		tab: Tabs.SCHOLARSHIP,
		title: 'Scholarship'
	}
]

export const FeeSettings = () => {
	const [activeTab, setActiveTab] = useState(Tabs.CLASS_FEE)

	const renderComponent = () =>
		cond([
			[activeTab === Tabs.CLASS_FEE, () => <DefaultFee />],
			[activeTab === Tabs.ADDITIONAL, () => <AdditionalFee />],
			[activeTab === Tabs.SCHOLARSHIP, () => <Scholarship />]
		])

	return (
		<AppLayout title={'Fee Settings'}>
			<Tabbar tab={activeTab} setTab={setActiveTab} content={TabbarContent} />
			{renderComponent()}
		</AppLayout>
	)
}
