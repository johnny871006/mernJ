import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 重新導向頁面
import AuthService from "../services/auth.service";

const LoginComponent = ({ currentUser, setCurrentUser }) => {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState();
  const navigate = useNavigate(); // 重新導向頁面

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      let response = await AuthService.login(email, password);
      // console.log(response);
      localStorage.setItem("user", JSON.stringify(response.data));
      window.alert("登入成功，您現在將被導向至個人資料頁面!");
      setCurrentUser(AuthService.getCurrentUser());
      navigate("/profile"); // 重新導向頁面
    } catch (e) {
      // console.log(e);
      setMessage(e.response.data);
    }
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        {/* 下面message && 寫法為可以當有錯誤訊息才顯示紅色錯誤 */}
        {message && <div className="alert alert-danger">{message}</div>}
        <div className="form-group">
          <label htmlFor="username">電子信箱：</label>
          <input
            onChange={handleEmail}
            type="text"
            className="form-control"
            name="email"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">密碼：</label>
          <input
            onChange={handlePassword}
            type="password"
            className="form-control"
            name="password"
          />
        </div>
        <br />
        <div className="form-group">
          <button onClick={handleLogin} className="btn btn-primary btn-block">
            <span>登入系統</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
