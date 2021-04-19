import React, { useState } from 'react'
import cond from 'cond-construct'

import { SettingsTab } from './settings'
import { ActionTab } from './actions'
import { StatsTab } from './statistics'

import { AppLayout } from 'components/Layout/appLayout'
import { Tabbar } from 'components/tabs'

enum Tabs {
	SETTINGS,
	ACTIONS,
	STATS
}

const TabbarContent = [
	{
		tab: Tabs.SETTINGS,
		title: 'Settings'
	},
	{
		tab: Tabs.ACTIONS,
		title: 'Actions'
	},
	{
		tab: Tabs.STATS,
		title: 'Statistics'
	}
]

export const Home = () => {
	const [activeTab, setActiveTab] = useState(Tabs.ACTIONS)

	const renderComponent = () =>
		cond([
			[activeTab === Tabs.SETTINGS, () => <SettingsTab />],
			[activeTab === Tabs.ACTIONS, () => <ActionTab />],
			[activeTab === Tabs.STATS, () => <StatsTab />]
		])

	return (
		<AppLayout title={'Home' + ' - ' + TabbarContent[activeTab].title}>
			<Tabbar tab={activeTab} setTab={setActiveTab} content={TabbarContent} />
			{renderComponent()}
		</AppLayout>
	)
}
