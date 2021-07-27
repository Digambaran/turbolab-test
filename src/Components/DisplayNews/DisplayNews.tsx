import { Divider, Skeleton, Typography} from "antd";
import React from "react";
import { NewsObject, queryObject } from "../../App";
import moment from "moment";

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
  console.log(sp,'element');
  
  if(query.q){
    //@ts-ignore
    for (let i = 0; i < sp?.length||0; i++) {
      let element = sp[i];
      // console.log('element',element);
      
      if(element.toLocaleLowerCase()===query.q.toLocaleLowerCase()) sh.push(<mark>{" "+element}</mark>)
      else{
        sh.push(" "+element)

      }
      
    }
  }else{
    sh.push(data?.content||"");
  }
  // console.log(sh);
  
  return (
    <Skeleton title={true} paragraph={{'rows':100}} loading={isLoading} active>
     <Typography.Title level={1}>{data?.title}</Typography.Title>
     <div style={{display:'flex',justifyContent:'space-between'}}>
       <span>{data?.publication}</span>
       <Typography.Paragraph type="secondary">{d}</Typography.Paragraph>
     </div>
     <Divider/>
    <p className='antd-typography'>{sh}</p>
    </Skeleton>
  );
};
