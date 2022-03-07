const Badge = ({ type, text }) => {
	switch (type) {
		case 'info':
			return <span className={`badge badge-info mx-2`}> {text} </span>;
		case 'error':
			return <span className={`badge badge-error mx-2`}> {text} </span>;
		case 'success':
			return <span className={`badge badge-success mx-2`}> {text} </span>;
	}
	return;
};

export default Badge;
