var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", (err, conn) => {
  conn.createChannel((err, ch) => {
    var q = "task_queue";

    ch.assertQueue(q, { durable: true });
    ch.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(
      q,
      msg => {
        var secs = msg.content.toString().split(".").length - 1;

        console.log(" [x] Received %s", msg.content.toString());
        setTimeout(() => {
          console.log(" [x] Done");
          ch.ack(msg);
        }, secs * 5000);
      },
      { noAck: false }
    );
  });
});
