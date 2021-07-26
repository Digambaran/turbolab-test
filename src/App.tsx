import { Button, Col, DatePicker, Input, Row } from "antd";
import Layout, { Content, Footer, Header } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import "./App.css";
import DisplayNews from "./Components/DisplayNews";
import ListNews from "./Components/ListNews";
import moment, { Moment } from "moment";
// import type {RangeValue} from 'moment/src/lib/utils/interface'
import { RangeValue } from "rc-picker/lib/interface";
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
declare type queryObject = {
  start_date?: string;
  end_date?: string;
  sentiment?: string;
  /**
   * query string
   */
  q?: string;

  source_id?: string;
  category_id?: string;
};
const baseURL = "https://get.scrapehero.com/news-api/news/";
const KEY = "IHEwbeb7kN3f7I3Qizc1FqAJVexvcKUE";

function App() {
  const [query, setQuery] = useState<queryObject>({});
  const [selectedNews, setSelectedNews] = useState<null | NewsObject>(null);
  const { isLoading, error, data, status } = useQuery(
    ["allnews", query],
    async () => {
      const response = await fetch(
        serialize(query, baseURL),
        {
          mode: "cors",
        }
        // "https://get.scrapehero.com/news-api/news/?IHEwbeb7kN3f7I3Qizc1FqAJVexvcKUE"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    { staleTime: 120 * 1000 }
  );

  //get stored filters
  useEffect(() => {
    const recorveredFilter = localStorage.getItem("filters");
    const filters: queryObject | {} = recorveredFilter
      ? JSON.parse(recorveredFilter)
      : {};
    setQuery(filters);
  }, []);

  //handle daterange
  const dateFormatString = "YYYY-MM-DD";
  /**
   * Get the start and end date and set start_date and end_date fields in query object
   * @param values An array of moment objects
   */
  const onDateRangeChange = (values: RangeValue<Moment>): void => {
    const start_date = values?.[0];
    const end_date = values?.[1];
    setQuery((prevState) => ({
      ...prevState,
      start_date: start_date?.format(dateFormatString),
      end_date: end_date?.format(dateFormatString),
    }));
  };

  //set the first news to display
  useEffect(() => {
    status === "success" && setSelectedNews(data.result.data[0]);
  }, [status, data]);

  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(query));
  }, [query]);
console.log(query);

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
            <DatePicker.RangePicker
            //at the moment default values are not set FIX
              defaultValue={(query.start_date && query.end_date )?[
                moment(query.start_date, dateFormatString),
                moment(query.end_date, dateFormatString),
              ]:undefined}
              format={dateFormatString}
              onChange={onDateRangeChange}
            ></DatePicker.RangePicker>
            <ListNews
              data={isLoading ? [] : data.result.data}
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

const serialize = <T extends Record<string, string>>(
  obj: T,
  base: string
): string => {
  let str = base + "?x-api-key=IHEwbeb7kN3f7I3Qizc1FqAJVexvcKUE";

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const element = obj[key];
      if (str !== "") {
        str += "&";
      }
      str += key + "=" + encodeURIComponent(element);
    }
  }
  return str;
};
