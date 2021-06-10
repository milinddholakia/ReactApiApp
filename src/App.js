import { render } from '@testing-library/react';
import { Component } from 'react';
import './App.css';
import axios from 'axios'

const api = axios.create({
  baseURL :`https://heroku-ether.herokuapp.com`
  // baseURL :`http://localhost:3001`
});

class App extends Component {
  componentWillMount() {
    this.loadContractData()
  }

  async loadContractData() {


    try {
      const ethers = require('ethers');
      let provider;
      window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum));
      const signer = provider.getSigner();

      var contractAddress = "0x4c96Ac9436E3b32a5E004B79eBa2f09853fc7D91";
      var contractAbi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "A", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "B", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "contestant", "type": "string" }], "name": "Vote", "outputs": [{ "internalType": "string", "name": "s", "type": "string" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "check", "outputs": [{ "internalType": "address", "name": "person", "type": "address" }, { "internalType": "string", "name": "voteGiven", "type": "string" }], "stateMutability": "view", "type": "function" }];
      const connectContract = new ethers.Contract(contractAddress, contractAbi, signer);
      console.log(connectContract);
      console.log(provider);
      this.setState({ connectContract })
      this.setState({ provider })
      // const valueA = await connectContract.A();
      api.get('/getCandidateA').then(res => {
        const valueA =  res.data;
        this.setState( {valueA} );
      });
      api.get('/getCandidateB').then(res => {
        const valueB =  res.data;
        this.setState( {valueB} );
      });

      // const valueB = await connectContract.B();

      // this.setState({ valueA: valueA.toString() })
      // this.setState({ valueB: valueB.toString() })
    } catch (error) {
      console.error(error)
      window.open("https://metamask.io/download", '_blank');

    }

  }
  constructor(props) {
    super(props)

    this.state = {
      connectContract:'' ,
      provider: '',
      valueA: 0,
      valueB: 0
    }
    this.Votevalidate =this.Votevalidate.bind(this)
  }
  async Votevalidate(props){
    try{
      const Val = await this.state.connectContract.Vote(props)
      alert(`Successfully voted {{props.text}}`)
      console.log(Val)

    }
    catch(err){
      alert('Already Voted')
    }
  }

  render() {
    return (
      <div className="App">
        Hello Welcome to our Voting Website .
        <p>There are two candidates
        <p>Following are the names ,You can vote directly by clicking on it.
        </p></p>
        <p>Whom would you like to vote?</p>
        <button id="voteCandidateA" onClick={()=>this.Votevalidate("A")}>Candidate A</button>
        <p>
          <button id="voteCandidateB" onClick={()=>this.Votevalidate("B")}>Candidate B</button>


        </p>
        <button id="result"> Real time Results</button>
        <p>
          Candidate A :{this.state.valueA}
          Candidate B :{this.state.valueB}
        </p>


      </div>
    );
  }
}

export default App;
