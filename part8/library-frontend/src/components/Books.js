import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../client/queries'

const Books = ({ show }) => {

  const books = useQuery(ALL_BOOKS)

  if (books.loading)
    return <div>loading...</div>

  return (show
    ? <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.data.allBooks.map(book => (
            <tr key={ book.title }>
              <td>{ book.title }</td>
              <td>{ book.author.name }</td>
              <td>{ book.published }</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    :
    null
  )
}

export default Books
