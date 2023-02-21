import React, { useEffect, useState } from '../react';


export const Request = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('https://api.github.com/users')
    .then(response => response.json())
    .then(data => setUsers(data))
  }, [])

  return (
    <div>
      <h1>Requisições</h1>
      <ul>
        {
          users.map(user => (
            <li>
              {user.login}
            </li>
          ))
        }
      </ul>
    </div>
  )
}
