import React from 'react'
import {Card, Tooltip, Icon, Form, Select, Input, Button, message, BackTop, DatePicker} from 'antd'
import CustomBreadcrumb from '../../../../components/CustomBreadcrumb/index'

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const dateToString = (date) => (date.toLocaleDateString([],{year:"numeric", month:"2-digit", day:"2-digit"}).replace(/\//g,'-'));
const today = () => dateToString(new Date());

@Form.create()
class HomeworkCreate extends React.Component {
  state = {
    text: '获取验证码',
    disabled: false,
    books:[]
  }

  componentDidMount = () => {
    fetch("http://121.43.40.151:8080/book/getall", {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      this.setState({books: res});
    })
  }

  timer = 0
  countdown = (e) => {
    let time = 60
    this.setState({
      text: --time + 's',
      disabled: true
    })
    this.timer = setInterval(() => {
      if (time > 0) {
        this.setState({
          text: --time + 's',
          disabled: true
        })
      } else {
        this.setState({
          text: '获取验证码',
          disabled: false
        })
      }
    }, 1000)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        message.warning('请先填写正确的表单')
      } else {
        console.log(values);
        values["book"] = this.state.books[values.bookKey];
        values["submitterName"] = "潘博";
        fetch("http://121.43.40.151:8080/homework/add", {
          method: 'POST',
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        })
        .then(res => res.json())
        .then(res => message.success('提交成功'))
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const { getFieldDecorator} = this.props.form
    const { books } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 12,
          offset: 4,
        },
      },
    }

    return (
      <div>
        <CustomBreadcrumb arr={['基本','作业','新建作业']}/>
        <Card bordered={false} title='新建作业'>
          <Form layout='horizontal' style={{width: '70%', margin: '0 auto'}} onSubmit={this.handleSubmit}>
            <FormItem label={(
              <span>
                书籍&nbsp;
                <Tooltip title='请选择批注书籍'>
                  <Icon type='question-circle-o'/>
                </Tooltip>
              </span>
            )} {...formItemLayout} required>
              {
                getFieldDecorator('bookKey', {
                  rules: [
                    {
                      required: true,
                      message: '请选择批注书籍'
                    }
                  ]
                })(
                    <Select placeholder="请选择批注书籍">
                    {
                        books.map((value, key) => {
                            return (
                                <Option key={key} value={key}>{value.bookName}</Option>
                            )
                        })
                    }
                    
                    </Select>,
                )
              }
            </FormItem>
            <FormItem {...formItemLayout} label={(
              <span>
                作业标题&nbsp;
                <Tooltip title='请输入作业标题'>
                  <Icon type='question-circle-o'/>
                </Tooltip>
              </span>
            )} required>
              {
                getFieldDecorator('title', {
                  rules: []
                })(
                    <Input/>
                )
              }
            </FormItem>
            <FormItem {...formItemLayout} label={(<span>
                开始日期&nbsp;
                <Tooltip title='请选择开始日期'>
                  <Icon type='question-circle-o'/>
                </Tooltip>
              </span>
            )} required>
              {
                getFieldDecorator('publishDate', {
                  rules: []
                })(
                <DatePicker style={{width: '100%'}}/>
              )
              }
            </FormItem>
            <FormItem {...formItemLayout} label={(<span>
                截止日期&nbsp;
                <Tooltip title='请选择截止日期'>
                  <Icon type='question-circle-o'/>
                </Tooltip>
              </span>
            )} required>
              {
                getFieldDecorator('deadline', {
                  rules: []
                })(
                <DatePicker style={{width: '100%'}}/>
              )
              }
            </FormItem>
            <FormItem {...formItemLayout} label={(
              <span>
                作业描述&nbsp;
                <Tooltip title='请输入作业描述'>
                  <Icon type='question-circle-o'/>
                </Tooltip>
              </span>
            )}>
              {
                getFieldDecorator('description', {
                  rules: []
                })(
                    <Input/>
                )
              }
            </FormItem>
            <FormItem {...formItemLayout} label={(
              <span>
                作业需求&nbsp;
                <Tooltip title='请输入作业需求'>
                  <Icon type='question-circle-o'/>
                </Tooltip>
              </span>
            )}>
              {
                getFieldDecorator('requirement', {
                  rules: []
                })(
                  <TextArea rows={4}/>
                )
              }
            </FormItem>
            <FormItem style={{textAlign: 'center'}} {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">提交</Button>
            </FormItem>
          </Form>
        </Card>
        <BackTop visibilityHeight={200} style={{right: 50}}/>
      </div>
    )
  }
}

export default HomeworkCreate