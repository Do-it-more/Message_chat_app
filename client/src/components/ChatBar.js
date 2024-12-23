
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ChatBody from './ChatBody';

import image from '../components/assets/bg.gif';

const ChatBar = ({ socket }) => {
  const Token = useSelector((Item) => Item.token.data.success);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleChat = (username, profileImage, userId) => {
    setSelectedUser({ username, 
      profileImage,
       userId 
      });
  };

  // Fetch all users
  useEffect(() => {
    axios
      .get('http://localhost:5001/api/getall', {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((response) => {
        setUsers(response.data.filter((user) => user.email !== Token.email));
      })
      .catch((error) => console.error('Error fetching users:', error));
  }, [Token]);


  useEffect(() => {
    console.log('Socket connection established:', socket);
    socket.on('messageResponse', (data) => {
        console.log('Received message via socket:', data);
      
    });
  });


  useEffect(() => {
    if (socket) {
      console.log('Socket connection established:', socket);
      socket.emit('register', Token._id); 
    }
  }, [socket, Token]);

  return (
    <>
      <div className="chat__sidebar">
        <h2>
          <img className="chatbar-profile" src={Token.file} alt="Profile" />{' '}
          {Token.firstname}
        </h2>
        <p>{Token.email}</p>
        <div>
          <h4 className="chat__header">ACTIVE USERS</h4>
          <div className="chat__users">
            {users.map((user) => (
              <div key={user._id}>
                <img className="chatbar-profile" src={user.file} alt="User" />
                <button
                  onClick={() =>
                    handleChat(
                      `${user.firstname} ${user.lastname}`,
                      user.file,
                      user._id
                    )
                  }
                >
                  {user.firstname} {user.lastname}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="chat__main">
        {selectedUser ? (
          <ChatBody
            socket={socket}
            chat={selectedUser.username}
            profile={selectedUser.profileImage}
            token={`${Token.firstname} ${Token.lastname}`}
            receiverID={selectedUser}
          />
        ) : (
          <img src={image} width="200%" height="100%" alt="Background" />
        )}
      </div>
    </>
  );
};

export default ChatBar;
