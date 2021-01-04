import React from 'react'

export const CustomerFeedback = () => {
	return (
		<div className="w-full md:w-2/3 mt-20 md:mt-0 px-10 md:px-20">
			<div className="relative">
				<div className="h-96 bg-red-brand rounded-xl text-center text-white">
					<div className="pt-28">
						<div className="font-bold">Taimur Shah</div>
						<div>Principal Sarkar School</div>
					</div>
					<div className="mt-5 px-5 md:mt-10 md:px-20 h-28 md:h-24">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum leo nisi, vitae efficitur risus porta a. Nulla lacus ipsum, iaculis ut bibendum in, porta ut quam. Duis iaculis metus varius auctor condimentum.
								</div>
					<div className="flex justify-center items-center mt-10 space-x-2">
						<div className="h-4 w-4 bg-white rounded-full"></div>
						<div className="h-4 w-4 bg-white rounded-full"></div>
						<div className="h-4 w-4 bg-white rounded-full"></div>
					</div>
				</div>
				<div className="absolute -top-10 md:-top-16 left-0 right-0">
					<img src="/images/taimur.jpg" className="mx-auto h-28 w-28 md:h-40 md:w-40 rounded-full p-1 bg-white border-4 border-red-brand shadow-md " alt="school-owner" />
				</div>
			</div>
		</div>
	)
}