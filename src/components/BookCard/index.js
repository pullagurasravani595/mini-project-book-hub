import {Link} from 'react-router-dom'
import {BsFillStarFill} from 'react-icons/bs'
import './index.css'

const BookCard = props => {
  const {bookDetailsResponse} = props
  const {
    coverPic,
    title,
    authorName,
    rating,
    readStatus,
    id,
  } = bookDetailsResponse

  return (
    <Link to={`/books/${id}`} className="nav-link-container">
      <li className="book-list-container">
        <img src={coverPic} alt={title} className="book-cover-img" />
        <div className="book-details-container">
          <h1 className="book-title">{title}</h1>
          <p className="book-author">{authorName}</p>
          <div className="rating-container">
            <p className="rating">Avg Rating</p>
            <BsFillStarFill className="star" />
            <p className="star-rating">{rating}</p>
          </div>
          <p className="status">
            Status: <span className="span-element">{readStatus}</span>
          </p>
        </div>
      </li>
    </Link>
  )
}

export default BookCard
