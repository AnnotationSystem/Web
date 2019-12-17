import React from 'react'
import { Button, Card, Table, Tag, Rate, Typography, Avatar} from 'antd'
import { Link } from 'react-router-dom'
import CustomBreadcrumb from '../../../../components/CustomBreadcrumb/index'
const { Text } = Typography;

const color = ['#87d068', '#fde3cf', '#eb2f96', '#cb3f96', '#fb3a95']

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

class HomeworkDetail extends React.Component {
  state = {
    size: 'default',
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
    homeworkResults: [
        {
            'id':0,
            'homeworkId':0,
            'authorName':'姚博',
            'annotationList': [],
            'evaluation':{
                'score': 50,
                'comment': '后端写的太慢了'
            },
            'state':'EVALUATED'
        },
        {
            'id':1,
            'homeworkId':0,
            'authorName':'潘博',
            'annotationList': [],
            'evaluation':{
                'score': 0,
                'comment': '无'
            },
            'state':'COMMITTED'
        }
    ]
  }

  columns = [
    {
      title: '学生姓名',
      dataIndex: 'authorName',
      key: 'authorName',
      render: text => 
      <span>
        <Avatar style={{ backgroundColor: color[Math.floor(Math.random() * 5)] }} icon="user"/>
        &nbsp;
        <a>{text}</a>
      </span>,
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
        render: score => <Rate disabled allowHalf value={score * 5 / 100} />
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Link to={"/home/general/homework/"+this.props.match.params.hwid+"/"+record.id}><Button type="primary">查看</Button></Link>
        </span>
      ),
    },
  ];

  flattenHomeworkResult = (homeworkResults) => {
    let res = [];
    for (let i in homeworkResults){
        let temp = homeworkResults[i];
        console.log(temp)
        delete temp["annotationList"];
        temp = flatten(temp);
        console.log(temp)
        res.push(temp);
    }
    console.log(res)
    return res;
  }

  render() {
    const hwid = this.props.match.params.hwid;
    const { homework, homeworkResults } = this.state;
    const title = 
    <div>
      <div>
        <span style={{float:'left'}}><Text>{"作业标题： "+homework.title}</Text></span>
        <span style={{float:'right'}}><Text>发布人： <a>{homework.submitterName}</a></Text></span>
      </div>
      <br/>
      <br/>
      <div>
        <Text>作业要求：</Text>
        <br/>
        <Text>{homework.requirement}</Text>
      </div>
    </div>
    return (
      <div>
        <CustomBreadcrumb arr={['基本','作业', homework.description]}/>

        <Card title={title}>
            <Table columns={this.columns} dataSource={this.flattenHomeworkResult(homeworkResults)} />
        </Card>
      </div>
    )
  }
}

export default HomeworkDetail