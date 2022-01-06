import { getSession, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import LoggedContent from '../components/Layout/LoggedContent/LoggedContent';
import NotLoggedContent from '../components/Layout/notLoggedContent/NotLoggedContent';

export default function Home({ Component, pageProps }) {
	const { data, status } = useSession();
	const user = data;

	return (
		// <>
		<Layout>{user ? <LoggedContent /> : <NotLoggedContent />}</Layout>

		// </>
	);
}
