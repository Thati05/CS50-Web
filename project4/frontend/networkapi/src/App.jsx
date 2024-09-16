import Posts from './components/Posts';
import LoaderComponent from './components/Loader';
import { useState, useEffect } from 'react';
import './index.css';
import Header from './components/Header.jsx';
import SidebarLeft from './components/SidebarLeft.jsx';
import SidebarRight from './components/SidebarRight.jsx';

function App() {
  // Higher Order Component wrapping Posts with Loader
  const Loader = LoaderComponent(Posts);

  const [appState, setAppState] = useState({
    loading: false,
    posts: null,
  });

  useEffect(() => {
    setAppState({ loading: true }); // Initial state before fetching the data

    fetch('http://127.0.0.1:8000/api/')
      .then((res) => res.json())
      .then((posts) => {
        console.log(posts);
        setAppState({ loading: false, posts: posts });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setAppState({ loading: false, posts: [] }); // Handle error by setting posts to empty
      });
  }, []); // Empty dependency array to run only once after mounting

  return (
    <section>
       <Header/>
      
    
    
    {/*Post display section */}

    <div className="flex flex-row justify-between items-center mt-20">
      <SidebarLeft/>
       {/* Accessing the higher-order component */}
      <Loader isLoading={appState.loading} posts={appState.posts} />
      <SidebarRight/>

    </div>


    </section>
 
  );
}

export default App;

 {/* This is known as a high order component where 
    we are wrap a the Posts component in the Loader component,
    which means that we are going to first run the Loader component
    and check its state if the loader == false else we are going to run the 
    the Posts component 
    */}