# System Design

## System Architect

### Object Level

    - System(Application)
        |-- TimeRange
        |-- Topology
            |-- Config
                |-- definitions
            |-- DataSource
            |-- TopoData
                |-- node[]
                |-- connections[]
        |-- KPI
            |-- Config
            |-- DataSource
            |-- Chart
        |-- Alert
            |-- Reactor
            |-- DataSource
        |-- Table
            |-- DataSouce // 数据源
            |-- TableResult

### Obj JSON Definition

```json

Query: {
    index: "index-**", // ES index
    tsrange: this.globe.tsrange, // 全局的查询时间段约束条件
    filter: [], // 可以继承上层调用，自动引入DataSouce的条件过滤器
    QueryContext: “aaaa”, //ES 查询语句
}

DataSource: {
    Config: {
        Name: "数据源名称",
        Type: "类型", // B:业务, A:异常告警, MW:中间件, DB: 数据库, OS: 操作系统, NET: 网络
        Subtype: "数据源子类型", // 子类型可来自结果集指定字段 业务名称，
        //      Tux/WLS/TC/, MySQL/ORACLE/DB2/Informix,
        //      AIX/Linux, Switch/Router/npm
        timestamp: ts, // 和x轴关联的时间字段
        SelectFields: [{ // 查询选取的字段
            field: SrcIp,
            label: "中文名字"
        }]
        ResultFields: [{ // 结果选取的字段
            field: meta_field,
            label: "中文名字"
        }],

    }
    MetaDataFilter: [] // 数据源中的源数据过滤器 schema
    Query: // 继承的Query对象
        Result: {
            Query.rs // 通过
        }
}

KPI: {
    Config: {
        Name: "指标名称",
        Desc: "指标描述",
        Chart: {
            title: "图表标题",
            type: line,
            style: chart.style, //Chart Style
            x: {
                field: source.timestamp,
                label: "时间"
            },
            y: [{
                field: DstIp,
                label: "目标地址"
            }]
        }
    }
    DataSource: this.DataSouce, // 组装的Query对象
    Chart: { // 生成的Chart对象
        data: this.DataSouce.Result // 当前绑定DataSource的返回
    }
}

// 还需要完善
Topo: {
    src: 当前节点名,
    target: 目标节点名,
    level: 1, // 一级节点还是二级节点 1: 一级节点 2: 二级节点
    nodes: [], // 子节点,可嵌套
    metrics: {
        normal: 0, // 绿色
        warning: 0, // 黄色
        danger: 0 // 绿色
    } //拓扑图指标
}

// 还需要完善
Alert: {
<<<<<<< HEAD
    ts: 发生时间
    name: 告警名字，
    description: 告警描述，
    level: 告警层级，
    startts: 起始时间，
    endts: 结束时间，
    type: {
        simple,
        ml
    } // simple: 人工定义， ml:机器学习定义
    value: // 发生值
        lowerBound: // 低线
        upperBound: // 高线
        anomIndex: // 异常数据源
        residual: estimate: gesdTestResult(true | false)
    boundTestResult(true | false)
    severity
    alertExplain
=======
    ts:发生时间
    description:告警描述，
    level:告警层级，
    startts:起始时间，
    period:时间片长，
    type: {simple,ml，...}              // simple: 人工定义， ml:机器学习定义
    actualValue:                        // 实际值
    lowerBound:                         // 低线
    upperBound:                         // 高线
    anomIndex:                          // 异常指数
    residual:                           // 残差
    estimate:                           // 估算值
    gesdTestResult (true|false)         // ml GESD测试结果
    boundTestResult (true|false)        // ml 边界检测结果
    simpleAlert (true|false)            // simple 规则触发结果
    alertExplain                        // 告警释义
>>>>>>> 2ab2faabfbb5993f5e130a232a9f1c187875faab
}
```

## Logical relationship

## Operation