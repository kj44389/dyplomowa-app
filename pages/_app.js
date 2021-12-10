import 'tailwindcss/tailwind.css';
import { AuthContextProvider } from '../lib/AuthContext';

function MyApp({ Component, pageProps }) {
	return (
		<>
			<AuthContextProvider>
				<Component {...pageProps} />
			</AuthContextProvider>
		</>
	);
}

export default MyApp;
