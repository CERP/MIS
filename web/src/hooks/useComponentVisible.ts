import React, { useState, useEffect, useRef } from 'react'

export const useComponentVisible = (isVisible: boolean) => {
	const [isComponentVisible, setIsComponentVisible] = useState(isVisible)
	const ref = useRef(null)

	useEffect(() => {
		const handleClickOutside = (e: any) => {
			if (ref.current && !ref.current.contains(e.target) && isComponentVisible) {
				setIsComponentVisible(false)
			}
		}

		document.addEventListener('click', handleClickOutside, true)
		// cleanup
		return () => {
			document.removeEventListener('click', handleClickOutside, true)
		}
	}, [isComponentVisible])

	return { ref, isComponentVisible, setIsComponentVisible }
}
