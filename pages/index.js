import fetch from 'isomorphic-fetch';
import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Layout from '../components/Layout/Layout';
import AuthContext from '../lib/AuthContext';

export default function Home({ Component , pageProps}) {
  // const [users, setUsers] = useState([]);

	// useEffect(async () => {
  //   const response = fetch('./api/user/getAllUsers')
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       return (data[0]);
  //     })
  //     .then((data) => {
  //       // console.log(data)
  //       // console.log(crypto.randomUUID())
  //       setUsers([{uuid:uuidv4(), data: data }])
  //     })
	// }, []);

  const { user , login } = useContext(AuthContext);

	return (
    // <>
      <Layout>
        <p>nested text</p>
      </Layout>

		// </>
	);
}
