# System Design

## System Object

### Object Level

    - System(Application)
        |-- TimeRange
        |-- Topology
            |-- Config
            |-- Topo
                |-- node[]
                |-- connections[]
        |-- KPI
            |-- Query
            |-- Chart
        |-- Alert
            |-- Reactor
            |-- Query
        |-- Table
            |-- DataSouce
            |-- TableResult
        |-- DataSouce
            |-- Config
            |-- Query
            |-- Result
    - Query
        |-- TimeRange
        |-- Index
        |-- Filter
        |-- QueryText
    - 


## Logical relationship

## Operation