var amqp = require("amqplib/callback_api");

const fibonacci = n => {
  if (n == 0 || n == 1) return n;
  else return fibonacci(n - 1) + fibonacci(n - 2);
};

amqp.connect("amqp://user:bitnami@localhost", (err, conn) => {
  conn.createChannel((err, ch) => {
    var q = "rpc_queue";

    ch.assertQueue(q, { durable: false });
    ch.prefetch(1);
    console.log(" [x] Awaiting RPC requests");
    ch.consume(q, msg => {
      var n = parseInt(msg.content.toString());

      console.log(" [.] fib(%d)", n);

      var r = fibonacci(n);

      ch.sendToQueue(msg.properties.replyTo, new Buffer.from(r.toString()), {
        correlationId: msg.properties.correlationId
      });

      ch.ack(msg);
    });
  });
});
