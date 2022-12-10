import { useEffect } from 'react';
import {Routes, Route} from 'react-router-dom';
import type {} from 'redux-thunk/extend-redux';
import { useAppDispatch } from './hooks/useAppDispatch';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import { fetchComments } from './store/action-creators/comments';
import { fetchProjects } from './store/action-creators/projects';
import { fetchTasks } from './store/action-creators/tasks';

function App() {

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
    dispatch(fetchComments());
  }, [])

  return (
    <Routes>
      <Route path='/' element={<Projects />} />
      <Route path='/:projectId/tasks' element={<Tasks />} />
      <Route path='*' element={<Projects />} />
    </Routes>
  );
}

export default App;
