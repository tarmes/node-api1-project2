const express = require('express')
const generate = require('shortid').generate

const app = express()
app.use(express.json())

const PORT = 5000

let users = [
   { 
      id: generate(), 
      name: 'Trevor Armes', 
      bio: 'Indiana raised, worldwide livin' 
   }
]

// [GET]/ALL USERS REQUEST
app.get('/api/users', (req, res) => {
   try {
      res.status(200).json(users)
   } catch (error) {
      res.status(500).json({ errorMessage: "The users information could not be retrieved." })
   }
})

// [GET]:ID USER REQUEST
app.get('/api/users/:id', (req, res) => {
   const { id } = req.params
   const user = users.find(user => user.id === id)
   try {
      if (!user) {
         res.status(404).json({ message: `No user with id ${id}`})
      } else {
         res.status(200).json(user)
      }
   } catch (error) {
      res.status(500).json({ errorMessage: "The user information could not be retrieved." })
   }
   
})

// [POST] NEW USER REQUEST
app.post('/api/users', (req, res) => {
   const { name, bio } = req.body
   try {
      if (!name || !bio) {
         res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
      } else {
         const newUser = {
            id: generate(),
            name,
            bio
         }
         users.push(newUser)
         res.status(201).json(newUser)
      }
   } catch (error) {
      res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
   }
   
})

// [PUT] EDIT USER REQUEST
app.put('/api/users/:id', (req, res) => {
   const { id } = req.params
   const { name, bio } = req.body
   const indexOfUser = users.findIndex(user => user.id === id)
   try {
      if (!name || !bio) {
         res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
      } else if (indexOfUser === -1) {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
         } else {
            users[indexOfUser] = { id, name, bio }
            res.status(200).json({ id, name, bio })
         }
   } catch (error) {
      res.status(500).json({ errorMessage: "The user information could not be modified." })
   }
   
})

// [DELETE] USER REQUEST
app.delete('/api/users/:id', (req, res) => {
   const { id } = req.params
   const indexOfUser = users.findIndex(user => user.id === id)
   const { name, bio } = users[indexOfUser]
   try {
      if (!users.find(user => user.id === id)) {
         res.status(400).json({ message: "The user with the specified ID does not exist." })
      } else {
         users = users.filter(user => user.id !== id)
         res.status(200).json({ 
            message: `User with id ${id} got deleted!!`,
            id,
            name,
            bio
         })
      } 
   } catch (error) {
      res.status(500).json({ errorMessage: "The user could not be removed" })
   }
})

app.all('*', (req, res) => {
   res.status(404).json({ message: 'Not found!'})
})

app.listen(PORT, () => {
   console.log(`LISTENING ON PORT ${PORT}`)
})