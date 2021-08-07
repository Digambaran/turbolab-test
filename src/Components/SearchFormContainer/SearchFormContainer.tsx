import { Modal } from "antd";
import React, { Dispatch, useState } from "react";
import { queryObject } from "../../App";
import { SearchForm } from "../SearchForm/SearchForm";

const initialValues = {
  filters: [{ key: "", values: [], options: [] }],
};

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
  categoriesQuery: any;
  sourcesQuery: any;
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
}) => {
  const [availableFilters, setAvailableFilters] = useState<string[]>(Filters);
  const [formState, setFormState] = useState<FormState>(initialValues);

  /**
   * On every change of filter and filter value, change the form state.
   * @param name Name of field that changed, filter[index].key or filter[index].values
   * @param value The changed value from the field, if options is changed then string array
   */
  const customActionsOnChange = (
    name: string,
    value: "Source" | "Sentiment" | "Category" | string[]
  ) => {
    console.log(name, value, "here");

    const [index, ...rest1] = name.match(/\d/) || [];
    const isKey = name.split(".")[1] === "key";

    if (isKey) {
      //remove already used filters
      // setAvailableFilters((prevState) => prevState.filter((v) => v !== value));
      // setFormState((prevState) => {
      //   let newFilters = [...prevState.filters];
      //   //@ts-ignore if key then not array
      //   newFilters[parseInt(index)]['key'] = value;
      //   newFilters[parseInt(index)]['options'] =
      //     value === "Source"
      //       ? sourcesQuery.data
      //       : value === "Category"
      //       ? categoriesQuery.data
      //       : sentimentsArray;
      //   return {
      //     filters: newFilters,
      //   };
      // });
    }
  };

  const handleFormSubmit = (v: any) => {
    console.log("valuesss", v);
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
  console.log("formstate", formState);

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
        // form
        //   .validateFields()
        //   .then((values) => {
        //     form.resetFields();
        //     // onCreate(values);
        //     console.log(values);
        //   })
        //   .catch((info) => {
        //     console.log("Validate Failed:", info);
        //   });
      }}
    >
      <SearchForm
        handleSubmit={handleFormSubmit}
        formState={formState}
        avfilters={availableFilters}
        customActionsOnChange={customActionsOnChange}
        categories={categoriesQuery.data}
        sources={sourcesQuery.data}
        sentiments={sentimentsArray}
        passFormikSubmitUP={getFormikSubmit}
      />
    </Modal>
  );
};
