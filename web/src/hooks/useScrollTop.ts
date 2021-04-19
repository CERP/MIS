import React, { useLayoutEffect } from 'react'

export const useScrollTop = (pathname: string) => {
	useLayoutEffect(() => {
		window.scroll(0, 0)
	}, [pathname])
}
