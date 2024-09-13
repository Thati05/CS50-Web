import Posts from './components/Posts'
import LoaderComponent from './components/Loader'
import { useState, useEffect } from 'react'
import './index.css'


function App() {
  
  {/* This is known as a high order component where 
    we are wrap a the Posts component in the Loader component,
    which means that we are going to first run the Loader component
    and check its state if the loader == false else we are going to run the 
    the Posts component 
    */}const Loader = LoaderComponent(Posts)

 

 const [appState, setAppState] = useState({
  loading:false,
  posts: null

 })

 useEffect(() => {

 setAppState({loading:true}); /// intial state before fecthing the data

 fetch('http://127.0.0.1:8000/api/').then((res) => {
  return res.json()
 }).then((posts)=> {
  console.log(posts)
  setAppState({loading:false, posts:posts})
 })

  
 }, [setAppState]);
 

  return (
    <div className=' flex flex-col'>
    <div>Christ Jesus</div>
    <h1>Latest Posts</h1>
    {/*We are accessing the higher order component */}
    <Loader isLoading={appState.loading} posts={appState.posts}/> 

    </div>
  )
}

export default App
