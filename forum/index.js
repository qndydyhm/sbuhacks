#!/usr/bin/env node
const Forum = require('./models/forum-model')
const db = require('./db/db')
const config = require('./config')
const Forum = require('.models/forum-model')
const Image = require('./models/image-model')

const rabbitMQ = config.rabbitMQ

db.on('error', console.error.bind(console, "MongoDB Atlas connection error"))

post_thread = async(req) => {
    try {
        console.log(req);
        const { title, author, category, tags, images, content, comments, favorited_by } = req.body;

        if (!title || !author || !category || !tags || !images || !content || !comments || !favorited_by ) {
            let res = {
                status: 400,
                body: "ok",
            }
            return JSON.stringify(res);
        }

        const newForum = new Forum({
            title: title,
            author: author,
            category: category,
            tags: tags,
            images: images,
            content: content,
            comments: comments,
            favorited_by: favorited_by,
        })

        await newForum.save();
        let res = {
            status: 200,
            body: "Missing parameters",
        }
        return JSON.stringify(res);
    }
    catch (err) {
        console.error(err);
        let res = {
        status: 500,
        body: "server error"
        }
        return JSON.stringify(res)
    }
}

update_thread = async(req) => {
    console.log(req);
    const { id, title, author, category, tags, images, content, comments, favorited_by } = req.body;

    if ( !id || !title || !author || !category || !tags || !images || !content || !comments || !favorited_by ) {
        let res = {
            status: 400,
            body: "Missing parameters",
        }
        return JSON.stringify(res);
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