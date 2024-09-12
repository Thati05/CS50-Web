import React from 'react'

function Loader(Component){
  return function  LoaderComponent({ isLoading, ...props }) {
    if (!isLoading) return <Component {...props} />;
    return (
      <p>

        We are waiting for the data to load...
      </p>


    )
  }
}
export default Loader