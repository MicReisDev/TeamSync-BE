const express = require('express');
const Router = require('./src/app/routes/Routes');
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT


app.use(cors({ origin: '*', methods: '*' }))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(express.static('arquivos'))
app.use('/static', express.static('arquivos'));

app.use(Router)

app.listen(port, () => console.log(`Escutando na porta ${port}`))
app.get('/', (req, res) => res.send('Backend Aprovações'))