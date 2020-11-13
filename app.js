const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const app = express();
const { data } = require('./data/flashcardData.json');
const {cards} = data;

app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.use(express.static('static'));

app.get('/', (req, res) =>
{
    res.render('index');
});

app.get('/hello', (req, res) =>
{
    const name = req.cookies.username;
    if (name) return res.render('hello', {name});
    return res.redirect('/');
    
})

app.post('/', (req, res)=>
{
    res.cookie('username', req.body.username);
    res.redirect('/hello')
});

app.post('/goodbye', (req, res) =>
{
    res.clearCookie('username');
    res.redirect('/');
});

app.get('/card', (req, res)=>
{
    const numberOfCards = cards.length;
    const randomCard = Math.floor( Math.random() *numberOfCards);
    res.redirect(`/card/${randomCard}?side=question`);
});

app.get('/card/:id',(req, res) =>
{
    const {side} = req.query;
    const {id} = req.params;

    const name = req.cookies.username;
    const text = cards[id][side];
    const {hint} = cards[id];

    if ( !side ) return res.redirect(`/card/${id}?side=question`);
    let cardFlip = ''
    if (side === 'question' || side === 'answer')
    {
    if (side === 'question') {
        cardFlip = `${id}?side=answer`
    } else {
        cardFlip = `${id}?side=question`
    }}else{
        return res.redirect(`/card/${id}?side=question`);
    }
    res.render('card', {text, name, side, id, cardFlip, hint});
});

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  app.use((err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status);
    res.render('error');
  });
  
const PORT = process.env.PORT || 80;

app.listen(PORT, ()=>
{
    console.log(`The server is running at ${PORT}`);
})