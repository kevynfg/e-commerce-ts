import Queue from "./queue";
import amqp from 'amqplib';

export default class RabbitMQ implements Queue {
  connection: any;
  
  async connect(): Promise<void> {
      this.connection = await amqp.connect('amqp://localhost:5672')
  }

  async consume(queueName: string, callback: Function): Promise<void> {
    const channel = await this.connection.createChannel(); 
    await channel.assertQueue(queueName, {durable: true})
    channel.consume(queueName, async (msg: any) => {
      const input = JSON.parse(msg.content.toString());
      await callback(input);
      channel.ack(msg);
    })   
  }
  async publish(queueName: string, data: any): Promise<void> {
      const channel = await this.connection.createChannel();
      await channel.assertQueue(queueName, {durable: true});
      await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  }
}