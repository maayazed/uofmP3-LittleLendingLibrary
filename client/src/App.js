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
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
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
              <Route exact path="/library" component={withRouter(Library)} />
              <Route
                exact
                path="/library/:libraryId"
                component={withRouter(Library)}
              />
              <Route exact path="/addbook" component={withRouter(AddBook)} />
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
