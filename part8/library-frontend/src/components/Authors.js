import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../client/queries'
import  EditBirthYear from './EditBirthYear'

const Authors = ({ show }) => {

  const authors = useQuery(ALL_AUTHORS)

  if (authors.loading)
    return <div>loading...</div>

  return (show
    ?
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          { authors.data.allAuthors.map(author => (
            <tr key={ author.name }>
              <td>{ author.name }</td>
              <td>{ author.born }</td>
              <td>{ author.bookCount }</td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditBirthYear authors={ authors.data.allAuthors }/>
    </div>
    :
    null
  )
}

export default Authors
