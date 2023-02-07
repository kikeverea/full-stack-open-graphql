const Notification = ({ notification }) => {

  const determineColor = type => {
    switch (type) {
    case 'error' :
      return 'red'
    case 'info' :
      return 'DodgerBlue'
    case 'success' :
      return 'green'
    default :
      return 'grey'
    }
  }

  const color = determineColor(notification.type)

  return(
    <div style={{ color, padding: '24px 0 24px 0' }}>
      { notification.message }
    </div>
  )
}

export default Notification