import React from 'react';
import { useState } from 'react';

export function useUser() {
	const [email, setemail] = useState('');
	const [password, setpassword] = useState('');
	const [token, settoken] = useState('');
	const [Logged, setLogged] = useState(false);
	// const [verified, setverified] = useState(false)

	const checkCredentials = () => {};
	const logIn = (passed_email, passed_password) => {
		if (Logged == false) {
			setemail(passed_email);
			setpassword(passed_password);
			// settoken("abc")
			setLogged(true);
		}
		return true;
	};
	const logOut = () => {};
	const SignIn = () => { };
	// function isLogged() {
	// 	return Logged;
	// }
     const isLogged = () => {
          return Logged;
     }

	return {
		// user,
		checkCredentials,
		logIn: logIn(email,password),
		logOut,
		SignIn,
		Logged,
		isLogged: isLogged(),
	};
}

// export { useUser2 };
