import React from "react";
import { setContext } from "@apollo/client/link/context";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";

// Pages
import Homepage from "./pages/Homepage";
import loginPage from "./pages/loginPage";
import Library from "./pages/Library";
import AddBook from "./pages/AddBook";

//Components
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const homeStyle = {
  border: "solid #a76e0a 5vh",
};

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Header />
          <Navbar />
          <div style={homeStyle}>
            <Switch>
              <Route exact path="/" component={withRouter(Homepage)} />
              <Route exact path="/login" component={withRouter(loginPage)} />
              <Route
                exact
                path="/library/:libraryId"
                component={withRouter(Library)}
              />
              <Route exact path="/addBook/library/:libraryId" component={withRouter(AddBook)} />
              <Route
                render={() => <h1 className="display-2">Wrong page!</h1>}
              />
            </Switch>
          </div>
          <Footer />
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
