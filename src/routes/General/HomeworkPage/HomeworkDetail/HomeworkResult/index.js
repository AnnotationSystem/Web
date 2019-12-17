import React from 'react'
import {  Button, Card, Table, Input, Tag, Icon, Rate, Typography, Radio } from 'antd'
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
    homework:  {
        'id': 0,
        'book': {
          'name':'cpp',
          'img': "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        },
        'title': '过程建模作业',
        'description': '过程建模作业',
        'requirement': '阅读课件进行批注',
        'deadline': '2019-12-28',
        'publishDate': '2019-11-28',
        'submitterName': '潘博'
    },
    homeworkResult: {
      'id':0,
      'homeworkId':0,
      'authorName':'姚博',
      'evaluation':{
        'score': 0,
        'comment': '无'
      },
      'annotationList': [
          {
              "id": 0, 
              "annotatedRange":{},
              "annotatedContent": "我有一头小毛驴",
              "annotationText":"这句写的不错",
              "evaluation":{
                  "score":"0",
                  "comment":"这啥玩意儿"
              },
              "state":"COMMITTED",
              "excellent":false,
          },
          {
              "id": 1, 
              "annotatedRange":{},
              "annotatedContent": "我有两头小毛驴",
              "annotationText":"这句也写的不错",
              "evaluation":{
                  "score":"0",
                  "comment":"这啥玩意儿"
              },
              "state":"COMMITTED",
              "excellent":false
          }
      ],
      'state':'COMMITTED'
    }
  }

  onChange = (id, event) => {
    let { homeworkResult } = this.state;
    for ( let i in homeworkResult.annotationList){
      let annotation = homeworkResult.annotationList[i];
      if (annotation.id === id){
        annotation[event.target.name] = event.target.value; 
        break;
      }
    }
    this.setState({ homeworkResult });
  }

  evaluationOnChange = (id, event) => {
    let { homeworkResult } = this.state;
    let value;
    if (event.target.name === "score")
      value = Number(event.target.value);
    else
      value = event.target.value;
    for ( let i in homeworkResult.annotationList){
      let annotation = homeworkResult.annotationList[i];
      if (annotation.id === id){
        annotation.evaluation[event.target.name] = value; 
        break;
      }
    }
    this.setState({ homeworkResult });
  }

  handleEdit = (id, event) => {
    event.preventDefault();
    let { homeworkResult } = this.state;
    for ( let i in homeworkResult.annotationList){
      let annotation = homeworkResult.annotationList[i];
      if (annotation.id === id){
        annotation.edit = true;
        break;
      }
    }
    console.log(homeworkResult)
    this.setState({ homeworkResult });
  }

  handleSubmit = (id, event) => {
    event.preventDefault();
    let { homeworkResult } = this.state;
    let resEvaluated = true;
    let sum = 0;
    let annotationList = homeworkResult.annotationList
    for ( let i in annotationList){
      let annotation = annotationList[i];
      if (annotation.id === id){
        annotation.state = "EVALUATED"; 
        annotation.edit = false;
      }

      if (annotation.state != "EVALUATED"){
        resEvaluated = false;
      }
      sum += annotation.evaluation.score;
    }
    if (resEvaluated){
      homeworkResult.state = "EVALUATED"
      homeworkResult.evaluation.score = sum / Number(annotationList.length);
    }
    this.setState({ homeworkResult })
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
      key: 'state',
      dataIndex: 'state',
      render: tag => {
            let color, tagText;
            if (tag === 'COMMITTED'){
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
              <Input type="number" name="score" defaultValue={text} onChange={(e) => this.evaluationOnChange(record.id, e)}/>
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
              <Input type="text" name="comment" defaultValue={text} onChange={(e) => this.evaluationOnChange(record.id, e)}/>
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
              <Radio.Group name="excellent" defaultValue={false} value={record.excellent} onChange={(e) => this.onChange(record.id, e)}>
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
          if (record.edit){
            return (
              <span>
              <Button shape="circle" type="primary" onClick={(e) => this.handleSubmit(record.id, e)}>
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
              <Button shape="circle" type="default" onClick={(e) => this.handleEdit(record.id, e)}>
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
    const title = 
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
        <span style={{float:'right'}}><Rate disabled allowHalf value={homeworkResult.evaluation.score * 5 / 100} /></span>

      </div>
    </div>

    //console.log(homeworkResult.evaluation.score)
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