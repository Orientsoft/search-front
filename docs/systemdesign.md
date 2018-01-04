# System Design

## System Object

### Object Level

    - System(Application)
        |-- TimeRange
        |-- Topology
            |-- Config
                |-- definitions
            |-- Topo
                |-- node[]
                |-- connections[]
        |-- KPI
            |-- Type
            |-- Query
            |-- Chart
        |-- Alert
            |-- Reactor
            |-- Query
        |-- Table
            |-- DataSouce // 数据源
            |-- TableResult
        |-- DataSouce
            |-- Config
            |-- Query
            |-- Result

### Obj JSON

```js
KPI: {
    name: 指标名称,
    source: 数据源,
    fields: [                   // 列出数据源中配置的字段
        {
            field: SrcIp,       // 在数据源配置中选择的字段
            value: 192.168.0.1  // 搜索的值
        }
    ],
    chart: {
        title: 图表标题,
        type: line,
        x: {
            field: source.timestamp,
            label: 时间
        },
        y: {
            field: DstIp,
            label: 目标地址
        }
    }
}

DataSource: {
    name: 数据源名称,
    type: 业务类型,
    index: demo-*, // ES查询索引
    timestamp: @timestamp, //和x轴关联的时间字段
    fields: [{
       field: SrcIp,
       label: 中文名字
    }] //查询的字段
}

Topo: {
    src: 当前节点名,
    target: 目标节点名,
    level: 1,   // 一级节点还是二级节点 1: 一级节点 2: 二级节点
    nodes: [],  // 子节点,可嵌套
    metrics: {
        normal: 0,  // 绿色
        warning: 0, // 黄色
        danger: 0   // 绿色
    }           //拓扑图指标
}

Alert: {
    name：告警名字，
    startts：起始时间，
    endts：结束时间，
    level：告警层级
}
```

## Logical relationship

## Operation