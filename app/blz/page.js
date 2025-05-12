'use client'
import { useEffect, useState } from 'react'
import "../styles/globals.css";


export default function BanksPage() {
  const [banks, setBanks] = useState([])

  useEffect(() => {
  fetch('/api/blz/show')
    .then((res) => res.json())
    .then((data) => {
      console.log('DATA:', data)
      setBanks(data)
    })
  }, [])


  return (
    <div>
      <h1>Bankenübersicht</h1>
      <table>
        <thead>
          <tr>
            <th>BLZ</th>
            <th>Name</th>
            <th>URL-Pfad</th>
          </tr>
        </thead>
        <tbody>
          {banks.map(bank => (
            <tr key={bank.blz}>
              <td>{bank.blz}</td>
              <td>{bank.name}</td>
              <td>{bank.urlPath}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
