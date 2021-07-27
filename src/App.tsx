import { Button, Col, DatePicker, Input, Modal, Row } from "antd";
import Layout, { Content, Footer, Header } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import "./App.css";
import DisplayNews from "./Components/DisplayNews";
import ListNews from "./Components/ListNews";
import moment, { Moment } from "moment";
import { RangeValue } from "rc-picker/lib/interface";
import SearchForm from "./Components/SearchForm/";
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
const categoryBaseURL = "https://get.scrapehero.com/news-api/categories/";
const sourcesBaseURL = "https://get.scrapehero.com/news-api/sources/";

function App() {
  const categoryQueryString = serialize({}, categoryBaseURL);
  const sourcesQueryString = serialize({}, sourcesBaseURL);
  const dateFormatString = "YYYY-MM-DD";

  //STATES
  const [visible, setVisible] = useState<boolean>(false);
  const [query, setQuery] = useState<queryObject>(() => {
    const recorveredFilter = localStorage.getItem("filters");
    const filters: queryObject | {} = recorveredFilter
      ? JSON.parse(recorveredFilter)
      : {};
    return filters;
  });
  const [selectedNews, setSelectedNews] = useState<null | NewsObject>(null);

  //QUERIES
  const { isLoading, error, data, status } = useQuery(
    ["allnews", query],
    async () => {
      const response = await fetch(serialize(query, baseURL));
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    { staleTime: 120 * 1000 }
  );
  const categoriesQuery = useQuery(
    "categories",
    async () => {
      const response = await fetch(categoryQueryString);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    { staleTime: 120 * 1000 }
  );
  const sourcesQuery = useQuery(
    "sources",
    async () => {
      const response = await fetch(sourcesQueryString);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    { staleTime: 120 * 1000 }
  );

  /**
   * Get the search term and set it to query object, if the user has cleared the field then value is an empty string.
   * so remove q field from query object
   * @param value Search term
   */
  const handleSearch = (value: string): void => {
    console.log("search term", value === "");
    if (value === "") {
      //when user clears search term, remove it from query object
      setQuery((prevState) => {
        const { q, ...newState } = prevState;
        return newState;
      });
    } else {
      setQuery((prevState) => ({ ...prevState, q: value }));
    }
  };
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

  //write query to localstorage on query change
  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(query));
  }, [query]);

  return (
    <>
      <SearchForm
        show={visible}
        setShow={setVisible}
        sourcesQuery={sourcesQuery}
        categoriesQuery={categoriesQuery}
      />
      <Layout>
        <Header style={{ background: "#ffffff" }}>
          <Row>
            <Col span={6}>
              <h1>News Reader</h1>
            </Col>
            <Col span={16}>
              <Input.Search
                defaultValue={query.q || undefined}
                className="ant-col ant-col-10"
                allowClear
                type="search"
                onSearch={handleSearch}
              ></Input.Search>
              <Button onClick={() => setVisible(true)}>Advanced search</Button>
            </Col>
          </Row>
        </Header>
        <Content>
          <Row>
            <Col span={6} style={{ borderRight: "1px solid rgba(0,0,0,0.06)" }}>
              <DatePicker.RangePicker
                //at the moment default values are not set FIX
                defaultValue={
                  query.start_date && query.end_date
                    ? [
                        moment(query.start_date, dateFormatString),
                        moment(query.end_date, dateFormatString),
                      ]
                    : undefined
                }
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
    </>
  );
}

export default App;

const serialize = <T extends Record<string, string>>(
  obj: T,
  base: string
): string => {
  let str = base + `?x-api-key=${process.env.REACT_APP_API_KEY}`;

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
