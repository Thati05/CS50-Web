import Posts from './components/Posts';
import LoaderComponent from './components/Loader';
import { useState, useEffect } from 'react';
import './index.css';
import Header from './components/Header.jsx';
import SidebarLeft from './components/SidebarLeft.jsx';
import SidebarRight from './components/SidebarRight.jsx';

function App() {
  const Loader = LoaderComponent(Posts);

  const [appState, setAppState] = useState({
    loading: false,
    posts: [],
    next: null,
    previous: null,
    count: 0,
  });

  useEffect(() => {
    setAppState({ loading: true }); // Initial state before fetching the data

    fetch('http://127.0.0.1:8000/api/')
      .then((res) => res.json())
      .then((data) => {
        setAppState({
          loading: false,
          posts: data.results,  // Set the results array in posts
          next: data.next,      // Set the next page URL
          previous: data.previous,  // Set the previous page URL
          count: data.count,    // Total number of posts
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setAppState({ loading: false, posts: [] }); // Handle error by setting posts to empty
      });
  }, []);

  return (
    <section>
      <Header />

      {/*Post display section */}
      <div className="flex flex-row  w-full justify-between ">
        <SidebarLeft />
        {/* Accessing the higher-order component */}
        <Loader
          isLoading={appState.loading}
          posts={appState.posts}
          next={appState.next}
          previous={appState.previous}
          count={appState.count}
        />
        <SidebarRight />
      </div>
    </section>
  );
}

export default App;
