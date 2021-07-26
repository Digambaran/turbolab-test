import { Divider, List, Typography } from "antd";
import { Dispatch } from "react";
import { NewsObject } from "../../App";

export interface ListNewsProps {
    data:[NewsObject];
    setSelectedNews:Dispatch<NewsObject|null>;
}

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

export const ListNews = ({data,setSelectedNews}:ListNewsProps): JSX.Element => {
  return (
    <List
      size="small"
      itemLayout="vertical"
      dataSource={data ? data : []}
      renderItem={(item: NewsObject) => (
        <ListItem setNews={setSelectedNews} item={item} />
      )}
    />
  );
};
