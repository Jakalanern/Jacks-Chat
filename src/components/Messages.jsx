import React, { useContext, useState } from 'react'
import { Message } from './Message'
import { ChatContext } from '../context/ChatContext'
import { useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export const Messages = () => {
  const [messages, setMessages] = useState([])
  const { data } = useContext(ChatContext)

  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages)
    })

    return () => {
      unSub()
    }
  }, [data.chatId])

  return (
    <div className='messages'>
      {messages.map((message) => {
        return <Message message={message} key={message.id} />
      })}
    </div>
  )
}
