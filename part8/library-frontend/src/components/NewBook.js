import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_BOOK } from '../client/mutations'

const NewBook = ({ show }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [error, setError] = useState('')

  const [ createBook ] = useMutation(ADD_BOOK, {
    onError: error => {
      const graphQlErrors = error.graphQLErrors
      displayError(graphQlErrors.length > 0 ? graphQlErrors[0].message : 'Error')
    }
  })

  const displayError = error => {
    setError(error)
    setTimeout(() => setError(null), 3000)
  }

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    const publishedValue = parseInt(published)
    await createBook({ variables: { title, author, published: publishedValue, genres }})

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
        { error && <div>{ error }</div> }
      </form>
    </div>
  )
}

export default NewBook
