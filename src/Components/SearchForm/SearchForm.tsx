import { Button, Modal, Row, Select } from "antd";
import {
  ArrayHelpers,
  Field,
  FieldArray,
  Form,
  FormikProps,
  useFormik,
} from "formik";
import React, { Dispatch } from "react";
import {
  AntDatePicker,
  AntInput,
  AntSelect,
  AntTimePicker,
} from "../CreateAntFields/CreateAntFields";

export interface SearchFormProps {
  // query:Object;
  show: boolean;
  setShow: Dispatch<React.SetStateAction<boolean>>;
  categoriesQuery: any;
  sourcesQuery: any;
}

// export const SearchForm = ({
//   show,
//   setShow,
//   categoriesQuery,
//   sourcesQuery,
// }: SearchFormProps): JSX.Element => {
//   const [form] = Form.useForm();

//   console.log(categoriesQuery.data, sourcesQuery.data);

// };

export const CustomField =
  (values: FormikProps<any>, fs: string[], customActionsOnChange: () => void) =>
  ({ move, swap, push, insert, unshift, pop, ...rest }: ArrayHelpers) => {
    console.log(values, "hy");

    return (
      <>
        <Button onClick={() => push({ key: "", values: "" })}>
          Add New Filter
        </Button>
        {
          //@ts-ignore
          values.filters.map((filter: any, index: any) => (
            <Row key={index}>
              <Field
                component={AntSelect}
                name={`filters[${index}].key`}
                // label="Client"
                customActions={customActionsOnChange}
                // defaultValue={values.bookingClient}
                selectOptions={fs}
                // validate={isRequired}
                // submitCount={submitCount}
                tokenSeparators={[","]}
                style={{ width: 200 }}
                hasFeedback
              />
              <Field
                component={AntSelect}
                name={`filters[${index}].values`}
                // label="Client"
                mode="multiple"
                customActions={customActionsOnChange}
                // defaultValue={values.bookingClient}
                // selectOptions={options}
                // validate={isRequired}
                // submitCount={submitCount}
                tokenSeparators={[","]}
                style={{ width: 200 }}
                hasFeedback
              />
            </Row>
          ))
        }
      </>
    );
  };

interface MyProps {
  avfilters: string[];
  customActionsOnChange: Function;
}

/**
 * Function
 * @param avfilters Available filters to be selected
 * @param setAvFilters Set available filters setstate function
 * @returns a render function for Formik render
 */
export const SearchForm = (
  // { avfilters, customActionsOnChange }: MyProps,
  {
    handleSubmit,
    values,
    handleChange,
    handleBlur,
    errors, //@ts-ignore
  }: FormikProps
) => {
  console.log("formik values", values);

  return (
    <Form className="form-container" onSubmit={handleSubmit}>
      <FieldArray
        name="filters"
        //@ts-ignore
        // component={CustomField(values, avfilters, customActionsOnChange)}
        component={CustomField(values, ['Sentiment','Category','Source'], ()=>{})}
      />
      <div className="submit-container">
        <button className="ant-btn ant-btn-primary" type="submit">
          Submit
        </button>
      </div>
    </Form>
  );
};

// export const SearchForm=({ handleSubmit, values, submitCount,handleChange }) => (
//   <Form className="form-container" onSubmit={handleSubmit}>
//     <Field
//       component={AntSelect}
//       name="bookingClient"
//       label="Client"
//       mode="multiple"
//       customChangeEvents={(V:any)=>{console.log(V,"yes");}}
//       defaultValue={values.bookingClient}
//       selectOptions={values.selectOptions}
//       // validate={isRequired}
//       submitCount={submitCount}
//       tokenSeparators={[","]}
//       style={{ width: 200 }}
//       hasFeedback
//     />
//     <div className="submit-container">
//       <button className="ant-btn ant-btn-primary" type="submit">
//         Submit
//       </button>
//     </div>
//   </Form>
// );
