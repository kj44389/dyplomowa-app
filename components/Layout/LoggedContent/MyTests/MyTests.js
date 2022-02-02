import { useSession } from 'next-auth/react';
import _fetch from 'isomorphic-fetch';
import { v4 } from 'uuid';
import moment from 'moment';
import Link from 'next/link';
import { useState, useEffect } from 'react';
// import crypto from 'crypto'

function MyTests({ tests, testsDone }) {
	const { data: user, status } = useSession();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		console.log(status, user);
		if (status === 'loading' || !user) return null;
		setLoading(false);
		console.log(tests, testsDone);
	}, [status]);

	moment.locale('pl');

	// return (

	// );
}

export default MyTests;
