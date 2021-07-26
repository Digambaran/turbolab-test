import {
  Button,
  Col,
  DatePicker,
  Divider,
  Input,
  List,
  Row, Typography
} from "antd";
import Layout, { Content, Footer, Header } from "antd/lib/layout/layout";
import React, { useState } from "react";
import { useQuery } from "react-query";
import "./App.css";
declare type ListItemProp = {
  date: String;
  sentiment: String;
  title: String;
  content: String;
  url: String;
  id: String;
  parent_classification: String;
  child_classification: String;
  publication: String;
};

const KEY = "IHEwbeb7kN3f7I3Qizc1FqAJVexvcKUE";
var x =
  "https://get.scrapehero.com/news-api/news/?q=Iphone&sentiment=Positive&start_date=2020-12-01&end_date=2020-12-03&source_id=277%2C4171&category_id=13010000%2C04018000&x-api-key=IHEwbeb7kN3f7I3Qizc1FqAJVexvcKUE";
function App() {
  const [selectedNews, setSelectedNews] = useState<null | ListItemProp>(null);
  const { isLoading, error, data } = useQuery(
    "allnews",
    async () => {
      const response = await fetch(
        "https://get.scrapehero.com/news-api/news/?x-api-key=IHEwbeb7kN3f7I3Qizc1FqAJVexvcKUE"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    { staleTime: 120 * 1000 }
  );

  return (
    <Layout>
      <Header style={{ background: "#ffffff" }}>
        <Row>
          <Col span={8}>
            <h1>News Reader</h1>
          </Col>
          <Col>
            <Input className="ant-col-12" type="search"></Input>
            <Button>Advanced search</Button>
          </Col>
        </Row>
      </Header>
      <Content>
        <Row>
          <Col span={6} style={{ borderRight: "1px solid rgba(0,0,0,0.06)" }}>
            <DatePicker.RangePicker></DatePicker.RangePicker>
            <List
              size="small"
              itemLayout="vertical"
              dataSource={data ? data.result.data : []}
              renderItem={(item: ListItemProp) => (
                <ListItem setNews={setSelectedNews} item={item} />
              )}
            />
          </Col>
          <Col span={18}>
            {/* <Skeleton title={false} loading={isLoading} active>
              <List.Item.Meta
              
                title={Heading}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
              <div>content</div>
            </Skeleton> */}
            <div>
              <h1 style={{ textAlign: "center" }}>
                {selectedNews ? selectedNews.title : "som"}
              </h1>
            </div>
            {selectedNews ? <p>{selectedNews.content}</p> : <p>nothing</p>}
          </Col>
        </Row>
      </Content>
      <Footer>footer here</Footer>
    </Layout>
  );
}

// serialize({q})
export default App;

const ListItem = (props: { item: any; setNews: any }): JSX.Element => {
  // console.log(props, props.item);

  const { Text, Paragraph, Title } = Typography;
  return (
    <List.Item>
      <Text type="secondary">Her is date</Text>
      <Title
        onClick={() => {
          props.setNews(props.item);
        }}
        level={3}
        style={{ marginTop: ".1rem", cursor: "pointer" }}
      >
        {props.item.title}
      </Title>
      <Paragraph>dsf</Paragraph>
      <Divider style={{ margin: ".1rem 0" }} />
    </List.Item>
  );
};

declare type queryObject = {
  start_date: String;
  end_date: String;
  sentiment: String;
  /**
   * query string
   */
  q: String;
  source_id: String;
  category_id: String;
};
const serialize = (obj: queryObject): String => {
  let str = "";
  for (let key in obj) {
    if (str !== "") {
      str += "&";
    }
    // str += key + "=" + encodeURIComponent(obj[key]);
  }
  return str;
};
