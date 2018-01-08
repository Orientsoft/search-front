import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import Vizceral from '../libs/Vizceral';
import Breadcrumb from './queries/Breadcrumb';
import BaseComponent from './BaseComponent';

const rootNode = {
    renderer: 'global',
    name: 'root',
    nodes: [],
    connections: []
};

class Topology extends BaseComponent {
    constructor(props) {
        super(props);
        this.initialBreadcrumb = [{
            name: '系统',
            props: {
                to: '#',
                onClick: () => this.setState({
                    currentView: ['root']
                })
            }
        }];
        this.state = {
            breadcrumb: this.initialBreadcrumb,
            currentView: ['root'],
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
            trafficData: rootNode,
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

    viewChanged(view) {
        if (view.view.length) {
            this.state.breadcrumb.push({
                name: [view.graph.name].concat(view.view[0]),
                props: {
                    to: '#',
                    onClick: () => this.setState({
                        currentView: view.view
                    })
                }
            });
            this.forceUpdate();
        }
        // } else {
        //     this.setState({
        //         breadcrumb: this.initialBreadcrumb
        //     });
        // }
    }

    componentWillMount() {
        this.elastic.getNodes().then(result => {
            const nodes = this.getHits(result).map(data => data._source);

            this.setState({
                trafficData: nodes.reduce((graph, node) => {
                    if (node.level === 1) {
                        const _node = {
                            name: node.src,
                            renderer: 'region',
                            maxVolume: 10000
                        };
                        if (node.nodes) {
                            _node.nodes = node.nodes.map(child => {
                                return {
                                    name: child.src,
                                    renderer: 'focusedChild'
                                };
                            });
                            _node.connections = node.nodes.map(child => {
                                return {
                                    source: child.target,
                                    target: child.src,
                                    metrics: child.metrics || {}
                                };
                            });
                        }
                        graph.nodes.push(_node);
                        graph.connections.push({
                            source: node.target,
                            target: node.src,
                            metrics: node.metrics || {}
                        });
                    }
                    return graph;
                }, cloneDeep(rootNode))
            });
        });
    }

    render() {
        const {
            breadcrumb,
            trafficData
        } = this.state;

        return (
            <div className="workspace">
                <Breadcrumb items={breadcrumb} />
                <div style={{height: '100vh'}}>
                    <Vizceral
                        traffic={trafficData}
                        view={this.state.currentView}
                        showLabels={this.state.displayOptions.showLabels}
                        filters={this.state.filters}
                        viewChanged={(view) => this.viewChanged(view)}
                        viewUpdated={this.viewUpdated}
                        objectHighlighted={this.objectHighlighted}
                        nodeContextSizeChanged={this.nodeContextSizeChanged}
                        objectToHighlight={this.state.objectToHighlight}
                        matchesFound={this.matchesFound}
                        match={this.state.searchTerm}
                        modes={this.state.modes}
                        definitions={this.state.definitions}
                        styles={this.state.styles}
                        allowDraggingOfNodes={this.state.displayOptions.allowDraggingOfNodes} />
                </div>
            </div>
        );
    }
}

export default Topology;