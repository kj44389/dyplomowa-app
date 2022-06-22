import Head from "next/head";
import Navbar from "./Navbar/Navbar";

function Layout({ children }) {
	return (
		<>
			{/* Head */}
			<Head>
				<title>ExamineLab - Your best online testing site</title>
				<meta name="title" content="ExamineLab - Your best online testing site" />
				<meta
					name="description"
					content="ExamineLab is a site created with passion for people to create and share their tests. You can create tests add youtube videos to your questions and answers. Even audio files are available!"
				/>

				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://metatags.io/" />
				<meta property="og:title" content="ExamineLab - Your best online testing site" />
				<meta
					property="og:description"
					content="ExamineLab is a site created with passion for people to create and share their tests. You can create tests add youtube videos to your questions and answers. Even audio files are available!"
				/>
				<meta
					property="og:image"
					content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"
				/>

				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://metatags.io/" />
				<meta property="twitter:title" content="ExamineLab - Your best online testing site" />
				<meta
					property="twitter:description"
					content="ExamineLab is a site created with passion for people to create and share their tests. You can create tests add youtube videos to your questions and answers. Even audio files are available!"
				/>
				<meta
					property="twitter:image"
					content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"
				/>
			</Head>
			{/* Navbar */}
			<Navbar />

			{/* content */}
			<main className="mx-auto max-w-5xl flex-wrap" data-theme="dark">
				{children}
			</main>
		</>
	);
}

export default Layout;
