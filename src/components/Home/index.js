import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const apiStatusConstraints = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
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
      const updateData = data.books.map(eachBook => ({
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

  renderSuccessView = () => {
    const {booksList} = this.state

    return (
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
        </div>
      </div>
    )
  }

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
      <>
        <Header />
        {this.renderLoadingView()}
      </>
    )
  }
}

export default Home
