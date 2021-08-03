import { Divider, Skeleton, Typography } from "antd";
import moment from "moment";
import React from "react";
import { NewsObject, queryObject } from "../../App";

declare type DsiplayNewsProps ={
    data:NewsObject | null;
    isLoading:boolean;
    query:queryObject
}

export const DisplayNews = ({data,isLoading,query}:DsiplayNewsProps): JSX.Element => {
  //@ts-ignore
  const d=moment(data?.date).format('MMMM D,YYYY');
  let sh=[];
  let s='';
  let sp:string[]|[]=data?.content.split(' ')||[];
  
  //to find and highlight the query word
  if(query.q){
    //@ts-ignore
    for (let i = 0; i < sp?.length||0; i++) {
      let element = sp[i];
      
      if(element.toLowerCase().indexOf(query.q.toLowerCase())!==-1) sh.push(<mark>{" "+element}</mark>)
      else{
        sh.push(" "+element)

      }
      
    }
  }else{
    sh.push(data?.content||"");
  }
  
  return (
    <Skeleton title={true} paragraph={{'rows':100}} loading={isLoading} active>
     <Typography.Title level={1}>{data?.title}</Typography.Title>
     <div style={{display:'flex',justifyContent:'space-between'}}>
       <span>{data?.publication}</span>
       <Typography.Paragraph type="secondary">{d}</Typography.Paragraph>
     </div>
     <Divider/>
    <p className='ant-typography'>{sh}</p>
    </Skeleton>
  );
};
