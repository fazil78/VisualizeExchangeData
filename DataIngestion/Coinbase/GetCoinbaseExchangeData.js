const kafka = require('kafka-node');

// Kafka broker address
const kafkaBroker = 'localhost:9092';

// Create a Kafka consumer
const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: kafkaBroker });
const producer = new Producer(client);

// Handle Kafka producer errors
producer.on('error', (err) => {
    console.error('Error producing message:', err);
});

// Handle Kafka producer ready event
producer.on('ready', () => {
    console.log('Kafka producer is ready');
});

function dataCallback(eventData) {
    //console.log("Received Data: ", eventData)
    // Transform the message
    const kafkaMessage = {
        symbol: eventData.product_id,
        sequence: eventData.sequence,
        price: eventData.price,
        timestamp: eventData.time,
        open_24h: eventData.open_24h,
        volume_24h: eventData.volume_24h,
        low_24h: eventData.low_24h,
        high_24h: eventData.high_24h,
        volume_30d: eventData.volume_30d,
        best_bid: eventData.best_bid,
        best_bid_size: eventData.best_bid_size,
        best_ask: eventData.best_ask,
        best_ask_size: eventData.best_ask_size,
        side: eventData.side,
        trade_id: eventData.trade_id,
        last_size: eventData.last_size
    };

    // Send the message to Kafka
    producer.send([{ topic: 'bitcoin_trades', messages: JSON.stringify(kafkaMessage) }], (err, data) => {
        if (err) {
            console.error('Error producing message:', err);
        } else {
            console.log('Message sent to Kafka:', kafkaMessage);
        }
    });
}

module.exports = dataCallback;