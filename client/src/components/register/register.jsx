import React, {  useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Col, Row, notification } from 'antd';
import { BsChatLeftDots } from "react-icons/bs";
import axios from 'axios';

const Register = () => {

  const [file, setfile] = useState();

  const navigate = useNavigate();

  //Covert Base 64 Image
  const handleFileInputChange = async e => {
    const files = e.target.files[0]
    const result = await getBase64(files)
    setfile(result)
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });


  //Register
  const onFinish = (values) => {
    (async () =>
       {
      const rawResponse = await axios.post('http://localhost:5001/api/register', {
        firstname: values.first_name,
        lastname: values.last_name,
        email: values.email,
        password: values.password,
        file:file
      }, {
        headers: {
          'Accept': 'application/json',
        }
      });

      //Register success notification
      if ("User registered successfully") {
        notification.success({
          message: "Register Success",
          description:
            "Please login now",
        })
        navigate("/")
      }

      //Error message notification
      else {
        notification.error({
          message: "Error",
          description: "User already exist!",
        })
      }
    })
    (); 
  };


  return (
    <>
      <Row justify={"center"}>
        <Col span={10}>
          <Form className='register' layout="vertical" onFinish={(values) => onFinish(values)}>
            <h1> Connect Me    <BsChatLeftDots /></h1>

            <Form.Item
              label="First Name"
              name="first_name"
              rules={[
                {
                  required: true,
                  message: 'Please enter your first name!',
                },
                {
                  pattern: /^[A-Za-z\\s]+$/,
                  message: "first name should contain only aplhabets"
                }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="last_name"
              rules={[
                {
                  required: true,
                  message: 'Please enter your last name!',
                },
              ]}

            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please enter your first name!',
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
              ]}
              hasFeedback
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirm_password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
                {
                  pattern: /^[a-zA-Z0-9`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{6,}$/,
                  message: 'Password should contain atleast 6 digits'
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The new password that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
                 {
                //   pattern:/ ^.*\.(jpg|jpeg|png|gif|bmp|webp|tiff|svg)$/,
                //   message: 'Please upload imgage file format only'   
                 }
            <Form.Item
              // className='input_field'
              label={<label style={{ color: "black" }}>Profile photo</label>}
              name="file"
              rules={[{
                required: true,
                message: 'Please upload image!',
              }
              ]} >
              <input type="file" id="myfile" max={1} name="myfile" onChange={handleFileInputChange} />
            </Form.Item>

            <p className='sign-in-btn'>Already have an account?<a href='/'>Sign in</a></p>

            <Button className='submit-btn' type="primary" htmlType="submit"   >Submit</Button>

          </Form>
        </Col>
      </Row>
    </>
  );
};
export default Register;