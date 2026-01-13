import React from 'react'
import { Triangle } from 'react-loader-spinner';

const Loader = () => {
  return (
    <div className='fixed z-99 top-1/2 left-1/2'>

      <Triangle
        height="80"
        width="80"
        color="blue"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  )
}

export default Loader

