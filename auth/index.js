#!/usr/bin/env node
const bcrypt = require("bcryptjs")
const User = require('./models/user-model')
const db = require('./db/db')
const config = require('./config')

const rabbitMQ = config.rabbitMQ

db.on('error', console.error.bind(console, "MongoDB Atlas connection error"))


const register = async (req) => {
  try {
    console.log(req);
    const { name, password, email, passwordVerify } = req;
    // TODO check password
    // TODO verify code?
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name,
      passwordHash: passwordHash,
      email: email,
      favorites: []
    });
    await newUser.save();
    let res = {
      status: 200,
      body: "ok"
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


const login = async (req) => {
  try {
    console.log(req);
    const { email, password } = req;

    const user = await User.findOne({ email: email })
    if (!user) {
      let res = {
        status: 500,
        body: "User does not exist!"
      }
      return JSON.stringify(res)
    }
    console.log(user)
    const match = await bcrypt.compare(password, user.passwordHash)
    if (match) {
      console.log("user login successful")  // TODO JWT
      let res = {
        status: 200,
        body: {
          name: user.name
        }
      }
      return JSON.stringify(res)
    }
    else {
      console.log("user login failed, wrong password")
      let res = {
        status: 401,
        body: "wrong password"
      }
      return JSON.stringify(res)
    }
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


const amqp = require('amqplib/callback_api');
amqp.connect(rabbitMQ, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'register';

    channel.assertQueue(queue, {
      durable: false
    });
    channel.prefetch(1);
    console.log(' [x] Awaiting RPC requests');
    channel.consume(queue, function reply(msg) {
      register(JSON.parse(msg.content.toString())).then((res) => {
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