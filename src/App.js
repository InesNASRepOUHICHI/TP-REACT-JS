import React from 'react';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.deleteRestaurant = this.deleteRestaurant.bind(this);
    this.createRestaurant = this.createRestaurant.bind(this);
    this.state = {
      restaurants: [],
    };
  }

  componentDidMount() {
    this.loadRestaurantsFromServer();
  }

  // Load restaurants from database
  loadRestaurantsFromServer() {
    fetch('http://localhost:8080/api/restaurants')
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          restaurants: responseData.data,
        });
      });
  }

  // Delete restaurant
  deleteRestaurant(restaurant) {
    fetch('http://localhost:8080/api/restaurants/' + restaurant._id,
      { method: 'DELETE', })
      .then(
        res => this.loadRestaurantsFromServer()
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
        res => this.loadRestaurantsFromServer()
      )
      .catch(err => console.error(err))
  }

  render() {
    return (
      <div>
        <RestaurantForm createRestaurant={this.createRestaurant} />
        <RestaurantTable deleteRestaurant={this.deleteRestaurant} restaurants={this.state.restaurants} />
      </div>
    );
  }
}

class RestaurantTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var restaurants = this.props.restaurants.map(restaurant =>
      <Restaurant key={restaurant._id} restaurant={restaurant} deleteRestaurant={this.props.deleteRestaurant} />
    );

    return (
      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Id</th><th>Name</th><th>Cuisine</th><th> </th>
            </tr>
          </thead>
          <tbody>{restaurants}</tbody>
        </table>
      </div>);
  }
}

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
          <button className="btn btn-danger" onClick={this.deleteRestaurant}>Delete</button>
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
        <div className="panel-heading">Create restaurant</div>
        <div className="panel-body">
          <form className="form-inline">
            <div className="col-md-2">
              <input type="text" placeholder="Name" className="form-control" name="name" onChange={this.handleChange} />
            </div>
            <div className="col-md-2">
              <input type="text" placeholder="Cuisine" className="form-control" name="cuisine" onChange={this.handleChange} />
            </div>
            <div className="col-md-2">
              <button className="btn btn-success" onClick={this.handleSubmit}>Save</button>
            </div>
          </form>
        </div>
      </div>

    );
  }
}


export default App;
