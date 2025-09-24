import React from "react"

interface AlertProps {
  type: "success" | "error" | "warning" | "info"
  message: string
}

const colors = {
  success: "bg-green-100 text-green-800 border-green-400",
  error: "bg-red-100 text-red-800 border-red-400",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-400",
  info: "bg-blue-100 text-blue-800 border-blue-400",
}

const Alert: React.FC<AlertProps> = ({ type, message }) => {
  return (
    <div
      className={`border px-4 py-2 rounded-lg mb-3 ${colors[type]}`}
      role="alert"
    >
      {message}
    </div>
  )
}

export default Alert
