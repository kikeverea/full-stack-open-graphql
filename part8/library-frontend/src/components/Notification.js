const Notification = ({ notification }) => {

  const color = notification.type === 'error' ? 'red' : 'green'

  return(
    <div style={{ color }}>
      { notification.message }
    </div>
  )
}

export default Notification