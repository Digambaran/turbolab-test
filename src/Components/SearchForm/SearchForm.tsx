import { Button, Row } from "antd";
import {
  ArrayHelpers,
  Field,
  FieldArray,
  Form,
  Formik,
  useFormikContext,
} from "formik";
import React, { useEffect } from "react";
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

export interface sentimentObject {
  label: string;
  value: string;
}

interface SearchFormProps {
  passFormikSubmitUP: Function;
  avfilters: string[];
  customActionsOnChange: Function;
  handleSubmit: any;
  formState: any;
  categories: categoryObject[];
  sources: sourceObject[];
  sentiments: sentimentObject[];
}

interface DependentSelectProps {
  index: number;
  categories: categoryObject[];
  sources: sourceObject[];
  sentiments: sentimentObject[];
}

/**
 * returns options for filters dynamically, removing already selected filter option
 * @param avfilters Available filters
 * @param values Current values array of formik
 */
const filterOptions = (avfilters: string[], filters: []) =>
  avfilters.filter(
    (f) =>
      //@ts-ignore
      filters.findIndex((ff: any) => ff.key === f) === -1
  );

const DependentSelect: React.FC<DependentSelectProps> = ({
  index,
  categories,
  sources,
  sentiments,
}) => {
  const { values, setValues } = useFormikContext();
  //@ts-ignore
  const filters = values.filters;
  //change if value of key has changed
  useEffect(() => {
    const newFilters = [...filters];
    newFilters[index].values = [];
    newFilters[index].options =
      newFilters[index].key === "Category"
        ? categories
        : newFilters[index].key === "Source"
        ? sources
        : sentiments;
    setValues({ filters: newFilters });
  }, [index, filters[index].key]);

  console.log(filters, "formik context");

  return (
    <Field
      component={AntSelect}
      name={`filters[${index}].values`}
      mode={filters[index].key==="Sentiment"?undefined:"multiple"}
      // customActions={customActionsOnChange}
      customActions={() => {}}
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
  passFormikSubmitUP,
  handleSubmit,
  categories,
  sources,
  sentiments,
}: SearchFormProps) => {
  return (
    //@ts-ignore
    <Formik
      enableReinitialize
      initialValues={formState}
      onSubmit={handleSubmit}
    >
      {({ values, submitForm }) => {
        passFormikSubmitUP(submitForm);
        return (
          <Form className="form-container">
            <FieldArray
              name="filters"
              //@ts-ignore
              render={({ push }: ArrayHelpers) => {
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
                            selectOptions={filterOptions(
                              avfilters,
                              values.filters
                            )}
                            tokenSeparators={[","]}
                            style={{ width: 200 }}
                            hasFeedback
                          />
                          <DependentSelect
                            index={index}
                            categories={categories}
                            sources={sources}
                            sentiments={sentiments}
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
        );
      }}
    </Formik>
  );
};
