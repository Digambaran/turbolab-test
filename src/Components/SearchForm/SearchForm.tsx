import { Button, Row } from "antd";
import { ArrayHelpers, Field, FieldArray, Form, Formik } from "formik";
import React, { Dispatch } from "react";
import { AntSelect } from "../CreateAntFields/CreateAntFields";

export interface SearchFormProps {
  show: boolean;
  setShow: Dispatch<React.SetStateAction<boolean>>;
  categoriesQuery: any;
  sourcesQuery: any;
}

interface MyProps {
  avfilters: string[];
  customActionsOnChange: Function;
  handleSubmit: any;
  formState: any;
}

/**
 * Function
 * @param avfilters Available filters to be selected
 * @param setAvFilters Set available filters setstate function
 * @returns a render function for Formik render
 */

export const SearchForm = ({
  formState,
  avfilters,
  customActionsOnChange,
  handleSubmit,
}: MyProps) => {
  return (
    //@ts-ignore
    <Formik
      enableReinitialize
      initialValues={formState}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, handleChange, handleBlur, values, errors }) => (
        <Form className="form-container">
          <FieldArray
            name="filters"
            //@ts-ignore
            render={({
              move,
              swap,
              push,
              insert,
              unshift,
              pop,
              ...rest
            }: ArrayHelpers) => {
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
                          customActions={customActionsOnChange}
                          selectOptions={avfilters}
                          tokenSeparators={[","]}
                          style={{ width: 200 }}
                          hasFeedback
                        />
                        <Field
                          component={AntSelect}
                          name={`filters[${index}].values`}
                          mode="multiple"
                          customActions={customActionsOnChange}
                          tokenSeparators={[","]}
                          style={{ width: 200 }}
                          hasFeedback
                        />
                      </Row>
                    ))
                  }
                </>
              );
            }}
          />
          <div className="submit-container">
            <button className="ant-btn ant-btn-primary" type="submit">
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
