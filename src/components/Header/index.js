import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const clickLogoutBtn = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-container">
      <Link to="/" className="nav-link">
        <img
          src="https://res.cloudinary.com/dj6c4lrt9/image/upload/v1688915137/Group_7731_1_gtddoh.png"
          alt="website logo"
          className="header-img"
        />
      </Link>
      <div className="links-container">
        <Link to="/" className="nav-link">
          <li className="list-home">Home</li>
        </Link>
        <Link to="/shelf" className="nav-link">
          <li className="list-item">Bookshelves</li>
        </Link>
        <button type="button" className="logout-btn" onClick={clickLogoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
