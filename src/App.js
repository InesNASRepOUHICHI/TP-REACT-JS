import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';


window.React = React;


export class RestaurantList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    var restaurantNodes = this.props.data.map(restaurant =>
      <Restaurant key={restaurant._id} restaurant={restaurant} deleteRestaurant={this.props.deleteRestaurant} />
    );


    return (

      <div>
        <table className="table table-striped" id="project-restaurants">
          <thead>
            <tr>
              <th>Id</th><th>Name</th><th>Cuisine</th><th> </th><th> </th>
            </tr>
          </thead>
          <tbody>{restaurantNodes}</tbody>
        </table>
      </div>
    );
  }
};

class RestaurantTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var restaurants = this.props.data.map(restaurant =>
      <Restaurant key={restaurant._id} restaurant={restaurant} deleteRestaurant={this.props.deleteRestaurant} />
    );

    return (
      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Id</th><th>Name</th><th>Cuisine</th><th> </th><th> </th>
            </tr>
          </thead>
          <tbody>{restaurants}</tbody>
        </table>
      </div>);
  }
}


export class App extends Component {
  constructor(props) {
    super(props);
    this.deleteRestaurant = this.deleteRestaurant.bind(this);
    this.createRestaurant = this.createRestaurant.bind(this);
    this.state = {
      data: [],
      offset: 0
    }
  }
  
  // Load restaurants from database
  loadRestaurantsFromServer(pageIndex) {
    fetch('http://localhost:8080/api/restaurants?page='+pageIndex+'&pagesize=10')
      .then((response) => response.json())
      .then((responseData) => {
         this.setState({data: responseData.data, pageCount: Math.ceil(responseData.count/10)});
      });
  }

  componentDidMount() {
    this.loadRestaurantsFromServer(0);
  }


  // Delete restaurant
  deleteRestaurant(restaurant) {
    fetch('http://localhost:8080/api/restaurants/' + restaurant._id,
      { method: 'DELETE', })
      .then(
        res => this.loadRestaurantsFromServer(0)
      )
      .catch(err => console.error(err))
  }

  // Create new restaurant
  createRestaurant(restaurant) {
    fetch('http://localhost:8080/api/restaurants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(restaurant)
    })
      .then(
        res => this.loadRestaurantsFromServer(0)
      )
      .catch(err => console.error(err))
  }

  

  handlePageClick = (data) => {
    let selected = data.selected;
    console.log(selected);
    let offset = Math.ceil(selected * this.props.perPage);

    this.setState({offset: offset}, () => {
      this.loadRestaurantsFromServer(selected);
    });
  };

  render() {
    return (
      <div className="restaurantBox">
        <RestaurantForm createRestaurant={this.createRestaurant} />
        <RestaurantList data={this.state.data} deleteRestaurant={this.deleteRestaurant}  />
        <ReactPaginate previousLabel={"previous"}
                       nextLabel={"next"}
                       breakLabel={<a href="">...</a>}
                       breakClassName={"break-me"}
                       pageCount={this.state.pageCount}
                       marginPagesDisplayed={2}
                       pageRangeDisplayed={5}
                       onPageChange={this.handlePageClick}
                       containerClassName={"pagination"}
                       subContainerClassName={"pages pagination"}
                       activeClassName={"active"} />
      </div>
    );
  }
};



class Restaurant extends React.Component {
  constructor(props) {
    super(props);
    this.deleteRestaurant = this.deleteRestaurant.bind(this);
  }

  deleteRestaurant() {
    var r = window.confirm("Voulez-vous vraiment supprimer ce restaurant: "+this.props.restaurant.name+"?");
    if (r == true) {
      this.props.deleteRestaurant(this.props.restaurant);
    } 
    
  }

  render() {
    return (
      <tr>
        <td>{this.props.restaurant._id}</td>
        <td>{this.props.restaurant.name}</td>
        <td>{this.props.restaurant.cuisine}</td>
        <td>
          <button className="btn btn-danger glyphicon glyphicon-trash" onClick={this.deleteRestaurant}>  Supprimer</button>
        </td>
        <td>
          <button className="btn btn-primary glyphicon glyphicon-pencil" onClick={this.updateRestaurant}>  Modifier</button>
        </td>
      </tr>
    );
  }
}


class RestaurantForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { _id: '', name: '', cuisine: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    console.log("NAME: " + event.target.name + " VALUE: " + event.target.value)
    this.setState(
      { [event.target.name]: event.target.value }
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    var newRestaurant = { name: this.state.name, cuisine: this.state.cuisine };
    console.log(newRestaurant);
    this.props.createRestaurant(newRestaurant);
    window.alert("Restaurant "+newRestaurant.name+" bien ajouté");
  }

  render() {
    return (
      <div className="panel panel-default">
      <h1 align="center">TP React JS + Node JS + Mongo DB</h1>
        <div className="panel-heading">Créer un restaurant</div>
        <div className="panel-body">
          <form className="form-inline">
            <div className="col-md-2">
              <input type="text" placeholder="Name" className="form-control" name="name" onChange={this.handleChange} />
            </div>
            <div className="col-md-2">
              <input type="text" placeholder="Cuisine" className="form-control" name="cuisine" onChange={this.handleChange} />
            </div>
            <div className="col-md-2">
              <button className="btn btn-success glyphicon glyphicon-floppy-save " onClick={this.handleSubmit}>  Enregistrer</button>
            </div>
          </form>
        </div>
      </div>

    );
  }
}


ReactDOM.render(
  <App 
       author={'adele'}
       perPage={10} />,
  document.getElementById('root')
);


export default App;

