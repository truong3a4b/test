import { useEffect, useState } from "react";
import React from "react";
import { Button, DatePicker, Form, Input, Select } from "antd";
import dayjs from "dayjs";
import { RxAvatar } from "react-icons/rx";
import { Dropdown } from "antd";
import { IoCloseOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import axios from "axios";
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const ProjectSetting = ({ checkManager, id, project_data }) => {
  const [update, setUpdate] = useState(false)

  const [name, setName] = useState(project_data.name);
  const [description, setDescription] = useState(project_data.description);
  const [start_date, setStartDate] = useState(project_data.start_date);
  const [end_date, setEndDate] = useState(project_data.end_date);
  const code = project_data.code
  const [accessibility, setAccessibility] = useState(project_data.accessibility);
  const model = project_data.model;
  // participants ,request list, update request as manager ======================================================= author: Hai
  // update handling --------
  const handleUpdate = function () {
    setUpdate(!update)
  }
  // participants ---------------
  const [joinedFromBackend, setJoinedFromBackend] = useState([])
  const [request_List, setRequest_List] = useState([])
  const token = sessionStorage.getItem('token')
  const FetchParticipants = async () => {
    try {
      const fetchParticipants_res = await axios.get(`${process.env.REACT_APP_SERVER}/project-joineds/participants`, {
        headers: {
          token
        },
        params: {
          project_id: id
        }
      })
      if (!fetchParticipants_res) throw new Error("fetch Prticipants false")
      setJoinedFromBackend(fetchParticipants_res.data.participants)
    } catch (err) {
      console.log(err)
    }
  }
  // request list --------------------------
  const FetchRequest_list = async function () {
    try {
      const fetchRequest_res = await axios.get(`${process.env.REACT_APP_SERVER}/requests/project`, {
        headers: {
          token
        },
        params: {
          project_id: id
        }
      })
      if (fetchRequest_res.data.success) setRequest_List(fetchRequest_res.data.users)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    FetchParticipants()
    FetchRequest_list()
  }, [update])
  // =========================================================================================================================
  // Acept /  refuse  ----------------------------------------------------
  const HandleUpdateRequest = async function (value, request_id) {
    try {
      const updateRequest_res = await axios.put(`${process.env.REACT_APP_SERVER}/requests/update`, {
        state: value
      }, {
        headers: {
          token
        },
        params: {
          request_id
        }
      })
    } catch (err) { console.log(err) }
  }


  return (
    <div className="flex flex-row gap-x-2">
      <div className="w-3/5">
        <div className="p-4">
          <h1 className="text-xl font-bold">Setting</h1>
        </div>
        <div className="">
          <Form
            labelCol={{
              span: 6,
            }}
            className=""
          >
            <Form.Item
              label={
                <span className="font-semibold text-base">Project name</span>
              }
              rules={[
                { required: true, message: "Vui lòng nhập tên người dùng!" },
              ]}
            >
              <Input
                defaultValue={name}
                className="border-black "
                onChange={(e) => setName(e.target.value)}
                disabled={!checkManager}
              />
            </Form.Item>
            <Form.Item
              label={<span className="font-semibold text-base">Model</span>}
            >
              <div>{model}</div>
            </Form.Item>
            <Form.Item
              label={<span className="font-semibold text-base">Timeline</span>}
            >
              <RangePicker
                defaultValue={[
                  dayjs(start_date, "YYYY-MM-DD"),
                  dayjs(end_date, "YYYY-MM-DD"),
                ]}
                className="border-black"
                format="DD-MM-YYYY"
                onChange={(value) => {
                  setStartDate(
                    value[0] ? dayjs(value[0]).format("YYYY-MM-DD") : null
                  );
                  setEndDate(
                    value[1] ? dayjs(value[1]).format("YYYY-MM-DD") : null
                  );
                }}
                disabled={!checkManager}
              />
            </Form.Item>
            <Form.Item
              label={
                <span className="font-semibold text-base">Accessibility</span>
              }
            >
              <Select
                defaultValue={accessibility}
                style={{
                  width: "30%",
                  borderColor: "black",
                  borderWidth: 1,
                  borderRadius: "7px",
                }}
                onChange={(value) => setAccessibility(value)}
                disabled={!checkManager}
              >
                <Select.Option value="Private">Private</Select.Option>
                <Select.Option value="Public">Public</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={
                <span className="font-semibold text-base">Invitation code</span>
              }
            >
              <div className="">{code}</div>
            </Form.Item>
            <Form.Item
              label={
                <span className="font-semibold text-base">Description</span>
              }
            >
              <TextArea
                defaultValue={description}
                rows={4}
                className="border-black"
                onChange={(e) => setDescription(e.target.value)}
                disabled={!checkManager}
              />
            </Form.Item>
          </Form>
        </div>
        {checkManager && (
          <div className="flex justify-center p-4 px-10">
            <button
              className="p-2 w-20 border-2 bg-blue-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500 "
              onClick={handleUpdate}
            >
              Save
            </button>
            <button className="p-2 ml-4 w-20 border-2 bg-gray-100  text-black rounded-xl hover:shadow-lg hover:shadow-gray-500 ">
              Delete
            </button>
          </div>
        )}
      </div>
      <div className="p-4 border-l-2 w-1/2 bg-gray-50 flex flex-col ">
        {/* nhung nguoi tham gia */}
        <div className="h-1/2 border-b-2 flex flex-col gap-2">
          <h3 className="font-semibold text-xl">Participant</h3>
          <div className="h-4/5 overflow-y-auto flex flex-col gap-2">
            {joinedFromBackend.map((obj) => {
              return (
                <div>
                  <Dropdown
                    menu={{
                      items: [
                        {
                          label: <button className="w-20">Delete</button>,
                          key: `${obj.id}`,
                        },
                      ],
                    }}
                    trigger={["click"]}
                    overlayClassName="custom-dropdown"
                  >
                    <div className="flex gap-4 items-center hover:bg-slate-100">
                      <div className="w-10 h-10">
                        <RxAvatar className="w-10 h-10" />
                      </div>
                      <div>
                        <h3 className=" ">{obj.name}</h3>
                      </div>
                    </div>
                  </Dropdown>
                </div>
              );
            })}
          </div>
        </div>

        {/* Request */}
        <div className=" flex flex-col gap-2 ">
          <h3 className="font-semibold text-xl">Request</h3>
          <div className="overflow-y-auto flex flex-col gap-2 ">
            {request_List.map((obj) => {
              return (
                <div className="flex items-center hover:bg-slate-100 justify-between">
                  <div className="flex gap-4">
                    <div className="">
                      <RxAvatar className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="">{obj.name}</h3>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className=" border-2 bg-blue-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500 "
                      onClick={() => { HandleUpdateRequest("Accepted", obj.request_id); handleUpdate() }}>
                      <FaCheck />
                    </button>

                    <button className="border-2 bg-gray-100  text-black rounded-xl hover:shadow-lg hover:shadow-gray-500 "
                      onClick={() => { HandleUpdateRequest("Rejected", obj.request_id); handleUpdate() }}>
                      <IoCloseOutline />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSetting;
