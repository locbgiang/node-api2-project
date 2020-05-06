const express = require('express');
const server = express();
const dbRouter = require(`./data/posts-router`);

server.use(express.json());

server.get('/', (req,res) => {
    res.json({message: "API is up"});
});

server.use('/api/posts', dbRouter);

server.listen(5000,()=>{
    console.log(`\nServer Running on http://localhost:5000\n`);
});
