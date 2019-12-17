import React from 'react'
import { Row, Col, Card, Icon, Avatar, Button} from 'antd'
import { Link } from 'react-router-dom'

import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'

const color = ['#87d068', '#fde3cf', '#eb2f96']
class HomeworkPage extends React.Component {
  state = {
    size: 'default',
    homeworks: [
      {
        'id': 0,
        'book': {
          'name':'cpp',
          'img': "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        },
        'title':'过程建模作业',
        'description': '过程建模作业',
        'requirement': '阅读课件进行批注',
        'deadline': '2019-12-28',
        'publishDate': '2019-11-28',
        'submitterName': '潘博'
      },
      {
        'id': 2,
        'book': {
          'name':'cpp',
          'img': "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        },
        'title':'软件项目管理作业',
        'description': '软件项目管理作业',
        'requirement': '阅读课件进行批注',
        'deadline': '2019-12-28',
        'publishDate': '2019-11-28',
        'submitterName': '姚博'
      },
      {
        'id': 3,
        'book': {
          'name':'cpp',
          'img': "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        },
        'title':'毕业设计',
        'description': '毕业设计',
        'requirement': '阅读毕业设计相关要求进行批注',
        'deadline': '2019-12-28',
        'publishDate': '2019-11-28',
        'submitterName': '姚博'
      }
    ]
  }

  jumpToHomeworkDetail = (hwid) => {

  }

  render() {
    const { homeworks } = this.state;
    return (
      <div>
        <CustomBreadcrumb arr={['基本','作业']}/>

    <Card title={
                <div>
                  <span style={{float:'left'}}>作业一览</span>
                  <span style={{float:'right'}}><Link to="/home/general/homework/create"><Button type="primary">发布作业</Button></Link></span>
                </div>
                }>
        <Row gutter={24}>
            {
              homeworks.map((value, key) => {
                console.log(value.description.length)
                const title = value.title.length > 10 ? value.title.substr(0, 10)+' ...' : value.title;
                const description = value.description.length > 10 ? value.description.substr(0, 10)+' ......' : value.description;
                return (
                  <Col span={5}>
                  <Card
                    className='card-item'
                    key={key}
                    style={{ width: 300 }} 
                    cover={<img alt={value.book.name} src={value.book.img} />}
                    actions={[
                      <Link to={"/home/general/homework/"+value.id}>
                        <Icon type="unordered-list" key="unordered-list"/>
                      </Link>,
                      <Icon type="edit" key="edit" />,
                      <Icon type="ellipsis" key="ellipsis" />,
                    ]}
                  >
                    <Card.Meta
                        avatar={<Avatar style={{ backgroundColor: color[key % color.length] }} icon="user"/>}
                        title={title}
                        description={description}
                      />
                  </Card>
                  </Col>
                )
              })
            }
            </Row>
        </Card>
      </div>
    )
  }
}

export default HomeworkPage