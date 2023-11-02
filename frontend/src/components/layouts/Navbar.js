import { Link } from "react-router-dom";

import Logo from "../../assets/img/logo.png";

function Navbar() {
  return (
    <nav>
      <div>
        <img src={Logo} alt="get a pet" />
      </div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/Login">login</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
