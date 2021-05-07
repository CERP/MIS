import React, { useState } from 'react'
import cond from 'cond-construct'
import { useMediaPredicate } from 'react-media-hook'

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
	const biggerThan880 = useMediaPredicate('(min-width: 880px)')

	const renderComponent = () =>
		cond([
			[activeTab === Tabs.SETTINGS, () => <SettingsTab />],
			[activeTab === Tabs.ACTIONS, () => <ActionTab />],
			[activeTab === Tabs.STATS, () => <StatsTab />]
		])

	if (!biggerThan880) {
		return (
			<AppLayout title={'Home' + ' - ' + TabbarContent[activeTab].title}>
				<Tabbar tab={activeTab} setTab={setActiveTab} content={TabbarContent} />
				{renderComponent()}
			</AppLayout>
		)
	}

	return (
		<AppLayout>
			<div className="grid grid-cols-3 relative">
				<div className="fixed w-4/12">
					<div className="flex flex-col items-center bg-white shadow-md rounded-2xl m-5 border-gray-100 border">
						<h1 className="text-xl font-semibold mt-4">Settings</h1>
						<SettingsTab />
					</div>
				</div>
				<div className="col-start-2 col-end-3">
					<div className="flex flex-col items-center rounded-2xl m-5">
						<h1 className="text-xl font-semibold">Actions</h1>
						<ActionTab />
					</div>
				</div>
				<div className="fixed right-0 w-4/12">
					<StatsTab />
				</div>
			</div>
		</AppLayout>
	)
}
