import React from 'react'
import {Card, Tooltip, Icon, Form, Select, Input, Button, message, BackTop} from 'antd'
import CustomBreadcrumb from '../../../../components/CustomBreadcrumb/index'

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@Form.create()
class HomeworkCreate extends React.Component {
  state = {
    text: '获取验证码',
    disabled: false,
    books:[
        {
        name: '高等数学',
        id: '0',
      },
      {
        name: '线性代数',
        id: '1',
      },
      {
        name: '软件工程导论',
        id: '2',
      }]
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
        message.success('提交成功')
        console.log(values)
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
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

    const submitDisabled = !(getFieldValue('title') && getFieldValue('bookid'));
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
                getFieldDecorator('bookid', {
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
                                <Option value={value.id}>{value.name}</Option>
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
              <Button type="primary" htmlType="submit" disabled={submitDisabled}>提交</Button>
            </FormItem>
          </Form>
        </Card>
        <BackTop visibilityHeight={200} style={{right: 50}}/>
      </div>
    )
  }
}

export default HomeworkCreate