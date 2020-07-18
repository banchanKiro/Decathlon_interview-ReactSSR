import React from "react";
import axios from "axios";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import Home from "./Home";
import "./App.css";

import { Layout, Space, Select } from "antd";
const { Option } = Select;
import Details from "./components/Details";
import Headlines from "./components/Headlines";
import { useSelector, connect } from "react-redux";
import actions from "./store/actions";

const { Header, Content, Footer, Sider } = Layout;

const App = ({ history, setNews }) => {
  const article = useSelector((state) => state.article);
  const news = useSelector((state) => state.news);
  const { sources } = useSelector((state) => state.sources);

  function handleChange(sources) {
    axios
      .get(`/api/news?page=1&q=${news.q}&sources=${sources.toString()}`)
      .then(({ data: news }) => setNews(news));
  }

  return (
    <Layout className="container">
      <Header className="navbar" style={{ height: "66px" }}>
        <div onClick={() => history.push("/")} style={{ cursor: "pointer" }}>
          <h1 className="logo" style={{ color: "white" }}>
            Daily News
          </h1>
        </div>
        <Space align="baseline" size="large" style={{ float: "right" }}>
          <Select
            mode="multiple"
            style={{ width: "200px" }}
            placeholder="Sources"
            defaultValue={[]}
            onChange={handleChange}
            maxTagCount={0}
          >
            {sources.map(({ id, name }) => (
              <Option key={id}>{name}</Option>
            ))}
          </Select>
        </Space>
      </Header>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <Switch>
            <Route path="/details">
              {article ? <Details /> : <Redirect to="/" />}
            </Route>
            <Route path="/" component={Home} />
          </Switch>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Daily News ©2020 Created by Banchan Kiro
        </Footer>
      </Layout>
      <Sider
        id="headlines"
        className="site-layout-background sticky"
        width="300"
        theme="light"
        style={{
          overflow: "auto",
          height: "100vh",
          right: 0,
        }}
      >
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <Headlines />
        </Content>
      </Sider>
    </Layout>
  );
};

export default connect(null, {
  setHeadlines: actions.setHeadlines,
  setNews: actions.setNews,
})(withRouter(App));
