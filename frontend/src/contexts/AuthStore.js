import React, { createContext, useState } from 'react'

const AuthContext = createContext();

function AuthStore({ children }) {
  const [user, setUser] = useState();

  const handleUserChange = (user) => {
    setUser(user)
  }

  return (
   <AuthContext.Provider value={{ user, onUserChange: handleUserChange }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthStore as default, AuthContext}