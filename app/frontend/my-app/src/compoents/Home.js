'use client'

import { useState } from 'react'
import Header from './Card/Header'
import BusinessCard from './Card/BusinessCard'
import { businesses } from './data/businesses'
import "./Card/Card.css"

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main className="container">
        <h1>Discover Local Businesses</h1>
        <div className="business-grid">
          {filteredBusinesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      </main>
    </div>
  )
}
