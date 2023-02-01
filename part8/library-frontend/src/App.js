import {useEffect, useState} from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Notification from './components/Notification'
import {useApolloClient} from '@apollo/client'

const App = () => {
  const client = useApolloClient()
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('library-user-token')
    if (token)
      setToken(token)
  }, [])

  const login = async token => {
    localStorage.setItem('library-user-token', token)
    setToken(token)
    setPage('books')
  }

  const logout = async () => {
    localStorage.removeItem('library-user-token')
    await client.clearStore()
    setToken(null)
  }

  return (
    <div>
      { error && <Notification notification={{ message: error, type: 'error' }}/> }
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {
          token ?
            <>
              <button onClick={() => setPage('add')}>add book</button>
              <button onClick={ logout }>logout</button>
            </>
          :
            <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Authors show={page === 'authors'} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} />
      <Login show={page === 'login'} loggedIn={ login } setError={ setError }/>
    </div>
  )
}

export default App
