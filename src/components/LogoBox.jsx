import logoSm from '@/assets/images/logo-sm.png';
import { Link } from 'react-router-dom';
const LogoBox = () => {
  return <div className="logo-box">
      <Link to="/" className="logo-dark">
        <img src={logoSm} width={28} height={26} className="logo-sm" alt="logo sm" />
        <img src={`/logo-blcak.png?v=${Date.now()}`} height={24} width={112} className="logo-lg" alt="logo black" />
      </Link>
      <Link to="/" className="logo-light">
        <img src={logoSm} width={28} height={26} className="logo-sm" alt="logo sm" />
        <img src={`/logo-white.png?v=${Date.now()}`} height={24} width={112} className="logo-lg" alt="logo white" />
      </Link>
    </div>;
};
export default LogoBox;