import React, { useState, useEffect, useMemo, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import CustomAppBar from './components/AppBar';
import Feeds from './components/Feeds';
import Loading from './components/Loading';
import AddPost from './components/AddPost';

const Login = React.lazy(() => import('./components/Login'));
const Register = React.lazy(() => import('./components/Register'));
const MyPosts = React.lazy(() => import('./components/MyPosts'));
const SavedPosts = React.lazy(() => import('./components/SavedPosts'));

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const memoizedUser = useMemo(() => user, [user]);

  return (
    <Router>
      <CustomAppBar user={memoizedUser} />

      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='/feeds' element={<Feeds user={memoizedUser} />} />
          <Route
            path='/login'
            element={memoizedUser ? <Navigate to='/feeds' /> : <Login />}
          />
          <Route
            path='/register'
            element={memoizedUser ? <Navigate to='/feeds' /> : <Register />}
          />
          <Route path='/my-posts' element={<MyPosts user={memoizedUser} />} />
          <Route
            path='/saved-posts'
            element={<SavedPosts user={memoizedUser} />}
          />
          <Route path='/add-post' element={<AddPost />} />
          <Route path='*' element={<Navigate to='/feeds' />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
