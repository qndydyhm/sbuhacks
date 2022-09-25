const uuid = require('uuid');
const config = require('../config')

const rabbitMQ = config.rabbitMQ
const amqp = require('amqplib/callback_api');

const getUserById = async (id) => {
    amqp.connect(rabbitMQ, function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            channel.assertQueue('', {
                exclusive: true
            }, function (error2, q) {
                if (error2) {
                    throw error2;
                }
                var correlationId = uuid.v4()

                console.log(' [x] Requesting:', id);

                channel.consume(q.queue, function (msg) {
                    if (msg.properties.correlationId == correlationId) {
                        setTimeout(function () {
                            connection.close();
                        }, 500);
                        return JSON.parse(msg.content)
                    }
                }, {
                    noAck: true
                });

                channel.sendToQueue('getUserById',
                    Buffer.from(num.toString()), {
                    correlationId: correlationId,
                    replyTo: q.queue
                });
            });
        });
    });
}

const getUserByToken = async (token) => {
    amqp.connect(rabbitMQ, function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            channel.assertQueue('', {
                exclusive: true
            }, function (error2, q) {
                if (error2) {
                    throw error2;
                }
                var correlationId = uuid.v4()

                console.log(' [x] Requesting:', token);

                channel.consume(q.queue, function (msg) {
                    if (msg.properties.correlationId == correlationId) {
                        setTimeout(function () {
                            connection.close();
                        }, 500);
                        return JSON.parse(msg.content)
                    }
                }, {
                    noAck: true
                });

                channel.sendToQueue('getUserById',
                    Buffer.from(num.toString()), {
                    correlationId: correlationId,
                    replyTo: q.queue
                });
            });
        });
    });
}