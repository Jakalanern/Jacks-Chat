import React from 'react'
import { AuthContext } from '../context/AuthContext'
import { useContext } from 'react'
import { ChatContext } from '../context/ChatContext'
import { useRef } from 'react'
import { useEffect } from 'react'

export const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext)
  const { data } = useContext(ChatContext)

  const ref = useRef()

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }, [message])

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && 'owner'}`}>
      <div className='message-info'>
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=''
        />
      </div>
      <div className='message-content'>
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt='' />}
      </div>
    </div>
  )
}
