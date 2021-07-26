import { Skeleton, List } from "antd";
import React from "react";
import { NewsObject } from "../../App";

declare type DsiplayNewsProps ={
    data:NewsObject | null;
    isLoading:boolean;
}

export const DisplayNews = ({data,isLoading}:DsiplayNewsProps): JSX.Element => {

  return (
    <Skeleton title={false} loading={isLoading} active>
      <List.Item.Meta
        title={data?.title}
        description={data?.content}
      />
      <div>content</div>
    </Skeleton>
  );
};
