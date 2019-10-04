import React, {Component} from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn'
import Register from './components/Register/Register'
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import DemographicInfo from './components/DemographicInfo/DemographicInfo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
//import Logo from './components/Logo/Logo';

//настройките на бекграунда
const particlesOptions = {
  particles: {
    number: {
      value: 200,
      density: {
        enable:true,
        value_area: 600
      }
    },
    size: {
      value: 3
    }
  }
}

//началният стейт
const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  demographics: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState; //начален празен стейт за всяка сесия
  }

  //ъпдейтва юзър обекта с юзърът, който е регнат/логнат
  registerUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  //взима информацията от обекта, който ни връща отговора на заявката и връща координатите на лицето
  calculateFaceLocation = (data) => {
    const clarifaiFace = (data.outputs[0].data.regions[0].region_info.bounding_box);
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  // взима информацията от обекта, който ни връща отговора на заявката и връща години, пол, раса
  demographicInfo = (data) => {
    const demoInfo = (data.outputs[0].data.regions[0].data.face);
    return {
      age: demoInfo.age_appearance.concepts[0].name,
      gender: demoInfo.gender_appearance.concepts[0].name,
      race: demoInfo.multicultural_appearance.concepts[0].name
    }
  }

  // ъпдейтва стейтовете на рамката на лицето и демографската информация
  updateStates = (box,demographics) => {
    this.setState({
      box: box,
      demographics:demographics
  });
  }

  // хендлър за промяна в поле
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  // изпращаме рекуест с URL на снимката към Clarifai 
  onSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch('http://localhost:3000/imageurl', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            input: this.state.input,
          })
        })
        .then(response => response.json())
    .then(response => {
      if(response){
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: this.state.user.id,
          })
        })
        .then(response => response.json())
        .then(entries => {
          this.setState(Object.assign(this.state.user, { entries: entries }))
        })
        .catch(console.log)
      }
      this.updateStates(this.calculateFaceLocation(response),this.demographicInfo(response))})
    .catch(error => console.log(error));
  }

  //функция за навигация
  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState(initialState)
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({
      route: route
    })
  }

  render() {
    const {route, imageUrl, box, demographics, isSignedIn} = this.state;
    const {name, entries} = this.state.user;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { this.state.route === 'home' 
          ? <div> 
              <Rank name={name} entries={entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onSubmit}/>
              {/*<Logo />*/}
              <DemographicInfo demographics={demographics}/>
              <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div>
          : (
              route === 'signin'
              ? <SignIn onRouteChange={this.onRouteChange} registerUser = {this.registerUser}/>
              : <Register onRouteChange={this.onRouteChange} registerUser = {this.registerUser} />
            )
          }
      </div>
      );
    }
  }


export default App;
