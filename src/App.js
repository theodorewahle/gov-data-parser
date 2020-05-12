import React from 'react';
import './App.css';
import { Button, Container, Row, Col, Input} from 'reactstrap'
import axios from 'axios'

import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class If extends React.Component {
  render() {
    return (
      <div>
        {this.props.condition && (
          <div>
            {this.props.children}
          </div>
        )}
      </div>
    )
  }
}


class App extends React.Component {
  state = {
    link: '', data : [], spreadsheetReady: false
  }

  parseGovData = async (e) =>  {
    const link = e.target.value
    this.setState({ link })
    if (link) {

      const res = await axios.post('https://bsldv9oucj.execute-api.us-east-1.amazonaws.com/getPage', {
        link
       }, {'Content-Type' : 'application/json'})
       try {
        this.setState({
          spreadsheetReady: true, 
          data: Object.values(res.data),
        })
       }
       catch (e) {
        this.setState({
          spreadsheetReady: false
        })
       }
       
    }
    else {
      this.setState({ spreadsheetReady: false})
    }
    
  } 
  
  render() {
    
    return (
      <Container >
        <Col>
          <Row style={{ alignItems: 'center', justifyContent: 'center', marginTop: '4rem', marginBottom: '4rem'}}>
            <h1>Census.gov — Building Permit Data Parser</h1>
          </Row>
          <Row style={{ alignItems: 'center', justifyContent: 'center', marginTop: '4rem', marginBottom: '4rem'}}>
          <Col>
          <Row style={{ alignItems: 'center', justifyContent: 'center',}}>
          <Input value={this.state.link} onChange={this.parseGovData}/>
          </Row>
          <Row style={{ alignItems: 'center', justifyContent: 'center', marginTop: '1rem'}}>
          <p>The formatting for the <a href="https://www.census.gov/construction/bps/">Census.gov</a> building permit data SUCKS. Paste a link above, and we will give you a spreadheet.</p>
          </Row>
          <Row style={{ alignItems: 'center', justifyContent: 'center', marginTop: '2rem', marginBottom: '4rem'}}>

          <ExcelFile element={<If condition={this.state.spreadsheetReady}><Button color="success">Download</Button></If>}>
                <ExcelSheet data={this.state.data} name="Census.gov Data">
                    <ExcelColumn label="City Name" value="city_name"/>
                    <ExcelColumn label="Total" value="Total"/>
                    <ExcelColumn label="1 Unit" value="1 Unit"/>
                    <ExcelColumn label="2 Unit" value="2 Unit"/>
                    <ExcelColumn label={`3 & 4 Unit`} value={`3 & 4 Unit`}/>
                    <ExcelColumn label="5+ Unit" value="5+ Unit"/>
                    <ExcelColumn label="Monthly Coverage Percent" value="Monthly Coverage Percent"/>
                    <ExcelColumn label=" Number of Structure w/ 5+ Units" value="Number of Structure w/ 5+ Units"/>
                </ExcelSheet>
            </ExcelFile>
          </Row>
          </Col>
          </Row>
        </Col>
    </Container>
    );
  }

 


}

export default App;
