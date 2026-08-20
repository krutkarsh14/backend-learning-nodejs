const express = require('express')
const app = express()
const port = 3000
// costum middleware 
const authmiddle = function (req, res, next) {
        console.log('i am first middleware');
        next();
}


app.use(authmiddle)
const loggingmiddle = function () {
        console.log('i am loggin middleware ');
        next();
} 
const lastmiddle = function () {
        console.log('i am lastmiddleware ');
        nextI();
}
app.use(lastmiddle);``
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))