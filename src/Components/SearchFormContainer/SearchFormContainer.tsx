import { Modal } from "antd";
import React, { Dispatch, useState } from "react";
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
      setAvailableFilters((prevState) => prevState.filter((v) => v !== value));
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

  console.log("formstate", formState);

  //@ts-ignore
  const handleSubmit = (formProps) => {
    console.log(formProps, "df");
  };
  return (
    <Modal
      visible={show}
      title="Advanced Search"
      okText="Show Results"
      cancelText="Cancel"
      onCancel={() => setShow(false)}
      onOk={() => {
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
        formState={formState}
        avfilters={availableFilters}
        customActionsOnChange={customActionsOnChange}
        handleSubmit={handleSubmit}
        categories={categoriesQuery.data}
        sources={sourcesQuery.data}
        sentiments={sentimentsArray}
      />
    </Modal>
  );
};
