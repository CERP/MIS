import React from 'react'
import clsx from 'clsx'

type TabbarProps = {
	content: any
	tab: any
	setTab: (tab: any) => void
}

export const Tabbar = ({ tab, setTab, content }: TabbarProps) => {
	return (
		<div className="sticky inset-0 top-16 z-30">
			<div className="text-center w-full inline-grid grid-cols-3 ga-x-4 bg-teal-500 px-4 pt-2 pb-0 shadow-lg text-teal-200 text-lg">
				{
					content.map((item: any) => (
						<div key={item.tab}
							onClick={() => setTab(item.tab)}
							className={clsx("pb-2 cursor-pointer", { "border-b-4 border-white text-white": tab === item.tab })}>
							<span>{item.title}</span>
						</div>
					))
				}
			</div>
		</div>
	)
}