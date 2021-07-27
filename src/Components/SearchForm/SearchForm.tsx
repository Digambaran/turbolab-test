import { Modal, Form, Input, Radio, Button, Select, Space } from "antd";
import React, { Dispatch } from "react";
import { useQuery } from "react-query";

export interface SearchFormProps {
  // query:Object;
  show: boolean;
  setShow: Dispatch<React.SetStateAction<boolean>>;
  categoriesQuery:any; 
  sourcesQuery:any;
}

export const SearchForm = ({
  show,
  setShow,
  categoriesQuery,
  sourcesQuery,
}: SearchFormProps): JSX.Element => {
  const [form] = Form.useForm();
  
  console.log(categoriesQuery.data, sourcesQuery.data);

  const handleSelectChange = (v: string[]) => console.log(v, "selectchanges");
  return (
    <Modal
      visible={show}
      title="Advanced Search"
      okText="Show Results"
      cancelText="Cancel"
      onCancel={() => setShow(false)}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            // onCreate(values);
            console.log(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        name="dynamic_form_item"
        onFinish={(values) => console.log(values)}
      >
        <Form.List
          name="filters"
          // rules={[
          //   {
          //     validator: async (_, filters) => {
          //       if (!filters || filters.length < 2) {
          //         return Promise.reject(new Error("At least 2 passengers"));
          //       }
          //     },
          //   },
          // ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: "60%" }}
                >
                  Add field
                </Button>

                {/* <Form.ErrorList errors={errors} /> */}
              </Form.Item>
              {fields.map(({ fieldKey, name, key, ...restField }, index) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    validateTrigger={["onChange", "onBlur"]}
                    // rules={[
                    //   {
                    //     required: true,
                    //     whitespace: true,
                    //     message:
                    //       "Please input passenger's name or delete this field.",
                    //   },
                    // ]}
                    name={[name, "filterKey"]}
                    fieldKey={[fieldKey, "filter"]}
                  >
                    <Select
                      defaultValue={["sentiment"]}
                      onChange={handleSelectChange}
                      style={{ width: 200 }}
                    >
                      {["sentiment", "category", "source"].map((v: string) => (
                        <Select.Option value={v} key={v}>
                          {v}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "filterValues"]}
                    fieldKey={[fieldKey, "filter"]}
                  >
                    <Select
                      mode="multiple"
                      // size={size}
                      placeholder="Please select"
                      defaultValue={["negative"]}
                      onChange={handleSelectChange}
                      style={{ width: "100%" }}
                    >
                      {["negative", "positive"]}
                    </Select>
                  </Form.Item>
                </Space>
              ))}
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
