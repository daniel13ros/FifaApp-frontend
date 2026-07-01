import { useState, useEffect } from 'react'

const EMPTY_FORM = { name: '', team: '', position: '', rating: '' }

function Players() {
  const [players, setPlayers] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)

  const fetchPlayers = async () => {
    try {
      const res = await fetch('/api/players')
      const data = await res.json()
      setPlayers(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPlayers() }, [])

  const addPlayer = async (e) => {
    e.preventDefault()
    await fetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, rating: Number(form.rating) }),
    })
    setForm(EMPTY_FORM)
    fetchPlayers()
  }

  const deletePlayer = async (id) => {
    await fetch(`/api/players/${id}`, { method: 'DELETE' })
    fetchPlayers()
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">FIFA Players Management</h1>
      
      {/* Form Section */}
      <form onSubmit={addPlayer} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
        <input className="p-2 border rounded-md" placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
        <input className="p-2 border rounded-md" placeholder="Team" value={form.team} onChange={(e) => setForm({...form, team: e.target.value})} required />
        <input className="p-2 border rounded-md" placeholder="Pos" value={form.position} onChange={(e) => setForm({...form, position: e.target.value})} required />
        <input className="p-2 border rounded-md" type="number" placeholder="Rating" value={form.rating} onChange={(e) => setForm({...form, rating: e.target.value})} required />
        <button type="submit" className="bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Add Player</button>
      </form>

      {/* Players List */}
      {loading ? <div className="text-center">Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {players.map((p) => (
            <div key={p._id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center hover:shadow-md transition">
              <div>
                <h3 className="font-bold text-lg">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.team} • {p.position}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-yellow-500 font-bold text-xl">★ {p.rating}</span>
                <button onClick={() => deletePlayer(p._id)} className="text-red-500 hover:text-red-700 px-3 py-1 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Players