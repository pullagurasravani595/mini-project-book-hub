import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import Header from '../Header'
import './index.css'

const apiStatusConstraints = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

class Home extends Component {
  state = {booksList: [], apiStatus: apiStatusConstraints.initial}

  componentDidMount() {
    this.getBookDetails()
  }

  getBookDetails = async () => {
    this.setState({apiStatus: apiStatusConstraints.inProgress})
    const apiUrl = 'https://apis.ccbp.in/book-hub/top-rated-books'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const {books} = data
      const updateData = books.map(eachBook => ({
        authorName: eachBook.author_name,
        coverPic: eachBook.cover_pic,
        id: eachBook.id,
        title: eachBook.title,
      }))
      this.setState({
        apiStatus: apiStatusConstraints.success,
        booksList: updateData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstraints.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader
        type="TailSpin"
        color="#0284C7"
        height={40}
        width={40}
        className="loader-element"
      />
    </div>
  )

  clickHomeTryBtn = () => {
    this.getBookDetails()
  }

  renderFailureView = () => (
    <div className="home-banner-container">
      <h1 className="home-heading">Find Your Next Favorite Books?</h1>
      <p className="home-description">
        You are in the right place. Tell us what titles or genres you have
        enjoyed in the past, and we will give you surprisingly insightful
        recommendations.
      </p>
      <div className="books-container">
        <div className="card-container">
          <h1 className="card-heading">Top Rated Books</h1>
          <Link to="/shelf">
            <button type="button" className="shelf-btn">
              Find Books
            </button>
          </Link>
        </div>
        <div className="failure-container">
          <img
            src="https://res.cloudinary.com/dj6c4lrt9/image/upload/v1689496821/Group_7522_fl0spb.png"
            alt="failure view"
            className="home-failure-img"
          />
          <p>Something went wrong, Please try again.</p>
          <button
            type="button"
            className="button-btn"
            onClick={this.clickHomeTryBtn}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )

  renderSlider = () => {
    const {booksList} = this.state

    return (
      <Slider {...settings}>
        {booksList.map(eachBook => {
          const {id, coverPic, title, authorName} = eachBook
          return (
            <li className="slick-item" key={id} onClick={this.clickBookItem}>
              <Link to={`/books/${id}`} className="home-nav-link">
                <img src={coverPic} alt={title} className="slide-img" />
                <div className="container-card-view">
                  <h1 className="slide-heading">{title}</h1>
                  <p className="author-name">{authorName}</p>
                </div>
              </Link>
            </li>
          )
        })}
      </Slider>
    )
  }

  renderSuccessView = () => (
    <div className="home-banner-container">
      <h1 className="home-heading">Find Your Next Favorite Books?</h1>
      <p className="home-description">
        You are in the right place. Tell us what titles or genres you have
        enjoyed in the past, and we will give you surprisingly insightful
        recommendations.
      </p>
      <div className="books-container">
        <div className="card-container">
          <h1 className="card-heading">Top Rated Books</h1>
          <Link to="/shelf">
            <button type="button" className="shelf-btn">
              Find Books
            </button>
          </Link>
        </div>
        <div className="slick-container">{this.renderSlider()}</div>
      </div>
      <div className="footer-container">
        <div>
          <button type="button" className="icon-btn">
            <FaGoogle />
          </button>
          <button type="button" className="icon-btn">
            <FaTwitter />
          </button>
          <button type="button" className="icon-btn">
            <FaInstagram />
          </button>
          <button type="button" className="icon-btn">
            <FaYoutube />
          </button>
        </div>
        <p className="home-contact">Contact Us</p>
      </div>
    </div>
  )

  renderBookDisplayDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstraints.success:
        return this.renderSuccessView()
      case apiStatusConstraints.failure:
        return this.renderFailureView()
      case apiStatusConstraints.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-container">
        <Header />
        {this.renderBookDisplayDetails()}
      </div>
    )
  }
}

export default Home
