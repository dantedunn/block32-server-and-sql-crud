const pg = require('pg')
const express = require('express')
const client = new pg.Client(
  process.env.DATABASE_URL || 'postgres://localhost/flavors'
)
const app = express()
const port = 5432
app.use(express.json())
client
  .connect()
  .then(() => console.log('✅ Connected to PostgreSQL'))
  .catch(err => console.error('❌ Connection error:', err))

app.post('/api/flavors', async (req, res, next) => {
  app.post('/api/flavors', async (req, res, next) => {
    const { id, name, is_favorite } = req.body

    try {
      const data = await client.query(
        'INSERT INTO flavors (id, name, is_favorite) VALUES ($1, $2, $3) RETURNING *',
        [id, name, is_favorite]
      )

      res.status(201).json(data.rows[0]) // send back the created row
    } catch (err) {
      console.error('Error inserting flavor:', err)
      next(err) //
    }
  })
})

app.get('/api/flavors', async (req, res, next) => {
  res.json(flavors) //get all flavors
})

app.get('/api/flavors/:id', async (req, res, next) => {
  const flavor = flavors.find(f => f.id === req.params.id)
  if (!flavor) return res.status(404).json({ message: 'Flavor not found' })
  res.json(flavor)
})

app.delete('/api/flavors/:id', async (req, res, next) => {
  const id = parseInt(req.params.id)
  flavors = flavors.filter(flavor => flavor.id !== id)
  res.status(204).end()
})

app.put('/api/flavors/:id', async (req, res, next) => {
  const { name, is_favorite } = req.body
  try {
    const data = await client.query(
      'UPDATE flavors SET name = $1, is_favorite = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name, is_favorite, req.params.id]
    )

    if (data.rows.length === 0)
      return res.status(404).json({ message: 'Flavor not found' })
    res.json(data.rows[0])
  } catch (err) {
    next(err)
  }
})

app.listen(port, async () => {
  
  console.log(`Server is running on http://localhost:${port}`)
})
