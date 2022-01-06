import 'tailwindcss/tailwind.css'

import { SessionProvider, signIn, useSession } from 'next-auth/react'
import { useContext, useEffect } from 'react'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={session}>
            {Component.auth ? (
                <Auth>
                    <Component {...pageProps} />
                </Auth>
            ) : (
                <Component {...pageProps} />
            )}
        </SessionProvider>
    )
}

// function MyApp({ Component, pageProps}) {
// 	return (
// 		<SessionProvider>

// 					<Component {...pageProps} />

// 		</SessionProvider>
// 	);
// }

function Auth({ children }) {
    const { data: session, status } = useSession()
    const isUser = !!session?.user

    useEffect(() => {
        if (status === 'loading') return
        if (!isUser) signIn()
    }, [isUser, status])
    if (isUser) return children
    return <div>Loading...</div>
}

export default MyApp
