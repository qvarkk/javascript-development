import { useEffect, useState } from "react"
import {
  notificationEvent,
  notificationsBus,
} from "../services/notificationService"
import Notification from "./Notification"

function NotificationManager() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const handleNewNotification = (text) => {
      const id = crypto.randomUUID()

      setNotifications((prev) => [...prev, { id, text }])

      setTimeout(() => {
        dismissNotification(id)
      }, 5000)
    }

    const unsubscribe = notificationsBus.subscribe(
      notificationEvent,
      handleNewNotification,
    )

    return () => {
      unsubscribe()
    }
  }, [])

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-4">
      {notifications.map(({ id, text }) => (
        <Notification
          key={id}
          text={text}
          onDismiss={() => dismissNotification(id)}
        />
      ))}
    </div>
  )
}

export default NotificationManager
