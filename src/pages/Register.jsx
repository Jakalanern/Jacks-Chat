import React from 'react'
import Add from '../imgs/addAvatar.png'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db, storage } from '../firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { doc, setDoc } from 'firebase/firestore'
import { useState } from 'react'
import { useRef } from 'react'
import ReactLoading from 'react-loading'
import { Link, useNavigate } from 'react-router-dom'
import { Checkmark } from 'react-checkmark'
import { useEffect } from 'react'

export const Register = () => {
  const form = useRef(null)
  const [loading, setLoading] = useState(false)
  const [avatarUploaded, setAvatarUploaded] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [avatarErr, setAvatarErr] = useState(false)
  const [err, setErr] = useState(false)
  const navigate = useNavigate()

  const imgFileHandler = (e) => {
    setAvatar(e.target.value)
    if (e.target.files.length !== 0) {
      setAvatarUploaded(true)
    }
  }

  useEffect(() => {
    if (avatarUploaded) {
      setAvatarErr(false)
    }
  }, [avatarUploaded])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const displayName = e.target[0].value
    const displayNameInsensitive = e.target[0].value.toLowerCase()
    const email = e.target[1].value
    const password = e.target[2].value
    const file = e.target[3].files[0]

    if (avatarUploaded) {
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password)

        setLoading(true)
        setErr(false)

        // Create a unique storage ref
        const date = new Date().getTime()
        const storageRef = ref(storage, `${displayName + date}`)

        await uploadBytesResumable(storageRef, file).then(() => {
          getDownloadURL(storageRef).then(async (downloadURL) => {
            try {
              //Update profile
              await updateProfile(res.user, {
                displayName,
                photoURL: downloadURL,
              })
              //create user on firestore
              await setDoc(doc(db, 'users', res.user.uid), {
                uid: res.user.uid,
                displayName,
                nameInsensitive: displayNameInsensitive,
                email,
                photoURL: downloadURL,
              })

              // create empty user chats on firestore
              await setDoc(doc(db, 'userChats', res.user.uid), {})

              // Navigate to home page
              navigate('/')
            } catch (err) {
              console.log(err)
              setErr(true)
            }
          })
        })
        console.log('Registration successful')
        setLoading(false)
      } catch (err) {
        setLoading(false)
        console.log('handleSubmit CATCH:', err.message)
        setErr(true)
      }
    } else {
      setAvatarErr(true)
    }
  }
  return (
    <div className='form-container'>
      <div className='form-wrapper'>
        <p className='logo'>Jack's Chat</p>
        <p className='title'>Register</p>
        {loading && <ReactLoading type={'cylon'} color={'#738de4'} />}
        <form onSubmit={handleSubmit} ref={form}>
          <input
            required
            disabled={loading && true}
            type='text'
            placeholder='display name'
          />
          <input
            required
            disabled={loading && true}
            type='email'
            placeholder='email'
          />
          <input
            required
            disabled={loading && true}
            type='password'
            placeholder='password'
          />
          <input
            disabled={loading && true}
            type='file'
            className='file'
            name='file'
            id='file'
            onChange={imgFileHandler}
            value={avatar}
          />
          {avatarUploaded ? (
            <div className='upload-confirmation-wrapper'>
              <Checkmark size='26px' className='checkmark' color='#91a7ee' />
              <button
                className='remove-file-btn'
                type='button'
                onClick={() => {
                  setAvatar('')
                  setAvatarUploaded(false)
                }}>
                Change Avatar
              </button>
            </div>
          ) : (
            <label htmlFor='file' required>
              <img src={Add} alt='' />
              <span>Add an avatar</span>
            </label>
          )}
          <button disabled={loading && true} type='submit'>
            Sign Up
          </button>
          {err && (
            <span style={{ textAlign: 'center', color: 'red' }}>
              Something went wrong
            </span>
          )}
          {avatarErr && (
            <span style={{ textAlign: 'center', color: 'red' }}>
              Please upload an avatar
            </span>
          )}
          <p>
            Already have an account? <Link to={'/login'}>Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
