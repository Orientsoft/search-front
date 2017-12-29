import React from 'react';
import Vizceral from '../libs/Vizceral';
import BaseComponent from './BaseComponent';

class Topology extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentView: undefined,
            redirectedFrom: undefined,
            selectedChart: undefined,
            displayOptions: {
                allowDraggingOfNodes: false,
                showLabels: true
            },
            currentGraph_physicsOptions: {
                isEnabled: true,
                viscousDragCoefficient: 0.2,
                hooksSprings: {
                    restLength: 50,
                    springConstant: 0.2,
                    dampingConstant: 0.1
                },
                particles: {
                    mass: 1
                }
            },
            labelDimensions: {},
            searchTerm: '',
            matches: {
                total: -1,
                visible: -1
            },
            trafficData: {
                "renderer": "global",
                "name": "edge",
                "nodes": [
                  {
                    "renderer": "region",
                    "name": "INTERNET",
                    "class": "normal"
                  },
                  {
                    "renderer": "region",
                    "name": "核心系统",
                    "maxVolume": 50000,
                    "class": "normal",
                    "updated": 1466838546805,
                    "nodes": [
                      {
                        "name": "INTERNET",
                        "renderer": "focusedChild",
                        "class": "normal"
                      },
                      {
                        "name": "proxy-prod",
                        "renderer": "focusedChild",
                        "class": "normal"
                      }
                    ],
                    "connections": [
                      {
                        "source": "INTERNET",
                        "target": "proxy-prod",
                        "metrics": {
                          "danger": 116.524,
                          "normal": 15598.906
                        },
                        "class": "normal"
                      }
                    ]
                  }
                ],
                "connections": [
                  {
                    "source": "INTERNET",
                    "target": "核心系统",
                    "metrics": {
                      "normal": 26037.626,
                      "danger": 1192.37
                    },
                    "notices": [
                    ],
                    "class": "normal"
                  }
                ]
              },
            regionUpdateStatus: [],
            timeOffset: 0,
            modes: {
                detailedNode: 'volume'
            }
        };
    }
    
    objectHighlightedFunc = (highlightedObject) => {
        // need to set objectToHighlight for diffing on the react component. since it was already highlighted here, it will be a noop
        this.setState({ highlightedObject: highlightedObject, objectToHighlight: highlightedObject ? highlightedObject.getName() : undefined, searchTerm: '', matches: { total: -1, visible: -1 }, redirectedFrom: undefined });
    }

    render() {
        return (
            <Vizceral
                traffic={this.state.trafficData}
                view={this.state.currentView}
                showLabels={this.state.displayOptions.showLabels}
                filters={this.state.filters}
                viewChanged={this.viewChanged}
                viewUpdated={this.viewUpdated}
                objectHighlighted={this.objectHighlighted}
                nodeContextSizeChanged={this.nodeContextSizeChanged}
                objectToHighlight={this.state.objectToHighlight}
                matchesFound={this.matchesFound}
                match={this.state.searchTerm}
                modes={this.state.modes}
                allowDraggingOfNodes={this.state.displayOptions.allowDraggingOfNodes} 
            />
        );
    }
}

export default Topology;