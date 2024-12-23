import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '../redux/actionCreate';
import { notification, Menu, Button } from 'antd';
import { IoMdAttach } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";

const ChatBody = ({ chat, token, profile, receiverID, socket }) => {
    const tokenID = useSelector((Item) => Item.token.data.success._id);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [allMessages, setAllMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [current, setCurrent] = useState('');
    const messagesEndRef = useRef(null);
    // const [typing, setTyping] = useState(false);
      const [senderTyping, setSenderTyping] = useState(false);
    const [receiverTyping, setReceiverTyping] = useState(false);


    // Fetch messages
    const fetchMessages = async () => {
        const selectedUserId = receiverID.userId;
        const selectedUserName = receiverID.username;

        try {
            const response = await fetch(`http://localhost:5001/api/message?sender=${token}&senderID=${tokenID}&receiver=${selectedUserName}&receiverID=${selectedUserId}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                setAllMessages(data);
            } else {
                setAllMessages([]);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    // Emit typing event
    const handleTyping = (e) => {
        setMessage(e.target.value);
        // if (!typing) {
        //      setTyping(true);
          
        //     socket.emit('typing', { from: tokenID, to: receiverID.userId });
        // }

        if (!senderTyping) {
            setSenderTyping(true);
            socket.emit('typing', { from: tokenID, to: receiverID.userId });
        }
    };

    const sendMessage = async () => {
        const receiver = receiverID.userId;
        
        if (!message.trim() && !file) return;

        try {
            const formData = new FormData();
            formData.append('sender', token);
            formData.append('senderID', tokenID);
            formData.append('receiver', chat);
            formData.append('receiverID', receiver);
            formData.append('message', message);
            
            // file present
            if (file) {
                formData.append('media', file);
            }

            const response = await fetch('http://localhost:5001/api/message', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setMessage('');
                setFile(null);
                fetchMessages();  

                socket.emit('privateMessage', {
                    from: tokenID,
                    to: receiver,
                    message: message,
                    media: file ? file.name : null,
                });

                // Emit stop typing event after sending the message
                socket.emit('stopTyping', { from: tokenID, to: receiverID.userId });
                // setTyping(false);  
            } else {
                const error = await response.json();
                console.error('Error sending message:', error);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const onClick = (e) => {
        setCurrent(e.key);
    };

    const items = [
        {
            label: '',
            key: 'SubMenu',
            icon: <IoMdAttach />,
            children: [
                {
                    label: 'Image',
                    key: 'image',
                },
                {
                    label: 'Video',
                    key: 'video',
                },
            ],
        },
    ];

    useEffect(() => {
        fetchMessages();
        return () => { };
    }, [receiverID]);

    useEffect(() => {
        socket.emit('register', tokenID);  

        // Listen for typing event
        socket.on('typing', (data) => {
            if (data.to === tokenID) {
                // Show typing indicator

                // setTyping(true);
                setReceiverTyping(true);
            }
        });

        // Listen for stop typing event
        socket.on('stopTyping', (data) => {
            // if (data.to === tokenID) {
            //     setTyping(false);
            // }
            if (data.to === tokenID) {
                setReceiverTyping(false);
            }
            if (data.from === tokenID) {
                setSenderTyping(false);
            }
        });

        socket.on('messageResponse', (data) => {
            if (data.to === tokenID) {
                setAllMessages((prevMessages) => [...prevMessages, data]);
            }
        });

        return () => {
            socket.off('messageResponse');
            socket.off('typing');
            socket.off('stopTyping');
        };
    }, [socket, tokenID]);

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile.size > 5 * 1024 * 1024) {
            alert('File size maximum limit 5MB');
            return;
        }
        setFile(selectedFile);
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [allMessages]);

    return (
        <>
            <header className="chat__mainHeader">
                <img className="chatbar-profile" src={profile} alt="Profile" />
                <h3 className="current-user">{chat}</h3>
                <Button className='logut-btn'
                    onClick={() => {
                        dispatch(userLogout());
                        notification.success({
                            message: 'Logout',
                            description: 'Logout Successfully!',
                        });
                        navigate('/');
                    }}
                >Logout</Button>
            </header>

            <div className="message__container">
                <ul>
                    {allMessages.map((msg, index) => (
                        msg.sender === token ? (
                            <div className="message__chats" key={index}>
                                <div className="message__sender">
                                    <p>{msg.message}</p>
                                    {msg.media && msg.media.mediaType === 'image' && (
                                        <div className="message__image">
                                            <img
                                                src={`http://localhost:5001/${msg.media.url}`}
                                                alt="chat-image"
                                                style={{ width: '200px', height: 'auto' }}
                                            />
                                        </div>
                                    )}
                                    {msg.media && msg.media.mediaType === 'video' && (
                                        <div className="message__video">
                                            <video controls style={{ width: '200px' }}>
                                                <source
                                                    src={`http://localhost:5001/${msg.media.url}`}
                                                    type="video/mp4"
                                                />
                                            </video>
                                        </div>
                                    )}
                                </div>
                                <p className="sender__name" >{msg.timestamp}</p>
                            </div>
                        ) : (
                            <div className="message__chats" key={index}>
                                <p className='receiver-name'>{msg.user}</p>
                                <div className="message__recipient">
                                    <p>{msg.message}</p>
                                    {msg.media && msg.media.mediaType === 'image' && (
                                        <div className="message__image">
                                            <img
                                                src={`http://localhost:5001/${msg.media.url}`}
                                                alt="chat-image"
                                                style={{ width: '200px', height: 'auto' }}
                                            />
                                        </div>
                                    )}
                                    {msg.media && msg.media.mediaType === 'video' && (
                                        <div className="message__video">
                                            <video controls style={{ width: '200px' }}>
                                                <source
                                                    src={`http://localhost:5001/${msg.media.url}`}
                                                    type="video/mp4"
                                                />
                                            </video>
                                        </div>
                                    )}
                                </div>
                                <p className="message__chats_recipient" >{msg.timestamp}</p>
                            </div>
                        )
                    ))}
                    <div ref={messagesEndRef} /> 
                </ul>
                {/* {typing && <p className="typing-indicator">Receiver is typing...</p>} */}
                {(senderTyping || receiverTyping) && (
                    <p className="typing-indicator">
                        {receiverTyping ? 'Receiver is typing...' : 'You are typing...'}
                    </p>
                )}
            </div>

            <div className="chat__footer">
                <div className="formdata">
                    <input
                        className="message"
                        type="text"
                        placeholder="Type your message..."
                        value={message}
                        onChange={handleTyping}
                    />
                    <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
                    {current === 'image' && <input type="file" accept="image/*" onChange={handleFileChange} />}
                    {current === 'video' && <input type="file" accept="video/*" onChange={handleFileChange} />}
                    <button className="sendBtn" onClick={sendMessage}>
                        <IoSendSharp />
                    </button>
                </div>
            </div>
        </>
    );
}

export default ChatBody;
