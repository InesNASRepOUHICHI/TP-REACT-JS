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
      <Restaurant key={restaurant._id} restaurant={restaurant} deleteRestaurant={this.props.deleteRestaurant} updateRestaurant={this.props.updateRestaurant} />
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
    this.searchRestaurants = this.searchRestaurants.bind(this);
    this.state = {
      data: [],
      offset: 0
    }
  }

  // Load restaurants from database
  loadRestaurantsFromServer(pageIndex) {
    fetch('http://localhost:8080/api/restaurants?page=' + pageIndex + '&pagesize=10')
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({ data: responseData.data, pageCount: Math.ceil(responseData.count / 10) });
      });
  }

  // seacrh restaurants from database
  searchRestaurants(name) {
    fetch('http://localhost:8080/api/restaurants?page=0&pagesize=10&name=' + name)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({ data: responseData.data, pageCount: Math.ceil(responseData.count / 10) });
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


  // Create new restaurant
  updateRestaurant(restaurant) {
    fetch('http://localhost:8080/api/restaurants/' + restaurant._id, {
      method: 'PUT',
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

    this.setState({ offset: offset }, () => {
      this.loadRestaurantsFromServer(selected);
    });
  };

  render() {
    return (
      <div className="restaurantBox">
        <RestaurantForm createRestaurant={this.createRestaurant} />
        <SearchRestaurantForm searchRestaurants={this.searchRestaurants} />
        <RestaurantList data={this.state.data} deleteRestaurant={this.deleteRestaurant} updateRestaurant={this.updateRestaurant} />
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
    this.updateRestaurant = this.updateRestaurant.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = { name: this.props.restaurant.name, cuisine:this.props.restaurant.cuisine };
  }

  handleChange(event) {
    this.setState(
      { [event.target.name]: event.target.value }
    );
  }

  deleteRestaurant() {
    var r = window.confirm("Voulez-vous vraiment supprimer ce restaurant: " + this.props.restaurant.name + "?");
    if (r == true) {
     this.props.deleteRestaurant(this.props.restaurant);
    }

  }

  updateRestaurant() {
    var r = window.confirm("Voulez-vous vraiment modifier ce restaurant: " + this.props.restaurant.name + "?");
    if (r == true) {
      this.props.restaurant.name = this.state.name;
      this.props.restaurant.cuisine = this.state.cuisine;
      this.props.updateRestaurant(this.props.restaurant);
    }

  }


  render() {
    return (
      <tr>
        <td>{this.props.restaurant._id}</td>
        <td><input type="text" name="name" defaultValue ={this.props.restaurant.name} onChange={this.handleChange}/></td>
        <td><input type="text" name="cuisine" defaultValue ={this.props.restaurant.cuisine} onChange={this.handleChange}/></td>
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
    this.setState(
      { [event.target.name]: event.target.value }
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    var newRestaurant = { name: this.state.name, cuisine: this.state.cuisine };
    this.props.createRestaurant(newRestaurant);
    this.state.name = "";
    this.state.cuisine = "";
  }

  render() {
    return (
      <div className="panel panel-default">
        <h1 align="center">TP React JS + Node JS + Mongo DB</h1>
        <div className="panel-heading">Créer un restaurant</div>
        <div className="panel-body">
          <form className="form-inline">
            <div className="col-md-2">
              <input type="text" placeholder="Name" className="form-control" value={this.state.name} name="name" onChange={this.handleChange} />
            </div>
            <div className="col-md-2">
              <input type="text" placeholder="Cuisine" className="form-control" value={this.state.cuisine} name="cuisine" onChange={this.handleChange} />
            </div>
            <div className="col-md-2">
              <input type="submit" className="btn btn-success glyphicon glyphicon-floppy-save " onClick={this.handleSubmit} value="  Enregistrer"/>
            </div>
          </form>
        </div>
      </div>

    );
  }
}


class SearchRestaurantForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState(
      { [event.target.name]: event.target.value }
    );
    var query = { name: this.state.name };
    this.props.searchRestaurants(query.name);
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">Chercher un restaurant</div>
        <div className="panel-body">
          <form className="form-inline">
            <div className="col-md-2">
              <input type="text" placeholder="Name" className="form-control" name="name" onChange={this.handleChange} />
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

