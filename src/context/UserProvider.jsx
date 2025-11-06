import { useState } from "react";
import { userContext } from "./UserContext";
import axios from "axios";

export default function UserProvider({children}) {
  const userFromStorage = sessionStorage.getItem('user')
  const [user, setUser] = useState(userFromStorage ? JSON.parse(userFromStorage) : {email: '', password: ''})

  const signUp = async () => {
    const headers = {headers: {"Content-Type": "application/json"}}
    await axios.post(`${import.meta.env.VITE_API_URL}/user/signup`, {user}, headers)
    setUser({email: '', password: ''})
  }

  const signIn = async () => {
    const headers = {headers: {"Content-Type": "application/json"}}
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/signin`, {user}, headers)
    setUser(response.data)
    sessionStorage.setItem('user', JSON.stringify(response.data))
  }

  const logOut = async () => {
    sessionStorage.clear()
    localStorage.clear()
    setUser({ email: '', password: '' });
  }

  return (
    <userContext.Provider value={{user, setUser, signUp, signIn, logOut}}>
      {children}
    </userContext.Provider>
  )
}