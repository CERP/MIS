import React from 'react'

interface P {
    title?: string
    onClose: () => void
}

const TIPModal = (props: P) => {
    const { title, onClose } = props

    return (
        <div className="flex flex-col justify-center item-center rounded-md padding-3 h-2/4 w-9/12 bg-gray-300">
            <div className="right-2 top-2 absolute" onClick={onClose}>
                ✕
			</div>
            <div className="text-center text-red-tip-brand">{title}</div>
            <div>Testing</div>
        </div>
    )
}

export default TIPModal
