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
                allowDraggingOfNodes: true,
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
            styles: {
                colorBackgroundDark: 'red'
            },
            definitions: {
                detailedNode: {
                    volume: {
                        default: {
                            top: {
                                header: '指标/总指标',
                            },
                            bottom: {
                                header: '错误率'
                            },
                            donut: {
                                data: 'data.globalClassPercents'
                            },
                            arc: {
                                data: 'metadata.data'
                            }
                        },
                        entry: {
                            top: {
                                header: '总指标数'
                            }
                        }
                    }
                }
            },
            trafficData: {
                renderer: 'global',
                name: 'root',
                nodes: [{
                    name: 'A'
                }, {
                    name: 'B',
                    renderer: 'region',
                    maxVolume: 5000,
                    nodes: [{
                        name: 'BA'
                    }, {
                        name: 'BB'
                    }],
                    connections: [{
                        source: 'BA',
                        target: 'BB'
                    }],
                    metadata: {
                        data:  {
                            values: [ // Array of values
                                { name: 'foo', value: 30 }, // Values have a value, name, and an optional overriding class. If class is not present, uses name as class name.
                                { name: 'bar', value: 70, class: 'barclass' }
                            ],
                            total: 100, // The total value to equal 100% of the arc graph
                            line: 0.9 // [optional] What percent, in decimal form, to put the optional marking line.
                        }
                    }
                }, {
                    name: 'C',
                    renderer: 'region',
                    class: 'warning',
                    maxVolume: 5000,
                    nodes: [{
                        name: 'CA',
                        renderer: 'focusedChild',
                        class: 'warning'
                    }, {
                        name: 'CB',
                        renderer: 'focusedChild',
                        class: 'warning'
                    }],
                    connections: [{
                        source: 'CA',
                        target: 'CB'
                    }]
                }, {
                    name: 'D',
                    renderer: 'region',
                    class: 'danger'
                }],
                connections: [{
                    source: 'A',
                    target: 'B',
                    metrics: {
                        normal: 100,
                        danger: 10
                    }
                }, {
                    source: 'A',
                    target: 'C',
                    metrics: {
                        normal: 300,
                        danger: 100
                    }
                }, {
                    source: 'A',
                    target: 'D',
                    metrics: {
                        normal: 300,
                        danger: 200
                    }
                }]
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
                definitions={this.state.definitions}
                styles={this.state.styles}
                allowDraggingOfNodes={this.state.displayOptions.allowDraggingOfNodes} 
            />
        );
    }
}

export default Topology;