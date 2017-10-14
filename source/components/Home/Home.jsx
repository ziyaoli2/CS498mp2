import React, { Component } from "react";
import { Button, Search, Grid, Header,Image,Item } from "semantic-ui-react";
import { render } from "react-dom";
import { Link, HashRouter as Router, Route } from "react-router-dom";

import _ from "lodash";
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
          //console.log(this.state.p[i].ur + " number " + i)
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
          <Route path="/detail/:id" render={({ match }) => {
                                                  return <Detail PokeId={match.params.id} />
                                                }}  />
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
          var cao = e.replace(/[^0-9]/ig,"");
      return(
                <Item.Image  src={`${e}`}     as={Link} to={`/detail/${cao}`}  />
            )
    });

    const halfimagesElements = halfitems.map(e => {
                    var cao = e.replace(/[^0-9]/ig,"");
        return(
         <Item.Image  src={`${e}`}     as={Link} to={`/detail/${cao}`}  />
      )
    });

    var test = this.state.even ? "Click to show All" : "Click to show half(1,3,5,7..)";
    var element = this.state.even ? halfimagesElements : imagesElements;

  return (
                   <div>
                            <div>
                              <center>
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

     constructor (props) {
        super(props)

        this.state = {
          name: '',
          id: '' ,
          height: '',
          img: '',
          weight: '',
          baseExperience: ''
        }

        this.updatePokeId(this.props.PokeId)
          }

          componentWillReceiveProps (nextProps) {
              if (nextProps.PokeId !== this.props.PokeId) {
                this.updatePokeId(nextProps.PokeId)
              }
            }


           updatePokeId (PokeId) {



            axios.get(m[PokeId - 1].ur)
             .then((response) => {
                this.setState({
                  name: response.data.species.name,
                  id: response.data.id,
                  height: response.data.height,
                  img:response.data.sprites.back_default,
                  weight: response.data.weight,
                  baseExperience: response.data.base_experience
                })
                console.log(response)
               // console.log("checkitout")

              }).catch((err) => {
                console.log(err)
              })
            }


             render () {

        const detailImg =  <Image src= {this.state.img}   size='large'/>
         const detailName = <div><h1>Name: {this.state.name}</h1></div>

             const id = <div> <h2>ID: {this.state.id}</h2> </div>
             const height = <div> <h2>Height:{this.state.height} </h2></div>
               const exp = <div> <h2>Base Experience: {this.state.baseExperience} </h2></div>
                const wei = <div> <h2>Weight: {this.state.weight} </h2></div>
                return (
                  <div >
                    <center>

                        {detailImg}
                        {detailName}
                        {id}
                        {height}
                        {wei}
                        {exp}
                    </center>
                  </div>
                )
              }
            }







export default Home;
