import React, { Component } from 'react';
import { load } from './Spreadsheet';
import './App.css';
import config from "./config";
import Circle from "./Circle";
import Spinner from './Spinner';
import Draggable from "./Draggable";


class App extends Component {
  state = {
    data: [],
    highlightToggle: false,
    selection: [],
    error: null,
    editMode: false,
    circleCoordinates: {
      'Canvas Integration': [42, -45],
      'LabStation Localisation': [530, 450],
      'GDPR Compliance': [490, 80],
      'Scope Anatomy Features': [680, 950],
      'Open-source Adoption Criteria': [495, -90],
      'Elephant Microservices': [525, 830],
      'Database Performance': [260, -20],
      'PDF Generation Issues': [650, 670],
      'LabStation Launch (BR, FR, DE)': [620, 225],
      'Mapping Distributor Flows': [660, -30],
      'Anatomy Content MVP': [10, 1000],
      'Biology Product Plan': [10, 650],
      'SCRUM Content Process': [120, 800],
      'Content Translation (BR, FR, DE)': [110, 465],
      'Emerging Markets Plan': [10, 200],
      'Lt Business Model': [60, 1290],
      'Product Group Metrics': [350, 1380],
      'Customer Focus Feedback': [530, 1260],
      'Migrate Support Site': [530, 1060],
      'Lt Branding': [680, 1160],
      'Mobile Device Usage Report': [520, 690],
    },
  };

  toggleEditMode = () => {
    this.setState({ editMode: !this.state.editMode });
  };
  focusCircle = (e, row) => {
    if(e.shiftKey) {
      this.setState({ selection: [...this.state.selection, row['Poster Titles']] });
    } else {
      this.state.highlightToggle ?
        this.setState({highlightToggle: false, selection: []})
        :
        this.setState({highlightToggle: true, selection: [...this.state.selection, row['Poster Titles']]});
    }
  };
  initClient = () => {
    window.gapi.client.init({
      apiKey: config.apiKey,
      discoveryDocs: config.discoveryDocs
    }).then(() => {
      load(this.onLoad);
    });
  };
  onLoad = (spreadsheet, error) => {
    if (spreadsheet) {
      const data = spreadsheet.data;
      this.setState({ data });
    } else {
      this.setState({ error });
    }
  };
  componentDidMount() {
    window.gapi.load("client", this.initClient);
  }
  saveCircleCoordinates = (id, x, y) => {
    // console.log('start', this.state.circleCoordinates[id][1], this.state.circleCoordinates[id][0]);
    // console.log('translate', x, y);
    // console.log('end', this.state.circleCoordinates[id][1] + x, this.state.circleCoordinates[id][0] + y);
    const updatedX = this.state.circleCoordinates[id][1] + x;
    const updatedY = this.state.circleCoordinates[id][0] + y;
    this.setState({
      circleCoordinates: Object.assign(this.state.circleCoordinates, {[id]: [updatedY, updatedX]}),
    }, () => {
      // TODO: update coordinates in persistent storage here
    });
  };
  deselectAll = () => this.state.highlightToggle && this.setState({ highlightToggle: false, selection: [] });
  render() {
    const { data, error, editMode } = this.state;
    if (error) {
      console.log(this.state.error);
      return <div className="App">An error occurred.</div>
    }
    if(data.length === 0) {
      return <div className="App"><div className='loading'><Spinner /></div></div>
    }
    const editModeButtonStyle =  {
      backgroundColor: this.state.editMode ? '#36F400' : 'transparent',
      color: this.state.editMode ? 'white' : 'transparent',
    };
    return (
      <div className="App" onClick={this.deselectAll}>
        <span className='editModeButton'
              style={editModeButtonStyle}
              onClick={this.toggleEditMode}>
          &#9998;
        </span>
        { this.state.highlightToggle ? <div style={this.state.selection} className="highlight"></div> : null}
        <div className="Circles">
          <img className="Rings" src="/rings.png" />
          <img className="Background" src="/background.png" />
          {data.map((row, i) => {
            if(editMode){
              return (
                <Draggable positionStyle={stylePosition(this.state.circleCoordinates[row['Poster Titles']])}
                           onDragEnd={this.saveCircleCoordinates}
                           id={row['Poster Titles']}
                           key={i}>
                  <Circle circleText={row['Poster Titles']}
                          effortPoints={row['Est. Effort']}
                          owner={row['R']}
                          sheetIndex={row['sheetIndex']}
                          progressPercent={(row['%'] * 100)}
                          currentSprintProgressPercent={(row['Current Sprint'] ? row['Current Sprint'] * 100 : 0)}
                          selected={this.state.selection.includes(row['Poster Titles'])}/>
                </Draggable>
              );
            }
            return (
              <div style={stylePosition(this.state.circleCoordinates[row['Poster Titles']])}
                   key={i}
                   onClick={(e) => this.focusCircle(e, row)}>
                <Circle circleText={row['Poster Titles']}
                        effortPoints={row['Est. Effort']}
                        owner={row['R']}
                        sheetIndex={row['sheetIndex']}
                        progressPercent={(row['%'] * 100)}
                        currentSprintProgressPercent={(row['Current Sprint'] ? row['Current Sprint'] * 100 : 0)}
                        selected={this.state.selection.includes(row['Poster Titles'])}/>
              </div>
            );
            })}
        </div>
      </div>
    );
  }
}

export default App;

// const stylePosition = (coord) => {
//   console.log("getting style..");
//   return { position: 'absolute', transform: `translate(${coord[1]}px, ${coord[0]}px)` };
// };

const stylePosition = (coord) => {
  return { position: 'absolute', top: coord[0]+'px', left: coord[1]+'px' };
};