#!/usr/bin/env node
const db = require('./db/db')
const config = require('./config')
const Thread = require('./models/thread-model')
const Comment = require('./models/comment-model')
const Image = require('./models/image-model')
const tool = require('./tool/tool')

const rabbitMQ = config.rabbitMQ

db.on('error', console.error.bind(console, "MongoDB Atlas connection error"))

error_400 = (msg) => {
    let res = {
        status: 400,
        body: {
            msg: msg
        }
    }
    return JSON.stringify(res);
}

serverError = () => {
    let res = {
        status: 500,
        body: {
            msg: "Server error"
        }
    }
    return JSON.stringify(res);
}

postThread = async (req) => {
    try {
        console.log(req);
        const { title, author, category, tags, images, content } = req;

        if (!title || !author || !category || !tags || images === undefined || content === undefined) {
            return error_400("Missing Paratemers")
        }

        let image_ids = [];
        for (let i = 0; i < images.length; i++) {
            const image = new Image({ data: images[i] });
            image.save().then(() => {
                console.log("Image created and saved");
                image_ids.push(image._id);
            }).catch(err => {
                console.log("Image save error");
                console.log(err);
            })
        }

        const newThread = new Thread({
            title: title,
            author: author,
            category: category,
            tags: tags,
            images: image_ids,
            content: content,
            comments: [],
            favorited_by: [],
        })

        newThread.save().then(() => {
            console.log("New thread created");
            let res = {
                status: 200,
                body: "Ok",
            }
            return JSON.stringify(res);
        }).catch(err => {
            console.log("New thread error -- not created");
            return server_error();
        });
    }
    catch (err) {
        console.error(err);
        return server_error();
    }
}



getCookThreadList = async (req) => {
    const {page} = req
    let threads = await Thread.find({category: false}).sort('updatedAt', -1).skip(10 * page)
    .limit(page)
    if (!threads) {
        let res = {
            status: 404,
            body: {
                msg: "Index out of range"
            }
        }
        return JSON.stringify(res)
    }
    else {
        for (let index = 0; index < threads.length; index++) {
            const thread = threads[index];
            let author = tool.getUserById(thread.author)
            if (author) {
                thread.author = author.name;
            }
            thread.category = "Cook"
            // TODO image
            thread.comments = thread.comments.length
        }
        let res = {
            status: 200,
            threadlist: threads,
            body: {
                msg: "OK"
            }
        }
        return JSON.stringify(res)
    }
}

getEatThreadList = async (req) => {
    //TODO, after testing getCookThreadList
}

getThread = async (req) => {
    const { id } = req;
    if (!id) {
        let res = {
            status: 400,
            body: "Missing parameters",
        }
        return JSON.stringify(res);
    }
    else {
        const thread = await Thread.findById({ _id: id })
        if (!thread) {
            let res = {
                status: 500,
                body: {
                    msg: "Thread does not exist!"
                }
            }
            return JSON.stringify(res)
        }
        else {
            // TODO image
            for (let index = 0; index < thread.comments.length; index++) {
                const commentId = thread.comments[index];
                let comment = Comment.findById({_id: commentId})
                if (!comment) {
                    let res = {
                        status: 500,
                        body: {
                            msg: "Internal error"
                        }
                    }
                    return JSON.stringify(res)
                }
                if (comment.forum !== id) {
                    let res = {
                        status: 500,
                        body: {
                            msg: "Internal error"
                        }
                    }
                    return JSON.stringify(res)
                }
                let author = tool.getUserById(comment.author)
                if (author) {
                    comment.author = author.name;
                }
            }
            let res = {
                status: 200,
                thread: thread,
                body: {
                    msg: "OK"
                }
            }
            return JSON.stringify(res)
        }
    }
}



const amqp = require('amqplib/callback_api');
amqp.connect(rabbitMQ, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'create_forum';

        channel.assertQueue(queue, {
            durable: false
        });
        channel.prefetch(1);
        console.log(' [x] Awaiting RPC requests');
        channel.consume(queue, function reply(msg) {
            create_forum(JSON.parse(msg.content.toString())).then((res) => {
                channel.sendToQueue(msg.properties.replyTo,
                    Buffer.from(res.toString()), {
                    correlationId: msg.properties.correlationId
                });

                channel.ack(msg);
            })
        });
    });

    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'login';

        channel.assertQueue(queue, {
            durable: false
        });
        channel.prefetch(1);
        console.log(' [x] Awaiting RPC requests');
        channel.consume(queue, function reply(msg) {
            login(JSON.parse(msg.content.toString())).then((res) => {
                channel.sendToQueue(msg.properties.replyTo,
                    Buffer.from(res.toString()), {
                    correlationId: msg.properties.correlationId
                });

                channel.ack(msg);
            })
        });
    });
});


// update_thread = async(req) => {
//     console.log(req);
//     const { id, title, author, category, tags, images, content, comments, favorited_by } = req;

//     if ( !id || !title || !author || !category || !tags || images === undefined || content === undefined || comments === undefined || !favorited_by === undefined ) {
//         return error_400("Missing Parameters");
//     }

//     const forum = await Forum.findById(id);
//     if (!forum) {
//         return error_400("Thread does not exist");
//     }

//     let res = {
//         status: 200,
//         body: forum
//     }
//     return JSON.stringify(res);

// }

// delete_thread = async(req) => {
//     console.log(req);
//     const { id } = req;
//     if (!id) {
//         return error_400("Missing Parameters");
//     }

//     Forum.findByIdAndDelete(id).then(() => {
//         console.log("Thread deleted");
//         let res = {
//             status: 200,
//             body: "Ok"
//         }
//         return JSON.stringify(res);
//     }).catch(err => {
//         console.log("Forum deletion error");
//         console.log(err);
//         return server_error();
//     });

// }


// favorite = async(req) => {
//     const { id, forum_id } = req;
//     if ( !id || !forum_id ) {
//         return error_400("Missing Parameters");
//     }

//     let user = User.findById(id);
//     if (!user) {
//         return error_400("User does not exist");
//     }

//     let forum = Forum.findById(forum_id);
//     if (!forum) {
//         return error_400("Thread does not exist")
//     }

//     let found = user.favorites.indexOf(forum_id)
//     if (found >= 0) {
//         return error_400("Thread already favorited");
//     }
//     user.favorites.push(forum_id);
//     forum.favorited_by++;

//     user.save().then(() => {
//         console.log("User favorites updated");
//         forum.save().then(() => {
//             console.log("Thread favorite updated")
//             let res = {
//                 status: 200,
//                 body: "Ok"
//             }
//             return JSON.stringify(res);
//         }).catch(err => {
//             console.log("Thread favorite error");
//             console.log(err);
//             return server_error();
//         })
//     }).catch(err => {
//         console.log("User favorite error");
//         console.log(err);
//         return server_error();
//     });
// }

// unfavorite = async(req) => {
//     const { id, forum_id } = req;
//     if ( !id || !forum_id ) {
//         return error_400("Missing parameters");
//     }

//     let user = User.findById(id);
//     if (!user) {
//         return error_400("User does not exist")
//     }

//     let forum = Forum.findById(forum_id);
//     if (!forum) {
//         return error_400("Thread does not exist")
//     }

//     let found = user.favorites.indexOf(forum_id)
//     if (found >= 0) {
//         return error_400("Thread already favorited")
//     }
//     user.favorites.splice(found, 1);
//     forum.favorited_by--;

//     user.save().then(() => {
//         console.log("User unfavorites updated");
//         forum.save().then(() => {
//             console.log("Thread unfavorite updated");
//             let res = {
//                 status: 200,
//                 body: "Ok"
//             }
//             return JSON.stringify(res);
//         }).catch(err => {
//             console.log("Thread unfavorite error");
//             console.log(err);
//             return server_error();
//         })
//     }).catch(err => {
//         console.log("User unfavorite error");
//         console.log(err);
//         return server_error();
//     });
// }

// getRandomThreadList = async(req) => {

// }