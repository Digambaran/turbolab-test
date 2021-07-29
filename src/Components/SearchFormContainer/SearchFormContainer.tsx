import React, { Dispatch, useState } from "react";
import { Formik } from "formik";

import moment from "moment";
import { Modal } from "antd";
import { SearchForm } from "../SearchForm/SearchForm";

const initialValues = {
  filters: [{ key: "asdas", values: ["sfssf"], options: ["sda"] }],
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
const sentimentsArray = ["Negative", "Positive", "Neutral"];
export const SearchFormContainer: React.FC<SearchFormContainerProps> = ({
  show,
  setShow,
  categoriesQuery,
  sourcesQuery,
}) => {
  const [availableFilters, setAvailableFilters] = useState<string[]>(Filters);
  const [formState, setFormState] = useState<FormState>(initialValues);

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
      setFormState((prevState) => {
        let newFilters = [...prevState.filters];
        newFilters[parseInt(index)].options =
          value === "Source"
            ? sourcesQuery.data.source
            : value === "Category"
            ? categoriesQuery.data
            : sentimentsArray;
        return {
          filters: newFilters,
        };
      });
    }
  };

  console.log('formstate',formState);
  

  //@ts-ignore
  const handleSubmit = (formProps) => {
    console.log(formProps, "df");

    // const { bookingClient, bookingDate, bookingTime, email } = formProps;
    // const selectedDate = moment(bookingDate).format(dateFormat);
    // const selectedTime = moment(bookingTime).format(timeFormat);
    // alert(
    //   `Email: ${email} \nSelected Date: ${selectedDate} \nSelected Time: ${selectedTime}\nSelected Client: ${bookingClient}`
    // );
  };
  const formikRender=SearchForm.bind(null,{avfilters:availableFilters, customActionsOnChange:customActionsOnChange})
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
      <Formik
      enableReinitialize
        initialValues={formState}
        onSubmit={handleSubmit}
        render={formikRender}
      />
    </Modal>
  );
};
