var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", (err, conn) => {
  conn.createChannel((err, ch) => {
    var ex = "logs";
    var msg = process.argv.slice(2).join(" ") || "Hello World!";

    ch.assertExchange(ex, "fanout", { durable: false });
    ch.publish(ex, "", new Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });

  setTimeout(() => {
    conn.close();
    process.exit(0);
  }, 500);
});
