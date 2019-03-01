var amqp = require("amqplib/callback_api");

var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: rpc_client.js num");
  process.exit(1);
}

amqp.connect("amqp://user:bitnami@localhost", (err, conn) => {
  conn.createChannel((err, ch) => {
    ch.assertQueue("", { exclusive: true }, (err, q) => {
      var corr = generateUuid();
      var num = parseInt(args[0]);

      console.log(" [x] Requesting fib(%d)", num);

      ch.consume(
        q.queue,
        msg => {
          if (msg.properties.correlationId == corr) {
            console.log(" [.] Got %s", msg.content.toString());
            setTimeout(() => {
              conn.close();
              process.exit(0);
            }, 500);
          }
        },
        { noAck: true }
      );

      ch.sendToQueue("rpc_queue", new Buffer.from(num.toString()), {
        correlationId: corr,
        replyTo: q.queue
      });
    });
  });
});

const generateUuid = () => {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
};
