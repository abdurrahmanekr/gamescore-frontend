import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import JWT from 'jsonwebtoken';
import faker from 'faker';
import { Layout, Row, Col, Table, Tag } from 'antd';

import 'antd/dist/antd.css'

import './App.css';

const columns = [
  {
    title: 'Ülke',
    dataIndex: 'country',
    key: 'country',
  },
  {
    title: 'İsim',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Sıra',
    dataIndex: 'rank',
    key: 'rank',
  },
  {
    title: 'Para',
    dataIndex: 'money',
    key: 'money',
  },
  {
    title: 'Günlük Değişim',
    dataIndex: 'rankDiff',
    key: 'rankDiff',
    render: diff => (
      <span>
        <Tag color={diff === 0 ? 'yellow' : (diff < 0 ? 'red' : 'green')} key={diff}>
          {diff}
        </Tag>
      </span>
    )
  },
];

let user = {
  id: parseInt(Math.random() * 10000000) % 10000000,
  name: faker.name.findName(),
  country: faker.address.countryCode(),
};
let socket;

function App() {

  const [score, setScore] = useState([]);

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
        rankDiff: x.todayRank - x.rank,
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
    <Layout.Content>
      <Row
        justify='center'>
        <Col
          md={6}>
          <h3>Skor Tablosu</h3>
        </Col>
      </Row>
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
    </Layout.Content>
  );
}

export default App;
