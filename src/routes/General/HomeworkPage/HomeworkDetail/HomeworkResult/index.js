import React from 'react'
import {  Button, Card, Table, Input, Tag, Icon, Rate, Typography, Radio, message } from 'antd'
import { Link } from 'react-router-dom'
import CustomBreadcrumb from '../../../../../components/CustomBreadcrumb/index'
const { Text } = Typography;

const flatten = (data) => {
    var result = {};
    function recurse (cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
             for(var i=0, l=cur.length; i<l; i++)
                 recurse(cur[i], prop + "[" + i + "]");
            if (l == 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop+"."+p : p);
            }
            if (isEmpty && prop)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
}

class HomeworkResult extends React.Component {
  state = {
    homework:  {},
    homeworkResult: {"evaluation":{}},
  }

  componentDidMount = () => {
    const hwid = this.props.match.params.hwid;
    const hwrsid = this.props.match.params.hwrsid;
    fetch("http://121.43.40.151:8080/homework/get?id="+hwid, {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      this.setState({homework: res});
    })

    fetch("http://121.43.40.151:8080/homeworkres/get?id="+hwrsid, {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      let annotationList = res["annotationList"];
      for (let i in annotationList){
        annotationList[i]["key"] = Number(i);
      }
      this.setState({homeworkResult: res});
    })
  }

  onChange = (key, event) => {
    let { homeworkResult } = this.state;
    for ( let i in homeworkResult.annotationList){
      let annotation = homeworkResult.annotationList[i];
      if (annotation.key === key){
        annotation[event.target.name] = event.target.value; 
        break;
      }
    }
    this.setState({ homeworkResult });
  }

  evaluationOnChange = (key, event) => {
    let { homeworkResult } = this.state;
    let value;
    if (event.target.name === "score")
      value = Number(event.target.value);
    else
      value = event.target.value;
    for ( let i in homeworkResult.annotationList){
      let annotation = homeworkResult.annotationList[i];
      if (annotation.key === key){
        annotation.evaluation[event.target.name] = value; 
        break;
      }
    }
    this.setState({ homeworkResult });
  }

  handleEdit = (key, event) => {
    event.preventDefault();
    let { homeworkResult } = this.state;
    for ( let i in homeworkResult.annotationList){
      let annotation = homeworkResult.annotationList[i];
      if (annotation.key === key){
        annotation.edit = true;
        break;
      }
    }
    this.setState({ homeworkResult });
  }

  handleSubmit = (key, event) => {
    event.preventDefault();
    let { homeworkResult } = this.state;
    let resEvaluated = true;
    let sum = 0;
    let annotationList = homeworkResult.annotationList
    for ( let i in annotationList){
      let annotation = annotationList[i];
      if (annotation.key === key){
        annotation.state.type ="EVALUATED"; 
        annotation.edit = false;
      }

      if (annotation.state.type !== "EVALUATED"){
        resEvaluated = false;
      }
      sum += annotation.evaluation.score;
    }
    if (resEvaluated){
      homeworkResult.state = "EVALUATED";
      homeworkResult.evaluation.score = sum / Number(annotationList.length);
      homeworkResult.evaluation.comment = "已阅";
    }
    else{
      homeworkResult.evaluation.score = sum / Number(annotationList.length);
      homeworkResult.evaluation.comment = "无";
    }

    fetch("http://121.43.40.151:8080/homeworkres/evaluate", {
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(homeworkResult)
    })
    .then(res => res.json())
    .then(res => {
      this.setState({ homeworkResult })
      message.success('提交成功')
    })
    
  }

  columns = [
    {
      title: '文章原文',
      dataIndex: 'annotatedContent',
      key: 'annotatedContent',
    },
    {
      title: '批注',
      key: 'annotationText',
      dataIndex: 'annotationText',
    },
    {
      title: '状态',
      key: 'state.type',
      dataIndex: 'state.type',
      render: tag => {
            let color, tagText;
            if (tag === 'UNEVALUATED'){
                color = 'volcano';
                tagText = '未批改';
            }
            else if (tag === 'EVALUATED'){
                color = 'green';
                tagText = '已批改';
            }
            return (
                <span>
                    <Tag color={color} key={tag}>
                        {tagText}
                    </Tag>
                </span>
            )
        }
    },
    {
        title: '分数',
        dataIndex: 'evaluation.score',
        key: 'score',
        render: (text, record) => {
          if (record.edit)
            return (
              <Input type="number" name="score" defaultValue={text} onChange={(e) => this.evaluationOnChange(record.key, e)}/>
            )
          else 
            return (
              text
            )
        }
    },
    {
        title: '评语',
        dataIndex: 'evaluation.comment',
        key: 'comment',
        render: (text, record) => {
          if (record.edit)
            return (
              <Input type="text" name="comment" defaultValue={text} onChange={(e) => this.evaluationOnChange(record.key, e)}/>
            )
          else 
            return (
              text
            )
        }
    },
    {
       title: '优秀',
       dataIndex: 'excellent',
       key: 'excellent',
       render: (text, record) => {
          if (!record.edit){
            if (record.excellent)
              return <Icon type="smile" theme="twoTone" twoToneColor="#52c41a"/>
            else
              return <Icon type="meh"/> 
          }
          else
            return (
              <Radio.Group name="excellent" defaultValue={false} value={record.excellent} onChange={(e) => this.onChange(record.key, e)}>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            )
       }
    },
    {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          console.log(record)
          if (record.edit){
            return (
              <span>
              <Button shape="circle" type="primary" onClick={(e) => this.handleSubmit(record.key, e)}>
              <Icon type="check" />
              </Button>
              &nbsp;
              <Button shape="circle" type="danger">
              <Icon type="close" />
              </Button>
              </span>
            )
          }
          else 
            return (
              <Button shape="circle" type="default" onClick={(e) => this.handleEdit(record.key, e)}>
              <Icon type="edit" key="edit"/>
              </Button>
            )
        }
    },
  ];

  

  flattenList = (list) => {
    let res = [];
    for (let i in list){
        let temp = list[i];
        temp = flatten(temp);
        res.push(temp);
    }
    return res;
  }

  render() {
    const hwid = this.props.match.params.hwid;
    const hwrsid = this.props.match.params.hwrsid;

    const { homework, homeworkResult } = this.state;
    const evaluation = homeworkResult.evaluation;
    const score = homeworkResult.evaluation.score;
    
    
    let title = 
    <div>
      <div>
        <span style={{float:'left'}}><Text>{"作业标题： "+homework.title}</Text></span>
        <span style={{float:'right'}}><Text>发布人： <a>{homework.submitterName}</a></Text></span>
      </div>
      <br/>
      <br/>
      <div>
        <span style={{float:'left'}}>
        <Text>作业要求：</Text>
        <br/>
        <Text>{homework.requirement}</Text>
        </span>
        <span style={{float:'right'}}><Rate disabled allowHalf value={score * 5 / 100} /></span>

      </div>
    </div>
    
    return (
      <div>
        <CustomBreadcrumb arr={['基本','作业', homework.description, homeworkResult.authorName]}/>

        <Card title={title}>
            <Table columns={this.columns} dataSource={this.flattenList(homeworkResult.annotationList)} />
        </Card>
      </div>
    )
  }
}

export default HomeworkResult