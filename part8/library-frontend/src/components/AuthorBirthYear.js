import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_AUTHOR_BORN } from '../client/mutations'
import { ALL_AUTHORS } from '../client/queries'

const AuthorBirthYear = () => {

  const [ name, setName ] = useState('')
  const [ birthYear, setBirthYear ] = useState('')
  const [ error, setError ] = useState(null)

  const [ updateAuthor ] = useMutation(UPDATE_AUTHOR_BORN, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: error => {
      const toDisplay = error.graphQLErrors.length > 0
        ? error.graphQLErrors[0].message
        : 'Client Error'

      displayError(toDisplay)
    }
  })

  const column = { display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 200 }
  const row = { display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}

  const nameChange = ({ target }) =>
    setName(target.value)

  const yearChange = ({ target }) =>
    setBirthYear(target.value)

  const displayError = error => {
    setError(error)
    setTimeout(() => setError(null), 3000)
  }

  const editAuthorBirthYear = async event => {
    event.preventDefault()
    await updateAuthor({ variables: { author: name, setBornTo: birthYear } })
  }

  return (
    <>
      <h2>Set birth year</h2>
      <form onSubmit={ editAuthorBirthYear }>
        <div style={ column }>
          <div style={ row }>
            name
            <input type="text" value={ name } onChange={ nameChange }/>
          </div>
          <div style={ row }>
            year born
            <input name='year' type="text" value={ birthYear } onChange={ yearChange }/>
          </div>
          <div style={ row }>
            <button type='submit'>update author</button>
          </div>
          <div style={{ color: 'red' }}>
            { error }
          </div>
        </div>
      </form>
    </>
  )
}

export default AuthorBirthYear