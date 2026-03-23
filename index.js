const express = require('express');
const { connectTOMongoDB } = require('./connect');
const urlRoutes = require('./routes/url');
const URL = require('./models/url');
const app = express();
const port = 3000;


connectTOMongoDB('mongodb://localhost:27017/shorturl')
    .then(() => console.log('connected to mongodb'))
   
    
 app.use(express.json());   
app.use("/url", urlRoutes);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL
        .findOneAndUpdate({ 
            shortId},
            {$push:{
                    visitHistory: {timestamp: Date.now()},
            },
         }
        );
        res.redirect(entry.redirectUrl);
});


app.listen(port, () => console.log(`server is running on port ${port}`));
