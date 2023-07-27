import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://res.cloudinary.com/dj6c4lrt9/image/upload/v1689676711/Group_7484_lq3u2c.png"
      alt="not found"
      className="not-found-img"
    />
    <h1 className="not-found-heading">Page Not Found</h1>
    <p className="not-found-description">
      we are sorry, the page you requested could not be found, Please go back to
      the homepage.
    </p>
    <Link to="/">
      <button type="button" className="not-found-btn">
        Go Back to Home
      </button>
    </Link>
  </div>
)

export default NotFound
