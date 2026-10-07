function Notification({ text, onDismiss }) {
  return (
    <div
      className="flex items-center justify-start px-6 py-4 bg-(--bg-sub) rounded-[18px]"
      onClick={onDismiss}
    >
      <span>{text}</span>
    </div>
  )
}

export default Notification
