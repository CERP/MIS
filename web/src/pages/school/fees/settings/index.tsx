import React, { useState } from 'react'
import cond from 'cond-construct'

import { Tabbar } from 'components/tabs'
import { AppLayout } from 'components/Layout/appLayout'

import { DefaultFee } from './default'
import { AdditionalFee } from './additional'
import { Scholarship } from './scholarship'

enum Tabs {
	DEFAULT,
	ADDITIONAL,
	SCHOLARSHIP
}

const TabbarContent = [
	{
		tab: Tabs.DEFAULT,
		title: "Default"
	},
	{
		tab: Tabs.ADDITIONAL,
		title: "Additional"
	},
	{
		tab: Tabs.SCHOLARSHIP,
		title: "Scholarship"
	},
]

export const FeeSettings = () => {

	const [activeTab, setActiveTab] = useState(Tabs.DEFAULT)

	const renderComponent = () => (
		cond([
			[activeTab === Tabs.DEFAULT, () => <DefaultFee />],
			[activeTab === Tabs.ADDITIONAL, () => <AdditionalFee />],
			[activeTab === Tabs.SCHOLARSHIP, () => <Scholarship />],
		])
	)

	return (
		<AppLayout title={"Fee Setting"}>
			<Tabbar tab={activeTab} setTab={setActiveTab} content={TabbarContent} />
			{renderComponent()}
		</AppLayout>
	)
}