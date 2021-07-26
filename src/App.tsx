import {
  Button,
  Col,
  DatePicker, Input, Row
} from "antd";
import Layout, { Content, Footer, Header } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import "./App.css";
import DisplayNews from "./Components/DisplayNews";
import ListNews from "./Components/ListNews";
import moment from "moment";
export interface NewsObject {
  date: String;
  sentiment: String;
  title: String;
  content: String;
  url: String;
  id: String;
  parent_classification: String;
  child_classification: String;
  publication: String;
}

const KEY = "IHEwbeb7kN3f7I3Qizc1FqAJVexvcKUE";
var x =
  "https://get.scrapehero.com/news-api/news/?q=Iphone&sentiment=Positive&start_date=2020-12-01&end_date=2020-12-03&source_id=277%2C4171&category_id=13010000%2C04018000&x-api-key=IHEwbeb7kN3f7I3Qizc1FqAJVexvcKUE";
function App() {
  const [selectedNews, setSelectedNews] = useState<null | NewsObject>(null);
  const { isLoading, error, data, status } = useQuery(
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

  console.log(data);

  //set the first news to display
  useEffect(() => {
    status === "success" && setSelectedNews(data.result.data[0]);
  }, [status, data]);

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
            <ListNews
              data={isLoading?[]:data.result.data}
              setSelectedNews={setSelectedNews}
            />
          </Col>
          <Col span={18}>
            <DisplayNews data={selectedNews} isLoading={isLoading} />
          </Col>
        </Row>
      </Content>
      <Footer>footer here</Footer>
    </Layout>
  );
}

// serialize({q})
export default App;

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
