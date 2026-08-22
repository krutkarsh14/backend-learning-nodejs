// const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
// now we will require bcrypt 
const bcrypt = require('bcrypt');
// app.use(cookieParser())
const PORT = 7000;
// $2b$10$wmoeCvZB9Icz8SGArWxsXOAEykb/.FUNb0.AoZz.1EPIJWr9Y3nNO

app.get('/', (req, res) => {
        // res.cookie('name', 'utkarsh')
        res.send('this is home page...')


        // yese bcrypt password banate hai 

        // bcrypt.genSalt(10, function (err, salt) {
        //         bcrypt.hash('karsh', salt, function (err, hash) {
        //                 // Store hash in your password DB.
        //                 console.log(hash);

        //         });
        // });

        // bcrypt banake ke bad yese check karte hai for check the bcrypt passward

        bcrypt.compare('karsh', '$2b$10$wmoeCvZB9Icz8SGArWxsXOAEykb/.FUNb0.AoZz.1EPIJWr9Y3nNO', function (err, result) {
                // result == true
                console.log(result);
                
        });
})



// app.get('/read', (req, res) => {
//         console.log(req.cookies);

//         res.send('this is read page...')
// })


app.listen(PORT, () => {
        console.log(`this server is running at the ${PORT}`);

})