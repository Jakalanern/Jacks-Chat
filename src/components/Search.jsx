import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { db } from '../firebase'

export const Search = () => {
  const [username, setUsername] = useState('')
  const [user, setUser] = useState('')
  const [err, setErr] = useState(false)

  const { currentUser } = useContext(AuthContext)
  const { dispatch } = useContext(ChatContext)

  const handleSearch = async (e) => {
    let q = query(
      collection(db, 'users'),
      where('nameInsensitive', '==', username.toLowerCase())
    )

    try {
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        setUser(doc.data())
        setErr('')
      })
    } catch (err) {
      setErr(true)
      setUser('')
      console.log(err.message)
    }
  }

  const handleKey = (e) => {
    e.code === 'Enter' && handleSearch()
  }

  const handleSelect = async () => {
    // check whether the group (chats in firestore) exists, if not, create new one
    const combinedID =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid
    try {
      const res = await getDoc(doc(db, 'chats', combinedID))

      if (!res.exists()) {
        // create a chat in chats collection
        await setDoc(doc(db, 'chats', combinedID), { messages: [] })

        // create user chats
        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [combinedID + '.userInfo']: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedID + '.date']: serverTimestamp(),
        })

        await updateDoc(doc(db, 'userChats', user.uid), {
          [combinedID + '.userInfo']: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedID + '.date']: serverTimestamp(),
        })
      } else {
        console.log('res didnt exist')
      }
    } catch (err) {
      console.log(err.message)
    }

    setUser(null)
    setUsername('')
    dispatch({ type: 'CHANGE_USER', payload: user })
  }

  return (
    <div className='search'>
      <div className='search-form'>
        <input
          type='text'
          placeholder='Find a user'
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {user && (
        <div className='user-chat' onClick={handleSelect}>
          <img src={user.photoURL} alt='' />
          <div className='user-chat-info'>
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
      {err && (
        <span
          style={{
            paddingLeft: '15px',
            color: 'red',
            fontSize: '12px',
          }}>
          User not found
        </span>
      )}
    </div>
  )
}
