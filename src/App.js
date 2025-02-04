import './App.css';
import React, { Component } from 'react';
import Navbar from './components/Navbar';
import News from './components/News';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingBar from "react-top-loading-bar";

export default class App extends Component {
  
  state = {
    progress: 0
  }
  setProgress = (progress) => {
    this.setState({ progress: progress })
  }
  
  render() {
    return (
      <div>
        <Router>
          <Navbar />
          <LoadingBar
        color="#f11946"
        progress={this.state.progress}
      />
          <Routes>
            <Route path="/" element={<News setProgress={this.setProgress} key="general" pageSize={5} country="us" category="general" />} />
            <Route path="/general" element={<News setProgress={this.setProgress} key="general" pageSize={5} country="us" category="general" />} />
            <Route path="/business" element={<News setProgress={this.setProgress} key="business" pageSize={5} country="us" category="business" />} />
            <Route path="/entertainment" element={<News setProgress={this.setProgress} key="entertainment" pageSize={5} country="us" category="entertainment" />} />
            <Route path="/health" element={<News setProgress={this.setProgress} key="health" pageSize={5} country="us" category="health" />} />
            <Route path="/science" element={<News setProgress={this.setProgress} key="science" pageSize={5} country="us" category="science" />} />
            <Route path="/sport" element={<News setProgress={this.setProgress} key="sport" pageSize={5} country="us" category="sport" />} />
            <Route path="/technology" element={<News setProgress={this.setProgress} key="technology" pageSize={5} country="us" category="technology" />} />
          </Routes>
        </Router>
      </div>
    );
  }
}
