require('dotenv').config();
const express = require('express')
const axios = require('axios');
const mongoose=require('mongoose');
const cron  = require('node-cron');
const Article = require('./articleSchema')
const app = express();

const db = process.env.DB_URL;
const NAtoken = process.env.NA_TOKEN;
const TNA_token = process.env.TNA_TOKEN;
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', (req, res) =>{
    Article.find({categories: req.body.categories})
    .then(find =>{
        res.send(find)
    })
    .catch(err =>{
        console.log(err)
    })
})

app.post('/', (req, res) => {
    const article = new Article({
        title: req.body.title,
        description: req.body.description,
        source: req.body.source,
        categories: req.body.categories,
        url: req.body.url,
        img: req.body.img,
        date: req.body.date
    });

    article.save()
    .then(data =>{
        res.json(data);
    })
    .catch(err => {
        res.send(err)
    })
})

PORT = 5000;
app.listen(PORT || 3000, () => {
    console.log(`App is listening on port ${PORT || 3000}`)
});

mongoose.Promise = Promise
mongoose.connection.on('connected', async () => {
    cron.schedule('0 0 * * * *', async () => {
        try {
            await generalArticles()
            await politicsArticles();
            await sportsArticles();
            await entertainmentArticles();
            await businessArticles();
            await technologyArticles();
        } catch (error) {
            console.log(error)
        }
    })
    console.log('connected')
    /* await generalArticles()
    console.log('Success') */
    /* await politicsArticles();
    await sportsArticles();
    await entertainmentArticles();
    await businessArticles();
    await technologyArticles(); */
})


const run = async () => {
    await mongoose.connect(db,
        {useNewUrlParser: true, useUnifiedTopology: true} ,
        () => {
    })
}

run().catch(err => console.log(err));

const generalArticles = async () =>{
    await axios.get(`https://api.thenewsapi.com/v1/news/top?api_token=${TNA_token}&language=en&limit=1&category=general`)
        .then(async (res) =>{
            const articles = res.data.data
            await articles.map(async (data) => {
                let i = 0;
                const ar = {
                    title: data.title,
                    description: ((data.description === '' || data.description === null) ? data.snippet : data.description),
                    source: data.source,
                    categories: 'general',
                    url: data.url,
                    img: data.image_url,
                    date: data.published_at
                }
                await Article.find({categories: 'general'})
                .then(async curr => {
                    if(Object.keys(curr).length === 0){
                        let arr = new Article(ar);
                        await arr.save()
                        .then(console.log('added general article'))
                        .catch(err => {err})
                    }
                    else{
                        await Article.replaceOne({_id: curr[i]._id}, ar)
                            .then(console.log('Replaced Article'))
                            .catch(err => {console.log(err)})
                    }
                })
                i++;
            })
        }).catch(err => {
            console.log(err)
        })
}
const politicsArticles = async () =>{
    for (let i = 1; i < 5; i++) {
        await axios.get(`https://api.thenewsapi.com/v1/news/top?api_token=${TNA_token}&language=en&categories=politics&page=${i}`)
        .then(async (res) =>{
            const articles = res.data.data
            await articles.map(async (data) => {
                let i = 0;
                const ar = {
                    title: data.title,
                    description: ((data.description === '' || data.description === null) ? data.snippet : data.description),
                    source: data.source,
                    categories: 'politics',
                    url: data.url,
                    img: data.image_url,
                    date: data.published_at
                }
                await Article.find({categories: 'politics'})
                .then(async curr => {
                    if(Object.keys(curr).length === 0){
                        let arr = new Article(ar);
                        await arr.save()
                        .then(console.log('added politics article'))
                        .catch(err => {console.log(`Error adding politics article: ${err}`)})
                    }
                    else{
                        await Article.replaceOne({_id: curr[i]._id}, ar)
                            .then(console.log('Replaced politics article'))
                            .catch(err => {console.log(`Error replacing politics article: ${err}`)})
                    }
                })
                i++;
            })
        }).catch(err => {
            console.log(err)
        })
    }
}
const entertainmentArticles = async () => {
    await axios.get(`https://newsapi.org/v2/top-headlines?apiKey=${NAtoken}&country=us&category=entertainment&pageSize=21`)
    .then(async (res) =>{
        const articles = res.data.articles;
        await articles.map(async (data) => {
            let i = 0;
                const ar = {
                    title: data.title,
                    description: ((data.description === '' || data.description === null) ? data.snippet : data.description),
                    source: data.source,
                    categories: 'entertainment',
                    url: data.url,
                    img: data.image_url,
                    date: data.published_at
                }
                await Article.find({categories: 'entertainment'})
                .then(async curr => {
                    if(Object.keys(curr).length === 0){
                        let arr = new Article(ar);
                        await arr.save()
                        .then(console.log('added entertainment article'))
                        .catch(err => {console.log(`Error adding entertainment article: ${err}`)})
                    }
                    else{
                        await Article.replaceOne({_id: curr[i]._id}, ar)
                            .then(console.log('Replaced entertainment article'))
                            .catch(err => {console.log(`Error replacing entertainment article: ${err}`)})
                    }
                })
                i++;
        })
    })
    .catch(err => {
        console.log(err)
    })
}
const businessArticles = async () => {
    await axios.get(`https://newsapi.org/v2/top-headlines?apiKey=${NAtoken}&country=us&category=business&pageSize=21`)
    .then(async (res) =>{
        const articles = res.data.articles;
        await articles.map(async (data) => {
            let i = 0;
                const ar = {
                    title: data.title,
                    description: ((data.description === '' || data.description === null) ? data.snippet : data.description),
                    source: data.source,
                    categories: 'business',
                    url: data.url,
                    img: data.image_url,
                    date: data.published_at
                }
                await Article.find({categories: 'business'})
                .then(async curr => {
                    if(Object.keys(curr).length === 0){
                        let arr = new Article(ar);
                        await arr.save()
                        .then(console.log('added business article'))
                        .catch(err => {console.log(`Error adding business article: ${err}`)})
                    }
                    else{
                        await Article.replaceOne({_id: curr[i]._id}, ar)
                            .then(console.log('Replaced business article'))
                            .catch(err => {console.log(`Error replacing business article: ${err}`)})
                    }
                })
                i++;
        })
    })
    .catch(err => {
        console.log(err)
    })
}
const sportsArticles = async () => {
    await axios.get(`https://newsapi.org/v2/top-headlines?apiKey=${NAtoken}&country=us&category=sports&pageSize=21`)
    .then(async (res) =>{
        const articles = res.data.articles;
        await articles.map(async (data) => {
            let i = 0;
                const ar = {
                    title: data.title,
                    description: ((data.description === '' || data.description === null) ? data.snippet : data.description),
                    source: data.source,
                    categories: 'sports',
                    url: data.url,
                    img: data.image_url,
                    date: data.published_at
                }
                await Article.find({categories: 'sports'})
                .then(async curr => {
                    if(Object.keys(curr).length === 0){
                        let arr = new Article(ar);
                        await arr.save()
                        .then(console.log('added sports article'))
                        .catch(err => {console.log(`Error adding sports article: ${err}`)})
                    }
                    else{
                        await Article.replaceOne({_id: curr[i]._id}, ar)
                            .then(console.log('Replaced sports article'))
                            .catch(err => {console.log(`Error replacing sports article: ${err}`)})
                    }
                })
                i++;
        })
    })
    .catch(err => {
        console.log(err)
    })
}
const technologyArticles = async () => {
    await axios.get(`https://newsapi.org/v2/top-headlines?apiKey=${NAtoken}&country=us&category=technology&pageSize=21`)
    .then(async (res) =>{
        const articles = res.data.articles;
        await articles.map(async (data) => {
            let i = 0;
                const ar = {
                    title: data.title,
                    description: ((data.description === '' || data.description === null) ? data.snippet : data.description),
                    source: data.source,
                    categories: 'technology',
                    url: data.url,
                    img: data.image_url,
                    date: data.published_at
                }
                await Article.find({categories: 'technology'})
                .then(async curr => {
                    if(Object.keys(curr).length === 0){
                        let arr = new Article(ar);
                        await arr.save()
                        .then(console.log('added technology article'))
                        .catch(err => {console.log(`Error adding technology article: ${err}`)})
                    }
                    else{
                        await Article.replaceOne({_id: curr[i]._id}, ar)
                            .then(console.log('Replaced technology article'))
                            .catch(err => {console.log(`Error replacing technology article: ${err}`)})
                    }
                })
                i++;
        })
    })
    .catch(err => {
        console.log(err)
    })
}

const clearDB = async (category) =>{
    await Article.deleteMany({categories: category})
        .then(
            console.log(`${category} articles removed from database`)
        ).catch(err => {
            console.log(err)
        })
}

