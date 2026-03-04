import React, { useEffect, useState } from 'react'
import clientService from '../../../services/clients'

function ClientsList() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    clientService.list()
      .then((clients) => setClients(clients))
      .catch((error) => console.error(error))
  }, [])

  return (
    <div>
      <h1>Clients List</h1>
      {clients.map((client) => <div key={client.id}>{client.name}</div>)}
    </div>
  )
}

export default ClientsList