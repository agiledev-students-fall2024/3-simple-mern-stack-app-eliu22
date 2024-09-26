require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data
app.use('/public', express.static('public'));

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

app.get('/about/content', async (req, res) => {
	const text = `
	Hello! I am Eric Liu a senior undergraduate student at NYU pursuing a double degree in Computer Science and Psychology. I was born in Bellevue, Washington and moved to Beijing, China at the age of 3. After graudating high school in Beijing, I've been in New York ever since. In my free time I like to read and play volleyball. Lately, I've been listening to a lot of indie rock and classical music.

	I used to be a big gamer but I've been trying to drastically reduce the amount I game. My game of choice was DOTA 2 where I played ranked DOTA with my friends late into the night. These late nights would spiral into an increasingly worse sleep schedule that affected my social life, academics, and mental health. At some point it became a seriously debiliting addiction that was ruining my life. Nowadays I'm trying to become more of a people person. If you'd like to chat feel free to reach out to me through the class discord ericliu22.

	As a programmer, I have a stronger preference for backend programming. For the past year, I've been daily driving Arch Linux. Because of this, I've become comfortable with CLI. Unfortunately, I don't have a keen aesthetic sense, nor do I have great familiarity with CSS and React. While I have worked with these technologies before, I would say that these are my weaknesses.`
	const image = "/public/about-photo.jpg"
	return res.json({
		text: text,
		image: image
	})
});

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
