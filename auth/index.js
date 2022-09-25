#!/usr/bin/env node
const bcrypt = require("bcryptjs")
const User = require('./models/user-model')
const db = require('./db/db')
const config = require('./config')
const auth = require('./auth/auth')

const rabbitMQ = config.rabbitMQ

db.on('error', console.error.bind(console, "MongoDB Atlas connection error"))


const register = async (req) => {
  try {
    console.log("request: ", req);
    const { name, password, email, passwordVerify } = req;
    // TODO verify code?
    if (password.length < 6 || password.length > 16) {
      let res = {
        status: 400,
        body: {
          msg: "Password length must between 6 to 16."
        }
      }
      return JSON.stringify(res);
    }
    if (password !== passwordVerify) {
      let res = {
        status: 400,
        body: {
          msg: "Passwords don't match."
        }
      }
      return JSON.stringify(res);
    }
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      let res = {
        status: 400,
        body: {
          msg: "An account with this email address already exists."
        }
      }
      return JSON.stringify(res)
    }
    const existingName = await User.findOne({ name: name });
    if (existingName) {
      let res = {
        status: 400,
        body: {
          msg: "An account with the same name already exists."
        }
      }
      return JSON.stringify(res)
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name,
      passwordHash: passwordHash,
      email: email,
      favorites: []
    });
    const savedUser = await newUser.save();

    // LOGIN THE USER
    const token = auth.signToken(savedUser);

    let res = {
      status: 200,
      body: {
        name: savedUser.name,
        email: savedUser.email,
        msg: "ok"
      },
      cookie: token
    }
    return JSON.stringify(res);
  }
  catch (err) {
    console.error(err);
    let res = {
      status: 500,
      body: {
        msg: "server error"
      }
    }
    return JSON.stringify(res)
  }
}


const login = async (req) => {
  try {
    console.log("request: ", req);
    const { email, password } = req;

    const user = await User.findOne({ email: email })
    console.log(user)
    console.log(!user)
    if (!user) {
      let res = {
        status: 500,
        body: {
          msg: "User does not exist!"
        }
      }
      return JSON.stringify(res)
    }
    console.log(user)
    const match = await bcrypt.compare(password, user.passwordHash)
    if (match) {
      console.log("user login successful")
      const token = auth.signToken(user);
      let res = {
        status: 200,
        body: {
          name: user.name,
          email: user.email,
          msg: "ok"
        },
        cookie: token
      }
      return JSON.stringify(res)
    }
    else {
      console.log("user login failed, wrong password")
      let res = {
        status: 401,
        body: {
          msg: "wrong password"
        }
      }
      return JSON.stringify(res)
    }
  }
  catch (err) {
    console.error(err);
    let res = {
      status: 500,
      body: {
        msg: "server error"
      }
    }
    return JSON.stringify(res)
  }
}

const getUserById = async (req) => {
  const user = await User.findById({_id: req});
  if (!user) {
    let res = {
      found: false,
      user: {}
    }
    return JSON.stringify(res)
  }
  else {
    let res = {
      found: true,
      user: {
        name: user.name,
        email: user.email,
        id: user._id
      }
    }
    return JSON.stringify(res) 
  }
}

const getUserByToken = async (req) => {
  let id = getUserId(req)
  if (id !== 'Guest') {
    return getUserById(id)
  }
  else {
    let res = {
      found: false,
      user: {}
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

  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'getUserById';

    channel.assertQueue(queue, {
      durable: false
    });
    channel.prefetch(1);
    console.log(' [x] Awaiting RPC requests');
    channel.consume(queue, function reply(msg) {
      getUserById(msg.content.toString()).then((res) => {
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
    var queue = 'getUserByToken';

    channel.assertQueue(queue, {
      durable: false
    });
    channel.prefetch(1);
    console.log(' [x] Awaiting RPC requests');
    channel.consume(queue, function reply(msg) {
      getUserByToken(msg.content.toString()).then((res) => {
        channel.sendToQueue(msg.properties.replyTo,
          Buffer.from(res.toString()), {
          correlationId: msg.properties.correlationId
        });

        channel.ack(msg);
      })
    });
  });
});