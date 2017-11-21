import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Icon, Input, Select } from 'antd';

const Option = Select.Option;

// 深拷贝
function deepEqual(state) {
  return JSON.parse(JSON.stringify(state))
}

const METHODS_LIST = [
  { name: 'md5', type: false, params: [] },
  { name: 'lower', type: false, params: [] },
  { name: 'length', type: false, params: [] },
  { name: 'substr', type: true, component: "doubleInput", params: [] },
  { name: 'sha', type: true, component: "select", params: [] },
  { name: 'base64', type: false, params: [] },
  { name: 'unbase64', type: false, params: [] },
  { name: 'concat', type: true, component: "input", params: [] },
  { name: 'lconcat', type: true, component: "input", params: [] },
  { name: 'upper', type: false }
]


class MethodsList extends Component {
  static propTypes = {
    show: PropTypes.bool,
    click: PropTypes.func,
    clickValue: PropTypes.string,
    paramsInput: PropTypes.func,
    clickIndex: PropTypes.number
  }

  constructor(props) {
    super(props)
    this.state = {
      list: METHODS_LIST,
      moreFlag: true
    }
  }

  showMore = () => {
    this.setState({
      moreFlag: false
    })
  }

  // unshowMore = () => {
  //   this.setState({
  //     list: METHODS_LIST.slice(0, 4),
  //     moreFlag: true
  //   })
  // }

  inputComponent = (props) => {
    let clickIndex = props.clickIndex;
    let paramsIndex = props.paramsIndex;
    return <Input
      size="small"
      placeholder="请输入参数"
      onChange={(e) => this.handleParamsChange(e.target.value, clickIndex, paramsIndex, 0)}
    />
  }

  doubleInputComponent = (props) => {
    let clickIndex = props.clickIndex;
    let paramsIndex = props.paramsIndex;
    return <div>
      <Input
        size="small"
        placeholder="start"
        onChange={(e) => this.handleParamsChange(e.target.value, clickIndex, paramsIndex, 0)}
      />
      <Input
        size="small"
        placeholder="length"
        onChange={(e) => this.handleParamsChange(e.target.value, clickIndex, paramsIndex, 1)}
      />
    </div>

  }

  selectComponent = (props) => {
    const subname = ['sha1', 'sha224', 'sha256', 'sha384', 'sha512'];
    let clickIndex = props.clickIndex;
    let paramsIndex = props.paramsIndex;
    return <Select placeholder="请选择" style={{ width: 150 }} size="small" onChange={(e) => this.handleParamsChange(e, clickIndex, paramsIndex, 0)}>
      {
        subname.map((item, index) => {
          return <Option value={item} key={index}>{item}</Option>
        })
      }
    </Select>
  }

  // 处理参数输入
  handleParamsChange(value, clickIndex, paramsIndex, index) {
    let newList = deepEqual(this.state.list);
    newList[paramsIndex].params[index] = value;
    this.setState({
      list: newList
    })
    this.props.paramsInput(value, clickIndex, index);
  }


  // 组件选择
  handleComponent(item, clickIndex, index) {
    let query = {
      clickIndex: clickIndex,
      paramsIndex: index
    }
    switch (item.component) {
      case 'select':
        return this.selectComponent(query);
      case 'input':
        return this.inputComponent(query);
      case 'doubleInput':
        return this.doubleInputComponent(query);
      default:
        break;
    }
  }


  render() {
    const { list, moreFlag } = this.state;
    const { click, clickValue, clickIndex } = this.props;
    // console.log('click', clickValue);
    // console.log('list', this.state.list);
    let showList = moreFlag ? list.slice(0, 4) : list;
    return (
      <div className="modal-postman-form-method">
        <h3 className="methods-title title">方法</h3>
        {
          showList.map((item, index) => {
            return <Row
              key={index}
              type="flex"
              align="middle"
              className={'row methods-row ' + (item.name === clickValue ? 'checked' : '')}
              onClick={() => click(item.name, showList[index].params)}>
              <span>{item.name}</span>
              <span className="input-component">
                {item.type && this.handleComponent(item, clickIndex, index)}
              </span>
            </Row>
          })
        }
        {
          moreFlag && <div className="show-more" onClick={this.showMore}><Icon type="down" /><span style={{ paddingLeft: '4px' }}>更多</span></div>
        }
      </div>
    )
  }
}

export default MethodsList;