import React, { useState } from 'react'
import cond from 'cond-construct'
import clsx from 'clsx'

import { AppLayout } from 'components/Layout/appLayout'
import { SettingTab } from './settings'
import { ActionTab } from './actions'
import { StatsTab } from './statistics'

enum Tabs {
	SETTINGS,
	ACTIONS,
	STATS
}

export const Home = () => {

	const [activeTab, setActiveTab] = useState(Tabs.SETTINGS)

	const renderComponent = () => (
		cond([
			[activeTab === Tabs.SETTINGS, () => <SettingTab />],
			[activeTab === Tabs.ACTIONS, () => <ActionTab />],
			[activeTab === Tabs.STATS, () => <StatsTab />],
		])
	)

	return (
		<AppLayout title="Home">
			<div className="sticky inset-0 top-16">
				<Tabbar tab={activeTab} setTab={setActiveTab} />
			</div>

			{renderComponent()}
		</AppLayout>
	)
}

type TabbarProps = {
	tab: Tabs
	setTab: (tab: Tabs) => void
}

const Tabbar = ({ tab, setTab }: TabbarProps) => {
	return (
		<div className="text-center w-full inline-grid grid-cols-3 ga-x-4 bg-teal-500 px-4 pt-8 pb-0 shadow-xl text-teal-200 text-lg">
			<div
				onClick={() => setTab(Tabs.SETTINGS)}
				className={clsx("pb-2 cursor-pointer", { "border-b-4 border-white text-white": tab === Tabs.SETTINGS })}>
				Settings
			</div>
			<div
				onClick={() => setTab(Tabs.ACTIONS)}
				className={clsx("pb-2 cursor-pointer", { "border-b-4 border-white text-white": tab === Tabs.ACTIONS })}>
				Actions
			</div>
			<div
				onClick={() => setTab(Tabs.STATS)}
				className={clsx("pb-2 cursor-pointer", { "border-b-4 border-white text-white": tab === Tabs.STATS })}>
				Statistics
			</div>
		</div>
	)
}