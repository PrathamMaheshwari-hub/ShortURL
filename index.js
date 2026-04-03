const express = require('express');
const path = require('path');
const { connectTOMongoDB } = require('./connect');
const urlRoutes = require('./routes/url');
const staticRouter = require('./routes/staticRouter');
const URL = require('./models/url');
const app = express();
const port = 3000;


connectTOMongoDB('mongodb://localhost:27017/shorturl')
    .then(() => console.log('connected to mongodb'))

app.set('view engine', 'ejs');   
app.set('views', path.resolve('./views')); 
    
 app.use(express.json());
 app.use(express.urlencoded({extended: false}));
 
 app.get("/test",async (req, res) => {
    const allUrls = await URL.find();
    return res.render('home',{
        urls: allUrls,
    })
    });
 


app.use("/url", urlRoutes);
app.use('/', staticRouter);
app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL
        .findOneAndUpdate({ 
            shortId,
        },
            {$push:{
                    visitHistory: {timestamp: Date.now()},
            },
         }
        );
        res.redirect(entry.redirectUrl);
});


app.listen(port, () => console.log(`server is running on port ${port}`));
