import { Badge, List, Typography } from "antd";
import moment from "moment";
import { Dispatch } from "react";
import { NewsObject } from "../../App";

export interface ListNewsProps {
  data: [NewsObject];
  setSelectedNews: Dispatch<NewsObject | null>;
  selectedId:string|undefined
}

export interface ListItemProps {
  item: NewsObject;
  setNews: Dispatch<NewsObject | null>;
  selectedId:string|undefined
}

const ListItem = ({ item, setNews,selectedId }: ListItemProps): JSX.Element => {
  const { Text, Paragraph, Title } = Typography;
  const d = moment(item.date);
  return (
    <List.Item>
      <Text type="secondary">{d.format("MMMM D,YYYY")}</Text>
      <Title
        onClick={() => {
          setNews(item);
        }}
        level={5}
        className={item.id===selectedId? "listnews listnews--selected":"listnews"}
      >
        {item.title}
      </Title>
      <Badge
        status={
          item.sentiment === "Positive"
            ? "success"
            : item.sentiment === "Negative"
            ? "error"
            : "default"
        }
        text={item.sentiment}
      />
    </List.Item>
  );
};

export const ListNews = ({
  data,
  setSelectedNews,
  selectedId
}: ListNewsProps): JSX.Element => {
  return (
    <List
      size="small"
      itemLayout="vertical"
      dataSource={data ? data : []}
      renderItem={(item: NewsObject) => (
        <ListItem setNews={setSelectedNews} item={item} selectedId={selectedId} />
      )}
    />
  );
};
