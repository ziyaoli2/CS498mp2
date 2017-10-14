import React, { Component } from "react";
import { Button, Search, Grid, Header } from "semantic-ui-react";
import { render } from "react-dom";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";

import _ from "lodash";
import faker from "faker";
import axios from "axios";
import styles from "./Home.scss";

var m = [];

var items = [];
var halfitems = [];

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      p: [],
      ready: false
    };
  }

  componentWillMount() {
    this._isMounted = true;

    axios
      .get("https://pokeapi.co/api/v2/pokemon/?limit=50")
      .then(response => {
        //console.log(response);
        //console.log(response.data.results);
        console.log(response.data.results[24]);
        let results = response.data.results;
        this.setState({
          p: results.map(elem => {
            return {
              ur: elem.url,

              na: elem.name
            };
          })
        });
      })
      .then(() => {
        for (var i = 0, len = this.state.p.length; i < len; ++i) {
          m.push(this.state.p[i]);
        }
      })
      .then(() => {
        console.log("Start loading");

        var count = 0;

        for (var i = 0, len = 50; i < len; i++) {
          axios
            .get(m[i].ur)
            .then(response => {
              items.push(response.data.sprites.back_default);

              count++;

              if (count % 2 == 1) {
                console.log(m[count].ur);
                halfitems.push(response.data.sprites.back_default);
              }
            })
            .then(() => {
              if (count == 50) {
                console.log("finish loading!");

                this.setState({ ready: true });
              }
            });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  bobo() {
    console.log(this.state);
    console.log("!!!!!!");
  }

  render() {
    var text = this.state.ready ? "finished loading" : "loading";

    this.bobo();

    return (
      <Router>
        <div>
          <center>
            <Link to="/search">
              <Button basic color="blue">
                Search
              </Button>
            </Link>
            <span> </span>
            <Link to="/gallery">
              {" "}
              <Button basic color="red">
                <b> Gallery {text}</b>
              </Button>
            </Link>
          </center>

          <hr />

          <Route path="/search" component={SearchPart} />
          <Route path="/gallery" component={Gallery} />
        </div>
      </Router>
    );
  }
}

class SearchPart extends Component {
  render() {
    return <h1>Search here</h1>;
  }
}

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      even: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.setState({ even: !this.state.even });
  }

  render() {
    const imagesElements = items.map(e => {
   /*   return (


      <Router>
        <Link to= "/detail">

            <img src={`${e}`} />

        </Link>
  <hr />
        <Route path = "/detail"
                component = {Detail}/>

      </Router>

      )*/
      return(<img src={`${e}`} />)
    });

    const halfimagesElements = halfitems.map(e => {
  /*    return (

       <Router>
              <Link to= "/detail">

                  <img src={`${e}`} />

              </Link>

  <hr />

              <Route path = "/detail"
                      component = {Detail}/>

            </Router>



      ) */
      return(<img src={`${e}`} />)
    });

    var test = this.state.even ? "Click to show All" : "Click to show half(1,3,5,7..)";
    var element = this.state.even ? halfimagesElements : imagesElements;

  return (
      <div>
        <div>
          <center>
            {" "}
            <Button basic color="black" onClick={this.handleClick}>
              <b> {test}</b>
            </Button>
          </center>
        </div>
        {element}
      </div>
    );
  }
}



class Detail extends Component {

    render() {
        return(
        <h2> Detail!</h2>
        )
    }

}


export default Home;
