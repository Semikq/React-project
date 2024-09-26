import './App.css'
import './reset.css'
import { Router, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { store } from "./Redux/redux.js"
import { Provider, useSelector } from 'react-redux'
import PrimarySearchAppBar from "./primarySearchAppBar.js"
import FieldAuth from "./pages/auth/auth.js"
import projects from "./pages/projects/projects.js"
import project from "./pages/project/project.js"
import profile from "./pages/profile/profile.js"
import editProject from './pages/editProject/editProject.js'
import createProject from "./pages/createProject/createProject.js"
const history = createBrowserHistory()

function AppContent() {
  const token = useSelector((state) => state.auth.token)

  if (token) {
    return (
      <>
        <header>
          <PrimarySearchAppBar />
        </header>
        <main>
          <Switch>
            <Route exact path="/" component={projects} />
            <Route path="/project/:id" component={project} />
            <Route path="/profile/:id" component={profile}/>
            <Route path="/edit-my-project/:id" component={editProject}/>
            <Route path="/create-project" component={createProject}/>
          </Switch>
        </main>
      </>
    );
  } else {
    return (
      <div className="auth">
        <h1 className="codePen">CodePen</h1>
        <FieldAuth />
      </div>
    );
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <AppContent/>
      </Router>
    </Provider>
  );
}

export default App