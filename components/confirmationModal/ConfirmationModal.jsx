const ConfirmationModal = ({ setConfirmation, modalAction, setModalAction, modalText }) => {
	const toggleModal = () => {
		setModalAction('');
	};
	return (
		<div className={`modal ${modalAction}`} id='my-modal-2' onClick={toggleModal}>
			<div className='modal-box text-center'>
				<h3 className='text-lg font-bold'>Confirmation</h3>
				<p className='py-4'>{modalText}</p>
				<div className='modal-action x-space-3 flex justify-center'>
					<button
						className='btn  btn-outline  btn-error'
						onClick={(e) => {
							setConfirmation(true);
						}}>
						Yes i want to delete
					</button>
					<button className='btn btn-outline btn-accent'>No</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationModal;
