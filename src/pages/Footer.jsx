import React from 'react'

function Footer() {
  return (
    <footer className="backdrop-blur py-6 mt-10">
      <div className="container mx-auto px-4 text-center">
        © {new Date().getFullYear()}{" "}
        <span className="font-medium text-foreground">Nexhire™</span>. 
        All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
