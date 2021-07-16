import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import JWT from 'jsonwebtoken';
import faker from 'faker';
import { Row, Col, Table } from 'antd';

import 'antd/dist/antd.css'

import './App.css';

let user = {
  id: parseInt(Math.random() * 10000000) % 10000000,
  name: faker.name.findName(),
  country: faker.address.countryCode(),
};
let socket;

function App() {

  const [score, setScore] = useState([]);
  const [columns, setColumns] = useState([
    {
      title: 'Sıra',
      dataIndex: 'rank',
      key: 'rank',
    },
    {
      title: 'İsim',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Para',
      dataIndex: 'money',
      key: 'money',
    },
    {
      title: 'Ülke',
      dataIndex: 'country',
      key: 'country',
    },
  ]);

  useEffect(() => {
    const token = JWT.sign(user, 'fakesecret');

    console.log('Şu anda bulunan user:', user);

    socket = io('ws://localhost:8080/', {
      extraHeaders: {
        'Authorization': `Bearer ${token}`,
      },
    });

    socket.on('score', (score) => {
      setScore(score.map(x => ({
        ...x,
        rank: x.rank + 1,
      })));
    });

    // demo edebilmek için
    window.socket = socket;
    window.user = user;

  }, []);

  const endGame = (e) => {
    socket.emit('end-game', 10);
  };

  return (
    <Row
      justify='center'>
      <Col
        md={6}>
        <Table
          rowKey={x => x.id}
          rowSelection={{
            selectedRowKeys: [user.id],
          }}
          dataSource={score}
          columns={columns}
          pagination={{ defaultPageSize: 106, position: ['none', 'none']}}
        />

        <button className='game-end' onClick={endGame}>
          Oyundan Para Kazan
        </button>
      </Col>
    </Row>
  );
}

export default App;
