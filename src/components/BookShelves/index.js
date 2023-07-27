import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import BookCard from '../BookCard'
import Header from '../Header'
import './index.css'

const apiStatusConditions = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
}

class BookShelves extends Component {
  constructor(props) {
    super(props)
    const {bookFilterList} = this.props
    this.state = {
      userInput: '',
      heading: bookFilterList[0].label,
      activeId: bookFilterList[0].value,
      apiStatus: apiStatusConditions.initial,
      responseList: [],
    }
  }

  componentDidMount() {
    this.getBookDetailsResponse()
  }

  getBookDetailsResponse = async () => {
    this.setState({apiStatus: apiStatusConditions.inProgress})
    const {activeId, userInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/book-hub/books?shelf=${activeId}&search=${userInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updateData = data.books.map(eachBook => ({
        id: eachBook.id,
        title: eachBook.title,
        readStatus: eachBook.read_status,
        rating: eachBook.rating,
        authorName: eachBook.author_name,
        coverPic: eachBook.cover_pic,
      }))
      this.setState({
        apiStatus: apiStatusConditions.success,
        responseList: updateData,
      })
    } else {
      this.setState({apiStatus: apiStatusConditions.failure})
    }
  }

  shelfTryBtn = () => {
    this.getBookDetailsResponse()
  }

  renderBooksLoadingView = () => (
    <div testid="loader" className="shelf-loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderBooksFailureView = () => (
    <div className="shelf-failure-container">
      <img
        src="https://res.cloudinary.com/dj6c4lrt9/image/upload/v1689496821/Group_7522_fl0spb.png"
        alt="failure view"
        className="shelf-failure-img"
      />
      <p className="shelf-failure-description">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        onClick={this.shelfTryBtn}
        className="shelf-try-btn"
      >
        Try Again
      </button>
    </div>
  )

  renderBooksSuccessView = () => {
    const {responseList, userInput} = this.state
    if (responseList.length === 0) {
      return (
        <div className="no-book-container">
          <img
            src="https://res.cloudinary.com/dj6c4lrt9/image/upload/v1689611430/Asset_1_1_imkqzc.png"
            alt="no books"
            className="no-book-img"
          />
          <p className="no-book-description">
            Your search for {userInput} did not find any matches.
          </p>
        </div>
      )
    }
    return (
      <ul className="shelf-un-order-list">
        {responseList.map(eachBook => (
          <BookCard bookDetailsResponse={eachBook} key={eachBook.id} />
        ))}
      </ul>
    )
  }

  renderBookDisplayView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConditions.success:
        return this.renderBooksSuccessView()
      case apiStatusConditions.failure:
        return this.renderBooksFailureView()
      case apiStatusConditions.inProgress:
        return this.renderBooksLoadingView()

      default:
        return null
    }
  }

  clickSearchIcon = () => {
    this.getBookDetailsResponse()
  }

  renderSideSlider = () => {
    const {bookFilterList} = this.props
    const {activeId} = this.state
    return (
      <div className="side-slider-container">
        <h1 className="side-slider-heading">Bookshelves</h1>
        <ul className="container-un-order-list">
          {bookFilterList.map(eachItem => {
            const {label} = eachItem
            const isActive = eachItem.value === activeId
            const listItemContainerClassName = isActive
              ? 'high-light-Item'
              : 'normal-item'
            const changeListItem = () => {
              this.setState(
                {heading: eachItem.label, activeId: eachItem.value},
                this.getBookDetailsResponse,
              )
            }
            return (
              <li onClick={changeListItem} key={eachItem.id}>
                <button
                  type="button"
                  className={`shelf-filter-btn ${listItemContainerClassName}`}
                >
                  {label}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  renderHeadingSearchView = () => {
    const changeUserInput = event => {
      this.setState({userInput: event.target.value})
    }

    const {heading, userInput} = this.state
    return (
      <div className="heading-input-container">
        <h1 className="input-container-heading">{heading} Books</h1>
        <div className="input-icon-container">
          <input
            type="search"
            className="input-element"
            value={userInput}
            onChange={changeUserInput}
          />
          <button type="button" className="search-icon" testid="searchButton">
            <BsSearch onClick={this.clickSearchIcon} />
          </button>
        </div>
      </div>
    )
  }

  renderFooterSection = () => (
    <div className="shelf-footer-container">
      <div className="shelf-icon-container">
        <FaGoogle className="shelf-icon" />
        <FaTwitter className="shelf-icon" />
        <FaInstagram className="shelf-icon" />
        <FaYoutube className="shelf-icon" />
      </div>
      <p className="shelf-contact">Contact Us</p>
    </div>
  )

  render() {
    return (
      <div>
        <Header />
        <div className="banner-container">
          <div>{this.renderSideSlider()}</div>
          <div className="main-container">
            {this.renderHeadingSearchView()}
            {this.renderBookDisplayView()}
            {this.renderFooterSection()}
          </div>
        </div>
      </div>
    )
  }
}

export default BookShelves
