import { useState, useEffect, useRef } from 'react'

export const useComponentVisible = (initialIsVisible: boolean) => {
    const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible)
    const ref = useRef(null)

    const handleClickOutside = (event: any) => {
        if (ref.current && !ref.current.contains(event.target) && isComponentVisible) {
            setIsComponentVisible(false)
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true)
        return () => {
            document.removeEventListener('click', handleClickOutside, true)
        }
    })

    return { ref, isComponentVisible, setIsComponentVisible }
}