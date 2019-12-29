import React from 'react'
import { Row, Col, Card, Icon, Avatar, Button, Tag} from 'antd'
import { Link } from 'react-router-dom'

import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'

const color = ['#87d068', '#fde3cf', '#eb2f96']
const img = ['https://img.gmz88.com/uploadimg/image/20190411/20190411142532_63955.jpg',
            'https://img.gmz88.com/uploadimg/image/20190411/20190411142532_88121.jpg',
            'https://img.gmz88.com/uploadimg/image/20190411/20190411142532_34565.jpg',
            'https://img.gmz88.com/uploadimg/image/20190411/20190411142532_87804.jpg']
class HomeworkPage extends React.Component {
  state = {
    size: 'default',
    homeworks: []
  }

  componentDidMount = () => {
    fetch("http://121.43.40.151:8080/homework/getall", {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      res.reverse();
      this.setState({homeworks: res});
    })
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
                value.title === null ? value.title = 'null' : value.title;
                value.description === null ? value.description = 'null' : value.description; 
                const publishDate = new Date(value.publishDate)
                const deadline = new Date(value.deadline)
                const today = new Date()
                const unopened = today.getTime() < publishDate.getTime()
                const expired = today.getTime() > deadline.getTime()
                
                let color, tagText;
                if (unopened){
                  color = 'geekblue';
                  tagText = '未开放';
                }
                else if (expired){
                    color = 'volcano';
                    tagText = '已结束';
                }
                else{
                    color = 'green';
                    tagText = '进行中';
                }
                let titleString = value.title.length > 10 ? value.title.substr(0, 10)+' ...' : value.title;
                let title = <div><span>{titleString}</span> <Tag color={color}>{tagText}</Tag></div>
                const description = value.description.length > 10 ? value.description.substr(0, 10)+' ......' : value.description;
                return (
                  <Col span={5}>
                  <Card
                    className='card-item'
                    key={key}
                    style={{ width: 300 }} 
                    cover={<img alt={"book"} src={img[key % img.length]} />}
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