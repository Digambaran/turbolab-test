import { Button, Col, DatePicker, Input, Row } from "antd";
import Layout, { Content, Footer, Header } from "antd/lib/layout/layout";
import moment, { Moment } from "moment";
import { RangeValue } from "rc-picker/lib/interface";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import "./App.css";
import DisplayNews from "./Components/DisplayNews";
import ListNews from "./Components/ListNews";
import { categoryObject } from "./Components/SearchForm/SearchForm";
import { SearchFormContainer } from "./Components/SearchFormContainer/SearchFormContainer";
export interface NewsObject {
  date: string;
  sentiment: "Positive"|"Negative"|"Neutral";
  title: string;
  content: string;
  url: string;
  id: string;
  parent_classification: string;
  child_classification: string;
  publication: string;
}
export type queryObject = {
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

  //Transform Data
  const categoriesSelectFn=(data:categoryObject[])=>{
    console.count('category select called-');
    return data.map((obj)=>({label:obj.category,value:obj.iptc_code}));
  }
  const sourcesSelectFn=({sources}:any)=>{
    console.count('source select called-');
    return sources.map((obj:any)=>({label:obj.name,value:obj.id}));
  }

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
    { staleTime: 12000 * 1000 }
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
    { staleTime: 12000 * 1000,select:categoriesSelectFn }
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
    { staleTime: 12000 * 1000,select:sourcesSelectFn }
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
    if(values===null){
      //if the user cleared the date range, remove date fields from query object
      setQuery((prevState)=>{
        const {start_date,end_date,...rest}=prevState;
        return rest
      })
    }else{
      const start_date = values?.[0];
      const end_date = values?.[1];
      setQuery((prevState) => ({
        ...prevState,
        start_date: start_date?.format(dateFormatString),
        end_date: end_date?.format(dateFormatString),
      }));
    }
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
     {/* <SearchForm
        show={visible}
        setShow={setVisible}
        sourcesQuery={sourcesQuery}
        categoriesQuery={categoriesQuery}
      /> */}
      <SearchFormContainer setQuery={setQuery} show={visible} setShow={setVisible} categoriesQuery={categoriesQuery} sourcesQuery={sourcesQuery} />
      <Layout>
        <Header style={{ background: "#ffffff" }}>
          <Row>
            <Col span={6}>
              <h1>News Reader</h1>
            </Col>
            <Col span={16} className="header_search">
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
        <Content className="content">
          <Row>
            <Col
              span={6}
              style={{
                borderRight: "1px solid rgba(0,0,0,0.06)",
                padding: "0 2rem",
                position:'relative'
              }}
            >
              <div style={{background:'#ffffff',marginTop:'4px'}}>

              <DatePicker.RangePicker
               ranges={{
                Today: [moment(), moment()],
                'Last 30 days':[moment().subtract(30,'days'),moment()],
                'Last 60 days':[moment().subtract(60,'days'),moment()]
              }}
              size="large"
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
                    </div>
              <ListNews
                data={isLoading ? [] : data.result.data}
                setSelectedNews={setSelectedNews}
                selectedId={selectedNews?.id}
              />
            </Col>
            <Col span={18} style={{ padding: "4rem 8rem" }}>
              <DisplayNews query={query} data={selectedNews} isLoading={isLoading} />
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
