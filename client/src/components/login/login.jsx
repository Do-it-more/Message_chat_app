import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { userLogin } from '../../redux/actionCreate'
import '../register/register';
import { Button, Form, Input, notification, Col, Row } from 'antd';
import { BsChatLeftDots } from "react-icons/bs";
import axios from 'axios';

const Login = () => {
    const dashboardNavigate = useNavigate();
    const dispatch = useDispatch();

    //Login User
    const onFinish = (values) => {
        (async () => {
            const rawResponse = await axios.post('http://localhost:5001/api/login', {
                    email: values.email,
                    password: values.password,
            },{
                headers: {
                    'Accept': 'application/json',
                },   
            });
       
            if (rawResponse.data.success) {
                const value = rawResponse.data;
               // socket.emit('newUser', { socketID: socket.id });

             //Login success notification ...!
                notification.success(
                    {
                        message: "Login Success",
                        description:  "Welcome  !",
                    }
                )
                dispatch(userLogin(value))
                dashboardNavigate("/chat")
            }

            //Error message notification     ...!
            else {
                notification.error({
                    message: "Error",
                    description: "Something wrong !",
                })
            }
        })();
    };

    return (
        <>
            <Row justify="center" >
                <Col span={7} >
                    <Form className='login' layout='vertical' onFinish={(values) => onFinish(values)}>
                        <h1>Login Connect Me    <BsChatLeftDots /></h1>
                        
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                                {
                                    pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                                    message: 'Please enter valid email!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                                {
                                    pattern: /^[a-zA-Z0-9`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{5,}$/,
                                    message: 'Password should contain atleast 5 digits'
                                },

                            ]} hasFeedback
                        >
                            <Input.Password />
                        </Form.Item>

                        <Button className='submit-btn' type="primary" htmlType="submit"   >Submit</Button>

                        <p className='sign-up'>Don't have an account?<a href='/register'> sign up</a></p>
                    </Form>
                </Col>
            </Row>
        </>
    )
}

export default Login;