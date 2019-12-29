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
    homework:  {},
    homeworkResults: []
  }

  componentDidMount = () => {
    const hwid = this.props.match.params.hwid;

    fetch("http://121.43.40.151:8080/homework/get?id="+hwid, {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      this.setState({homework: res});
    })

    fetch("http://121.43.40.151:8080/homeworkres/byhomework?homework_id="+hwid, {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      this.setState({homeworkResults: res});
    })
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
        render: score => <Rate disabled allowHalf value={score * 5 / 100} />
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Link to={"/home/general/homework/"+this.props.match.params.hwid+"/"+record.databaseId}><Button type="primary">查看</Button></Link>
        </span>
      ),
    },
  ];

  flattenHomeworkResult = (homeworkResults) => {
    let res = [];
    for (let i in homeworkResults){
        let temp = homeworkResults[i];
        //console.log(temp)
        delete temp["annotationList"];
        temp = flatten(temp);
        //console.log(temp)
        res.push(temp);
    }
    //console.log(res)
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