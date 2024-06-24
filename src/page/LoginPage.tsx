import { useContext } from "react";
import { Form, Input, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";
import { API } from "../services/apiUrls";
import "../css/Login.css"; // Harici CSS dosyasını içeriye çağırın
import React from "react";

const LoginPage = () => {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const response = await axios.post(`${API.BASE_URL}${API.USERS.LOGIN}`, {
        email: values.email,
        password: values.password,
      });
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      console.log("token", response.data.token);
      navigate("/tarifler");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <Typography.Title level={1}>Admin Giriş</Typography.Title>
      <Form
        className="login-form"
        layout={"vertical"}
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Email"
          name="email"
          initialValue="ardadiscord123@gmail.com"
          rules={[
            { required: true, message: "Lütfen email adresinizi girin!" },
          ]}
        >
          <Input placeholder="Kullanıcı Adı" />
        </Form.Item>
        <Form.Item
          label="Şifre"
          name="password"
          initialValue="ardaerenekmek1"
          rules={[{ required: true, message: "Lütfen şifrenizi girin!" }]}
        >
          <Input type="password" placeholder="Şifre" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Giriş Yap
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
