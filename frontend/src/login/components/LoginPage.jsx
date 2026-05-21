import { useDispatch } from "react-redux";
import { loginRequest } from "../Actions";

const LoginPage = () => {
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(loginRequest());
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">📅</div>
        <h1>AI Planner</h1>
        <p>Організуй свій день за допомогою ШІ</p>

        <button onClick={handleLogin} className="google-btn">
          <img src="/google-icon.svg" alt="" />
          Продовжити з Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
