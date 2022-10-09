import { doc, onSnapshot } from 'firebase/firestore'
import React, { useState } from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { db } from '../firebase'

export const Chats = () => {
  const [chats, setChats] = useState([])
  const { currentUser } = useContext(AuthContext)
  const { dispatch } = useContext(ChatContext)

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
        setChats(doc.data())
      })

      return () => {
        unsub()
      }
    }

    currentUser.uid && getChats()
  }, [currentUser.uid])

  const handleSelect = (user) => {
    dispatch({ type: 'CHANGE_USER', payload: user })
  }

  return (
    <div className='chats'>
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => {
          return (
            <div
              className='user-chat'
              key={chat[0]}
              onClick={() => handleSelect(chat[1].userInfo)}>
              <img
                src={
                  chat[1].userInfo.photoURL
                    ? chat[1].userInfo.photoURL
                    : 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
                }
                alt=''
              />
              <div className='user-chat-info'>
                <span>{chat[1].userInfo.displayName}</span>
                <p>{chat[1].lastMessage?.text}</p>
              </div>
            </div>
          )
        })}
    </div>
  )
}
