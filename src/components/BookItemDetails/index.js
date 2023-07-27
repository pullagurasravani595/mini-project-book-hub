import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsFillStarFill} from 'react-icons/bs'
import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import Header from '../Header'
import './index.css'

const apiStatusValues = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
}

class BookItemDetails extends Component {
  state = {responseObj: {}, apiStatus: apiStatusValues.initial}

  componentDidMount() {
    this.getItemDetails()
  }

  getItemDetails = async () => {
    this.setState({apiStatus: apiStatusValues.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/book-hub/books/${id}`
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updateDataObj = {
        aboutAuthor: data.book_details.about_author,
        aboutBook: data.book_details.about_book,
        authorName: data.book_details.author_name,
        coverPic: data.book_details.cover_pic,
        id: data.book_details.id,
        rating: data.book_details.rating,
        readStatus: data.book_details.read_status,
        title: data.book_details.title,
      }
      this.setState({
        apiStatus: apiStatusValues.success,
        responseObj: updateDataObj,
      })
    } else {
      this.setState({apiStatus: apiStatusValues.failure})
    }
  }

  renderFooterView = () => (
    <div className="item-details-footer-container">
      <div className="item-details-footer-icon-container">
        <FaGoogle className="item-details-icon" />
        <FaTwitter className="item-details-icon" />
        <FaInstagram className="item-details-icon" />
        <FaYoutube className="item-details-icon" />
      </div>
      <p>Contact Us</p>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  clickTryBtn = () => {
    this.getItemDetails()
  }

  renderFailureView = () => (
    <div className="item-description-failure-container">
      <img
        src="https://res.cloudinary.com/dj6c4lrt9/image/upload/v1689496821/Group_7522_fl0spb.png"
        alt="failure view"
        className="item-details-failure-img"
      />
      <p className="item-details-failure-description">
        Something went wrong, Please try again.
      </p>
      <button
        type="button"
        className="item-details-failure-button"
        onClick={this.clickTryBtn}
      >
        Try Again
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {responseObj} = this.state
    const {
      coverPic,
      title,
      authorName,
      rating,
      readStatus,
      aboutAuthor,
      aboutBook,
    } = responseObj

    return (
      <>
        <div className="item-details-card">
          <div className="item-details-img-container">
            <img src={coverPic} alt={title} className="book-item-img" />
            <div className="item-details-view-container">
              <h1 className="item-details-title">{title}</h1>
              <p className="item-details-author-name">{authorName}</p>
              <div className="item-details-icon-center">
                <p className="item-details-avg-rating">Avg Rating</p>
                <div className="star-rating-container">
                  <p>
                    <BsFillStarFill className="item-details-star" />
                  </p>
                  <p className="item-details-rating-value">{rating}</p>
                </div>
              </div>
              <p className="item-details-status">
                Status:
                <span className="item-details-status-span">{readStatus}</span>
              </p>
            </div>
          </div>
          <hr className="item-details-line" />
          <div>
            <h1 className="item-details-about-heading">About Author</h1>
            <p className="item-details-about-author">{aboutAuthor}</p>
            <h1 className="item-details-about-heading">About Book</h1>
            <p className="item-details-about-book-description">{aboutBook}</p>
          </div>
        </div>
        {this.renderFooterView()}
      </>
    )
  }

  renderResponseView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusValues.success:
        return this.renderSuccessView()
      case apiStatusValues.failure:
        return this.renderFailureView()
      case apiStatusValues.inProgress:
        return this.renderLoadingView()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="item-details-container">
          <div>{this.renderResponseView()}</div>
        </div>
      </>
    )
  }
}

export default BookItemDetails
