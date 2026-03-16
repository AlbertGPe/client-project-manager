import React, { createContext, useCallback, useState } from 'react'

const AuthContext = createContext();

const restoreUserFromLocalStorage = () => {
  const user = localStorage.getItem('current-user');
  if (user) {
    return JSON.parse(user);
  } else {
    return undefined;
  }
}

function AuthStore({ children }) {
  const [user, setUser] = useState(restoreUserFromLocalStorage());

 const handleUserChange = useCallback((user) => {
    console.log('Updating user context', user);
    if (!user) {
      localStorage.removeItem('current-user');
      localStorage.removeItem('user-access-token');
    } else {
      localStorage.setItem('user-access-token', user.token);
      localStorage.setItem('current-user', JSON.stringify(user));
    }
    setUser(user);
  }, [])

  return (
   <AuthContext.Provider value={{ user, onUserChange: handleUserChange }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthStore as default, AuthContext}