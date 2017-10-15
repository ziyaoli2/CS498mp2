import React, { Component } from "react";
import { Button, Search, Grid, Header,Image,Item,Input } from "semantic-ui-react";
import { render } from "react-dom";
import { Link, HashRouter as Router, Route } from "react-router-dom";
import PropTypes from 'prop-types'
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
         // console.log(m[i].na + " my name ")
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
    var text = this.state.ready ? "finished loading" : "data loading";
    this.bobo();
    return (
      <Router>
        <div>
          <center>
            <Link to="/search">
              <Button basic color="blue">
                Search {text}
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

    var test = this.state.even ? "Click to show All" : "Click to filter out items with odd index in the gallery matrix";
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

            if(PokeId  != 0 && PokeId  != 51) {

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
            }


             render () {

                 const detailImg =<Image src= {this.state.img}   size='large'/>
                 const detailName = <h2>Name: {this.state.name}</h2>
                 const id = <div> <h2>ID: {this.state.id}</h2> </div>
                 const height = <div> <h2>Height:{this.state.height} </h2></div>
                 const exp = <div> <h2>Base Experience: {this.state.baseExperience} </h2></div>
                 const wei = <div> <h2>Weight: {this.state.weight} </h2></div>

                 const But =  <div>
                     <Button as={Link} to={`/detail/${this.state.id - 1}`}>Pre</Button>
                     <span>                                                     </span>
                      <Button as={Link} to={`/detail/${this.state.id + 1}`}>Next </Button>
                         </div>

                 return (
                      <div >
                        <center>
                            {detailImg}
                            {But}
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


Detail.PropTypes = {
    PokeId : PropTypes.number.isRequired
}





class SearchPart extends Component {

    constructor(props) {
        super(props)
        this.getInput = this.getInput.bind(this)
      }


    getInput() {

    }




  render() {
    return(
    <div >
    <h1>Search here</h1>
        <Pane OnDataChange={this.getInput}/>
        </div>
    )
  }
}

var nameList = [];
var urlList = [];
var imageList = [];

var yi = [];
var er = [];

class Pane extends Component {

      constructor (props) {
            super(props)
            this.state = {
                  text : '',
                  name : [],
		  sort : true,
		  way : true
                }
                this.fetch = this.fetch.bind(this)
		this.handleClick = this.handleClick.bind(this)
		this.Order = this.Order.bind(this)
          }

          fetch () {
          var cur =[];
                for (var i = 0, len = m.length; i < len; i++) {

                   if(this.state.text.length != 0 && m[i].na.indexOf(this.state.text) >= 0)
                   {
                        console.log(m[i].na)

                       cur.push(m[i].na)

                       urlList.push(m[i].ur)

                   }

                            }
                             nameList = cur;
			                    nameList.sort();
			                    yi = nameList.sort();



			                    /////////////

			                    var leng =[];
			                    var made = [];

                                        for (var i = 0, len = nameList.length; i < len; i++) {

                                        		//	console.log(nameList[i] + "length is " + nameList[i].length)
                                        		leng.push(nameList[i].length)
                                        		made.push(nameList[i])
                                        		}

                                        		 for (var j = 0, ding = leng.length - 1; j < ding; j++) {
                                        		    var global = j
                                        		       for(var q = j + 1; q < ding + 1; q ++ ) {
                                        		              if(leng[q] < leng[global]) {
                                                                         global = q;
                                                                       }

                                        		    }
                                        		    var temp = leng[j]
                                        		    var tempp = made[j]
                                        		    leng[j] = leng[global]
                                        		    made[j] = made[global]
                                        		    leng[global] = temp
                                        		    made[global] = tempp
                                        		 }

                                              //  var f = [];
                                              er= made

			                    ////////

          }



		 handleClick(event) {
          this.setState({sort: !this.state.sort});
        }


        Order(event) {
            this.setState({way: !this.state.way});

        }



    render() {

nameList = this.state.way ? yi : er

nameList = this.state.sort ? nameList : nameList.reverse()



    const qq = nameList.map(e => {
        var image = ''
		var id = ''
		for (var i = 0, len = m.length; i < len; i++) {
			if (m[i].na == e) {
				id = i + 1
			}	       
		} 
      
	const ID = <h3> {id} </h3>

//as={Link} to={`/detail/${this.state.id - 1}`
                return(<div>
                      <Item  as={Link} to={`/detail/${id}`}     >                   
                      	{e}
			{ID}			
                      </Item>		
                      </div>
                 )
                  });
                    return(
                                <div>
				<Button onClick={this.handleClick}> Reverse Order </Button>
				<Button onClick={this.Order}> Another way to order(alphabetically or by length of name) </Button>
                             <Input fluid loading icon='user' placeholder='Search...'  onChange={(event, data) => {
                                                                                                 this.setState({text : data.value}, this.props.OnDataChange.bind(this, this.state))
                                                                                                 this.fetch()
                                                                                               }}
                                                                                                />
                                {qq}
                                </div>
                    )
        }

}








export default Home;
