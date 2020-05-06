const router = require('express').Router();

const dataBase = require(`./db`);

//New post
router.post("/", (req, res) => {
    console.log('body is', req.body);
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({
            message: 'Please provide title and contents for the post.',
        })
    }
    dataBase.insert(req.body).then(data => {
        res.status(201).json(data);
    })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'There was an error while saving the post to the database',
            });
        });

});

//posting comment to the id
router.post("/:id/comments", (req, res) => {
    const id = req.params.id;

    dataBase.find(req.query).then(data => {
        for (let i = 0; i < data.length; i++) {
            if (i == data.length - 1 && data[i].id != id) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
            else if (data[i].id == id) {
                if (!req.body.text) {
                    res.status(400).json({
                        message: "Please provide text for the comment."
                    })
                } else {
                    const comment = { ...req.body, post_id: id };
                    dataBase.insertComment(comment).catch(err => {
                        res.status(500).json({
                            message: "There was an error while saving the comment to database."
                        })
                    });
                    res.status(201).json(comment);
                }
            }
        }
    });
})

//list all posts
router.get('/', (req, res) => {
    dataBase.find(req.query).then(data => {
        res.status(200).json(data);
    })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "The posts information could not be retrieved.",
            });
        });
});

//finding post by id
router.get('/:id', (req, res) => {
    const id = req.params.id;
    console.log('id is ', id)
    dataBase.find(req.query).then(data => {
        for (let i = 0; i < data.length; i++) {
            if (i == data.length - 1 && data[i].id != id) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            } else if (data[i].id == id) {
                console.log('got it');
                res.status(200).json(data[i]);
            }
        };
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: "The post information could not be retrieved."
        })
    });
});

//finding all comments by id
router.get("/:id/comments", (req, res) => {
    const id = req.params.id;
    dataBase.findById(id).then(data => {
        if (data.length < 1) {
            res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        }
        else {
            dataBase.findPostComments(id).then(data => {
                res.status(200).json(data);
            })
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: "The comments information could not be retrieved."
        })
    })
    /*dataBase.findPostComments(id).then(data=>{
        res.status(200).json(data);
    })
    dataBase.find(req.query).then(data => {
        for (let i = 0; i < data.length; i++) {
            if (i == data.length - 1 && data[i].id != id) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }else if (data[i].id == id) {
                console.log('found it')
                dataBase.findPostComments(id).then(data=>{
                    console.log(data);
                    res.status(200).json({data});
                    //console.log(comments);
                    //commentList = comments
                    //res.status(200).json(comments)
                    //res.status(200).json({message: "dddddd"})
                })
                res.status(200).json({message: 'we did it'});
            }
            
        }
    })*/
    /*
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: "The comments information could not be retrieved."
        })
    })
    */
})

//delete post by id
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    dataBase.findById(id).then(data => {
        if (data.length < 1) {
            res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        }
        else {
            dataBase.remove(id).then(idRemoved => {
                console.log(idRemoved);
                res.status(200).json(data);
            })
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: "The post could not be removed."
        })
    })
})

//edit post by id
router.put("/:id", (req, res) => {
    const id = req.params.id;
    console.log(id);
    const post = req.body;
    dataBase.findById(id).then(data => {
        if (data.length < 1) {
            res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        } else if (!req.body.title || !req.body.contents) {
            res.status(400).json({
                errorMessage: "Please provide title and contents for the post."
            })
        } else {
            dataBase.update(id, post).then(updated=>{
                console.log(updated);
            })
            res.status(200).json(post);
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: "The post information could not be modified."
        })
    })
})

module.exports = router;