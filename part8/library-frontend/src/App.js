import {useEffect, useState} from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Notification from './components/Notification'
import {useApolloClient, useQuery} from '@apollo/client'
import Recommendations from './components/Recommendations'
import { ME } from './client/queries'

const App = () => {
  const client = useApolloClient()
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  const me = useQuery(ME, { fetchPolicy: 'no-cache' })

  useEffect(() => {
    const token = localStorage.getItem('library-user-token')
    if (token) {
      setToken(token)
    }
  }, [])

  useEffect(() => {
    me.refetch()
  }, [token])

  useEffect(() => {
    if (me.data) {
      setUser(me.data.me)
    }
  }, [me.data])

  const loggedIn = async token => {
    localStorage.setItem('library-user-token', token)
    setToken(token)
    setPage('books')
  }

  const logout = async () => {
    localStorage.removeItem('library-user-token')
    await client.clearStore()
    setToken(null)
    setPage('authors')
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
              <button onClick={() => setPage('recommendations')}>recommend</button>
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
      <Recommendations show={page === 'recommendations'} user={ user } />
      <Login show={page === 'login'} loggedIn={ loggedIn } setError={ setError }/>
    </div>
  )
}

export default App
