import { Modal, Form, Input, Radio } from "antd";
import React, { Dispatch } from "react";

export interface SearchFormProps {
  // query:Object;
  show: boolean;
  setShow: Dispatch<React.SetStateAction<boolean>>;
}

export const SearchForm = ({ show, setShow }: SearchFormProps): JSX.Element => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={show}
      title="Create a new collection"
      okText="Create"
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
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: "public" }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: "Please input the title of collection!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input type="textarea" />
        </Form.Item>
        <Form.Item
          name="modifier"
          className="collection-create-form_last-form-item"
        >
          <Radio.Group>
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};
