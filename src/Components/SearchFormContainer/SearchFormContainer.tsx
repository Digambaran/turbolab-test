import { Modal, Spin } from "antd";
import React, { Dispatch, useEffect, useState } from "react";
import { QueryObserverResult } from "react-query";
import { queryObject } from "../../App";
import { SearchForm } from "../SearchForm/SearchForm";

interface FormFieldObject {
  key: string;
  options: string[] & numberIndex;
  values: string[] & numberIndex;
}
declare interface numberIndex {
  [index: number]: string;
}

interface FormState {
  filters: FormFieldObject[];
}
declare interface SearchFormContainerProps {
  show: boolean;
  setShow: Dispatch<React.SetStateAction<boolean>>;
  setQuery: Dispatch<React.SetStateAction<queryObject>>;
  categoriesQuery: QueryObserverResult;
  sourcesQuery: QueryObserverResult;
  query: queryObject;
}

const Filters = ["Category", "Source", "Sentiment"];
const sentimentsArray = [
  { label: "Negative", value: "Negative" },
  { label: "Positive", value: "Positive" },
  { label: "Neutral", value: "Neutral" },
];
export const SearchFormContainer: React.FC<SearchFormContainerProps> = ({
  show,
  setShow,
  categoriesQuery,
  sourcesQuery,
  setQuery,
  query,
}) => {
  console.count("SearchFormContainer rendered: ");

  const [availableFilters, setAvailableFilters] = useState<string[]>(Filters);
  const [initialValues, setInitialValues] = useState<FormState>({
    filters: [],
  });

  useEffect(() => {
    const filters = [];
    if (query.category_id) {
      filters.push({
        key: "Category",
        values: query.category_id,
        options: categoriesQuery.data,
      });
    }
    if (query.source_id) {
      filters.push({
        key: "Source",
        values: query.source_id,
        options: sourcesQuery.data,
      });
    }
    if (query.sentiment) {
      filters.push({
        key: "Sentiment",
        values: query.sentiment,
        options: sentimentsArray,
      });
    }

    //@ts-ignore
    setInitialValues({ filters: filters });
  }, [
    categoriesQuery.data,
    sourcesQuery.data,
    query.sentiment,
    query.source_id,
    query.category_id,
    show,
  ]);

  /**
   * On every change of filter and filter value, change the form state.
   * @param name Name of field that changed, filter[index].key or filter[index].values
   * @param value The changed value from the field, if options is changed then string array
   */
  const customActionsOnChange = (
    name: string,
    value: "Source" | "Sentiment" | "Category" | string[]
  ) => {

    const [index, ...rest1] = name.match(/\d/) || [];
    const isKey = name.split(".")[1] === "key";
  };

  const handleFormSubmit = (v: any) => {
    const q = v.filters.reduce((acc: queryObject, cur: any) => {
      if (cur.key === "Category") {
        //if user has removed all filters, remove field from acc
        acc["category_id"] = cur.values;
        if (cur.values.length === 0) delete acc["category_id"];
      }
      if (cur.key === "Source") {
        acc["source_id"] = cur.values;
        if (cur.values.length === 0) delete acc["source_id"];
      }
      //once the user has selected sentiment, can't remove..TODO- create option to remove
      if (cur.key === "Sentiment") acc["sentiment"] = cur.values;
      return acc;
    }, {});
    setQuery((prevState) => {
      //extract rest of the query out.
      const { category_id, source_id, sentiment, ...rest } = prevState;

      return {
        ...rest,
        ...q,
      };
    });
  };

  //could use a ref instead of this, to get formik submit
  var handleSubmit: Function | null = null;
  //@ts-ignore
  const getFormikSubmit = (submitForm) => {
    handleSubmit = submitForm;
  };
  return (
    <Modal
      visible={show}
      title="Advanced Search"
      okText="Show Results"
      cancelText="Cancel"
      onCancel={() => setShow(false)}
      onOk={() => {
        handleSubmit && handleSubmit();
        setShow(false);
      }}
    >
      <Spin
        spinning={categoriesQuery.isLoading || sourcesQuery.isLoading}
      ></Spin>
      {categoriesQuery.isError || sourcesQuery.isError ? (
        <p>something went wrong</p>
      ) : (
        categoriesQuery.status === "success" &&
        sourcesQuery.status === "success" && (
          <SearchForm
            handleSubmit={handleFormSubmit}
            formState={initialValues}
            avfilters={availableFilters}
            customActionsOnChange={customActionsOnChange}
            categories={categoriesQuery.data}
            sources={sourcesQuery.data}
            sentiments={sentimentsArray}
            passFormikSubmitUP={getFormikSubmit}
          />
        )
      )}
    </Modal>
  );
};
