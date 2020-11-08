const express = require('express');
const path = require('path');
const data = require('./data.json')
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req,res) =>
{
    res.locals.projects = data.projects;
    res.render('index');
});

app.get('/about', (req,res) =>
{
    res.render('about');
});

app.get('/project/:id', (req,res) =>
{
    const {id} = req.params;
    res.locals.id = id;
    res.locals.projects = data.projects;
    res.render('project');
});

app.get('/project', (req,res) =>
{
    res.render('project');
});

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  app.use((err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status);
    res.send(`<h1>${err.status}</h1>
    <span>Error! Page not found, here is the stack trace: </span>
    <p>${err.stack}</p>`);
  });

const PORT = 3000 || process.env.PORT;

app.listen(PORT, () =>
{
    console.log(`Server is running at ${PORT}`);
});
