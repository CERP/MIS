import React from 'react'
import clsx from 'clsx'

type TabbarProps = {
	content: any
	tab: any
	setTab: (tab: any) => void
}

export const Tabbar = ({ tab, setTab, content }: TabbarProps) => {
	return (
		<div className="sticky inset-0 z-30 top-16 bg-teal-brand">
			<div className="inline-grid w-full grid-flow-col text-lg text-center text-gray-200 shadow-md">
				{content.map((item: any) => (
					<div
						key={item.tab}
						onClick={() => setTab(item.tab)}
						className={clsx('py-2 cursor-pointer hover:text-white', {
							'border-b-4 border-white text-white': tab === item.tab
						})}>
						<span>{item.title}</span>
					</div>
				))}
			</div>
		</div>
	)
}