const Notification = ({ notification }) => {

  const color = notification.type ===
    'error' ? 'red' :
      'info' ? 'DodgerBlue' :
        'success' ? 'green' :
          'grey'

  return(
    <div style={{ color, padding: '24px 0 24px 0' }}>
      { notification.message }
    </div>
  )
}

export default Notification