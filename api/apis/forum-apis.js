
const uuid = require('uuid');
const config = require('../config')

const rabbitMQ = config.rabbitMQ
const amqp = require('amqplib/callback_api');

postThread = async (req, res) => {
    req = req.body;
    return await assert("postThread", req, res);
}

getCookThreadList = async (req, res) => {
    req = req.body;
    return await assert("getCookThreadList", req, res);
}

getEatThreadList = async (req, res) => {
    req = req.body;
    return await assert("getEatThreadList", req, res);
}

getThread = async (req, res) => {
    req = req.body;
    return await assert("getCookThread", req, res);
}

searchCookThread = async (req, res) => {
    req = req.body;
    return await assert("searchCookThread", req, res);
}

searchEatThread = async (req, res) => {
    req = req.body;
    return await assert("searchEatThread", req, res);
}


// updateThread = async (req, res) => {
//     req = req.body;
//     return await assert("updateThread", req, res);
// }

// logoutUser = async (req, res) => {
//     return await res.cookie("token", '', {
//         httpOnly: true,
//         secure: true,
//         sameSite: "lax"
//     }).status(200).json({
//         success: true
//     })
// }



// /deletethread
// /favorite
// /unfavorite
// /getrandomthreadlist:num

const assert = async (queueName, req, res) => {
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
                let correlationId = uuid.v4();

                console.log(' [x] Requesting: ', req);

                channel.consume(q.queue, function (msg) {
                    console.log(msg)
                    if (msg.properties.correlationId == correlationId) {
                        console.log(' [.] Got %s', msg.content.toString());
                        msg = JSON.parse(msg.content)
                        console.log(msg.cookie)
                        if (msg.cookie) {
                            res.cookie("token", msg.cookie, {
                                httpOnly: true,
                                secure: true,
                                sameSite: "lax"
                            }).status(msg.status).send(msg.body)
                        }
                        else {
                            res.status(msg.status).send(msg.body)
                        }
                        setTimeout(function () {
                            connection.close();
                        }, 500);
                    }
                    else {
                        res.status(500).send("Internal server error")
                    }
                }, {
                    noAck: true
                });

                channel.sendToQueue(queueName,
                    Buffer.from(JSON.stringify(req)), {
                    correlationId: correlationId,
                    replyTo: q.queue
                });
            });
        });
    });
}

module.exports = {
    postThread,
    getCookThreadList,
    getEatThreadList,
    getCookThread,
    searchCookThread,
    searchEatThread,
}