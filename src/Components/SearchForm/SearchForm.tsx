import { Button, Row } from "antd";
import {
  ArrayHelpers,
  Field,
  FieldArray,
  Form,
  Formik,
  useFormikContext,
} from "formik";
import React, { Dispatch, useEffect } from "react";
import { AntSelect } from "../CreateAntFields/CreateAntFields";

export interface sourceObject {
  id: number;
  name: string;
  domain: string;
}

export interface subCategoryObject {
  category: string;
  iptc_code: string;
}
export interface categoryObject extends subCategoryObject {
  sub_categories: Array<subCategoryObject>;
}
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

interface DependentSelectProps {
  index: number;
  customActionsOnChange: Function;
  formState: any;
}
const DependentSelect: React.FC<DependentSelectProps> = ({
  index,
  customActionsOnChange,
  formState,
}) => {
  const {
    values: { filters },
  } = useFormikContext();
  // const selectOptions=formState.filters[index]?.options||[];

  //change if value of key has changed
  useEffect(() => {
    if (filters.length === formState.filters.length) {
      filters[index].options = formState.filters[index].options;
    }
  }, [formState, index, filters]);

  // const [field, meta] = useField(props);

  console.log(filters, "formik context");

  return (
    <Field
      component={AntSelect}
      name={`filters[${index}].values`}
      mode="multiple"
      customActions={customActionsOnChange}
      tokenSeparators={[","]}
      options={filters[index].options}
      style={{ width: 200 }}
      hasFeedback
    />
  );
};

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
              return (
                <>
                  <Button
                    disabled={values.filters.length === 3}
                    onClick={() => push({ key: "", values: "", options: [] })}
                  >
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
                        <DependentSelect
                          index={index}
                          customActionsOnChange={customActionsOnChange}
                          formState={formState}
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
