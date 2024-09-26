import { useState, useEffect } from 'react'
import axios from 'axios'
import loadingIcon from './loading.gif'
import './About.css'

/**
 * A React component that represents the Home page of the app.
 * @param {*} param0 an object holding any props passed to this component from its parent component
 * @returns The contents of this component, in JSX form.
 */
const About = props => {

  const [text, setText] = useState('')
  const [image, setImage] = useState('')
  const [error, setError] = useState('')

  /**
   * A nested function that fetches about content from the back-end server.
   */
  const fetchAbout = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/about/content`)
      .then(response => {
        // axios bundles up all response data in response.data property
        const text = response.data.text
        const image = response.data.image
        setText(text)
        setImage(`${process.env.REACT_APP_SERVER_HOSTNAME}${image}`)
      })
      .catch(err => {
        const errMsg = JSON.stringify(err, null, 2)
        setError(errMsg)
      })
  }

  // set up loading data from server when the component first loads
  useEffect(() => { fetchAbout() }, []) 
	// putting a blank array as second argument will cause this function to run only once when component first loads

  return (
    <>
      <h1>About me!</h1>

			{image ? (
        <img src={image} style={{ width: '300px', height: 'auto' }} />
      ) : (
				<img src={loadingIcon} alt="loading" />
      )}

			{text ? (
				<p className="about-description">{text}</p> 
			) : (
				<img src={loadingIcon} alt="loading" />
			)}

      {error && <p className="About-error">{error}</p>}
    </>
  )
}

export default About
