import React from 'react';
import Vizceral from 'vizceral-react';
import 'vizceral-react/dist/vizceral.css';
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
                name: 'us-west-2',
                renderer: 'global',
                maxVolume: 500,
                nodes: [
                  {name: 'INTERNET'},
                  {name: 'service'}
                ],
                connections: [
                  {
                    source: 'INTERNET',
                    target: 'service',
                    metrics: { normal: 100, warning: 95, danger: 5 },
                    metadata: { streaming: true }
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