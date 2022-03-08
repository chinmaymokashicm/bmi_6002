import React from 'react'

const TabPanel = ({ content, value, index }) => {
  return (
      <div>
          {
              value === index && (
                  {content}
              )
          }
      </div>
  )
}

export default TabPanel