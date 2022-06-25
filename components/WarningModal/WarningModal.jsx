const WarningModal = ({ handleModalClose }) => {
	return (
		<div className='h-modal fixed top-32 left-1/2 z-50 -translate-x-1/2  items-center justify-center overflow-y-auto overflow-x-hidden sm:h-full ' id='popup-modal'>
			<div className='relative h-full w-full max-w-md px-4 md:h-auto'>
				<div className='relative rounded-lg bg-white shadow dark:bg-gray-700'>
					<div className='flex justify-end p-2'>
						<button
							type='button'
							className='ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white'
							data-modal-toggle='popup-modal'
							onClick={(e) => {
								handleModalClose();
							}}>
							<svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
								<path
									fillRule='evenodd'
									d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
									clipRule='evenodd'></path>
							</svg>
						</button>
					</div>

					<div className='p-6 pt-0 text-center'>
						<svg className='mx-auto mb-4 h-14 w-14 text-red-500 dark:text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
						</svg>
						<h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
							During test You can't use external help. Please finish your test by yourself or Your test will fail.
						</h3>
						<button
							data-modal-toggle='popup-modal'
							type='button'
							className='mr-2 inline-flex items-center rounded-lg bg-green-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300'
							onClick={(e) => {
								handleModalClose();
							}}>
							I'm understand
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WarningModal;
