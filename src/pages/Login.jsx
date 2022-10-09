import { signInWithEmailAndPassword } from 'firebase/auth'
import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import ReactLoading from 'react-loading'

export const Login = () => {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = e.target[0].value
    const password = e.target[1].value

    try {
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
      setErr(false)
      navigate('/')
    } catch (err) {
      setErr(true)
      setLoading(false)
    }
  }
  return (
    <div className='form-container'>
      <div className='form-wrapper'>
        <p className='logo'>Jack's Chat</p>
        <p className='title'>Login</p>
        {loading && <ReactLoading type={'cylon'} color={'#738de4'} />}
        <form onSubmit={handleSubmit}>
          <input type='email' placeholder='email' />
          <input type='password' placeholder='password' />
          <button type='submit'>Login</button>
          {err && (
            <span style={{ textAlign: 'center', color: 'red' }}>
              Username or password is invalid
            </span>
          )}
          <p>
            Don't have an account? <Link to={'/register'}>Register</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
