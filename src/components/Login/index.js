import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showError: false, errorMsg: ''}

  changeUsername = event => {
    this.setState({username: event.target.value})
  }

  changePassword = event => {
    this.setState({password: event.target.value})
  }

  submitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  submitFailure = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  onClickSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const url = 'https://apis.ccbp.in/login'
    const userDetails = {
      username,
      password,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.submitSuccess(data.jwt_token)
    } else {
      this.submitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showError, errorMsg} = this.state

    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <img
          src="https://res.cloudinary.com/dj6c4lrt9/image/upload/v1688716492/Rectangle_1467_vhdcca.png"
          alt="website login"
          className="login-image"
        />
        <div className="container-card">
          <form className="form-container" onSubmit={this.onClickSubmitForm}>
            <img
              src="https://res.cloudinary.com/dj6c4lrt9/image/upload/v1688915137/Group_7731_1_gtddoh.png"
              alt="login website logo"
              className="logo"
            />
            <div className="label-input-container">
              <label htmlFor="username" className="label-element">
                Username*
              </label>
              <input
                type="text"
                id="username"
                className="input-element"
                placeholder="Gilroy Brown"
                value={username}
                onChange={this.changeUsername}
              />
            </div>
            <div className="label-password-container">
              <label htmlFor="password" className="password">
                Password*
              </label>
              <input
                type="password"
                id="password"
                className="password-input"
                placeholder="********"
                value={password}
                onChange={this.changePassword}
              />
            </div>
            {showError && <p className="error">{errorMsg}</p>}
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
