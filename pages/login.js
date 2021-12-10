import React from 'react';
import LoginForm from '../components/form/LoginForm';
import AuthContext from '../lib/AuthContext';
import { useContext } from 'react';


function login() {

     const { user , login } = useContext(AuthContext);
     return (
          <div className='w-[100vw] h-[100vh] flex justify-center items-center bg-blue-50'>
               {/* <LoginForm /> */}
               {login()}
          </div>
     )
}

export default login
