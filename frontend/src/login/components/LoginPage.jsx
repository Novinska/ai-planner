import { useDispatch } from "react-redux";
import { loginRequest } from "../Actions";
import classNames from "classnames";
import Logo from "../../images/logo.png";
import Calendar from "../../images/calendar-main.png";
import GoogleIcon from "../../icons/svg/google.svg";
import { benefitItems } from "../Constants";
import "../styles/loginpage.scss";

const LoginPage = () => {
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(loginRequest());
  };

  return (
    <div className="login-container main-page">
      <div className="logo-wrapper">
        <img src={Logo} alt="logo" className="logo-img" />
        <div className="full-logo">
          <h1 className="main-header login-title">PLANAI</h1>
          <p className="planner-slogan">Організуй свій день за допомогою ШІ</p>
        </div>
      </div>
      <div className="login-card">
        <div className="img-wrapper">
          <img src={Calendar} alt="calendar" className="calendar-img" />
        </div>
        <div className="card-block">
          <div className="login-btn-wrapper">
            <p className="login-title">Твій розумний план на день</p>
            <p className="login-desc">
              Додай події, отримуй підказки від ШІ та встигай більше без
              стресу{" "}
            </p>
            <button onClick={handleLogin} className="google-btn">
              <img src={GoogleIcon} alt="google-icon" className="google-icon" />
              <span className="btn-title">Продовжити з Google</span>
            </button>
          </div>
        </div>
      </div>
      <div className="benefits-wrapper">
        {benefitItems.map(({ id, title, icon, description }) => (
          <div id={id} className="benefit">
            <div className="icon-wrapper">
              <span className={classNames("benefit-icon", icon)} />
            </div>
            <p className="benefit-title">{title}</p>
            <p className="benefit-desc">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoginPage;
