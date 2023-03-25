'use client'
import React, { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';

function MQTTClient(props) {
  const [connected, setConnected] = useState(false);
  const [topics, setTopics] = useState([]);
  const [currentTopic, setCurrentTopic] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const clientRef = useRef(null);

  useEffect(() => {
    // Conectar al servidor MQTT con WebSockets
    const client = mqtt.connect('ws://test.mosquitto.org:8080/mqtt');
    clientRef.current = client;

    // Configurar los controladores de eventos para la conexión y los mensajes entrantes
    client.on('connect', () => {
      setConnected(true);
      console.log('Conectado al servidor MQTT');
    });

    client.on('message', (topic, message) => {
      setMessages(messages => [...messages, { topic, message: message.toString() }]);
    });

    // Desconectar del servidor MQTT cuando se desmonta el componente
    return () => {
      client.end();
    };
  }, []);

  const handleAddTopic = () => {
    if (!topics.includes(currentTopic)) {
      setTopics(topics => [...topics, currentTopic]);
      clientRef.current.subscribe(currentTopic);
    }
    setCurrentTopic('');
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    clientRef.current.publish(currentTopic, message);
    setMessage('');
  };

  const handleTopicChange = (event) => {
    setCurrentTopic(event.target.value);
  };

  return (
    <div className='bg-white-200'>
      <h2 >MQTT Client</h2>
      <p>Status: {connected ? 'Connected' : 'Disconnected'}</p>
      <h3>Topics</h3>
      <ul>
        {topics.map(topic => (
          <li key={topic}>{topic}</li>
        ))}
      </ul>
      <input type="text" value={currentTopic} onChange={(event) => setCurrentTopic(event.target.value)} />
      <button onClick={handleAddTopic}>Add Topic</button>
      <h3>Messages</h3>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <strong>{message.topic}:</strong> {message.message}
          </li>
        ))}
      </ul>
      <select
            className="appearance-none border border-gray-400 px-2 py-1 rounded-lg mr-2"
            value={currentTopic}
            onChange={handleTopicChange}
          >
            <option value="">-- Select a topic --</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
      <input type="text" value={message} onChange={handleMessageChange} />
      <button onClick={handleSendMessage}>Send Message</button>
    </div>
  );
}

export default MQTTClient;