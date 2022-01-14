function AccessButton({ heroIcon, onClick, style }) {
	return (
		<span
			onClick={onClick}
			className={style}
			// className="rounded-md h-7 w-20 ml-2 mr-2 text-gray-200 bg-primary hover:text-primary hover:bg-gray-200 transition-colors"
		>
			{heroIcon}
		</span>
	);
}

export default AccessButton;
