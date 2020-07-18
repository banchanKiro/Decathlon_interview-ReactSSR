import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

import InfiniteScroll from "react-infinite-scroll-component";
import { Card } from "antd";
import actions from "../store/actions";

class Headlines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headlineArea:
        typeof window !== "undefined" && document.getElementById("headlines"),
    };
  }

  fetchHeadlines = () => {
    const {
      headlines: { page, sources },
      updateHeadlines,
    } = this.props;

    axios
      .get(`/api/headlines?page=${parseInt(page) + 1}`)
      .then(({ data: headlines }) => updateHeadlines(headlines));
  };

  render() {
    const { headlines } = this.props;
    const { headlineArea } = this.state;
    return (
      <InfiniteScroll
        dataLength={headlines.articles.length}
        next={this.fetchHeadlines}
        hasMore={headlines.articles.length !== headlines.totalResults}
        loader={<h4>loading...</h4>}
        scrollableTarget={headlineArea}
      >
        {headlines.articles.map(({ title, url }, i) => (
          <a href={url} target="_blank" key={i}>
            <Card size="small">
              <h4>{title}</h4>
            </Card>
          </a>
        ))}
      </InfiniteScroll>
    );
  }
}

const mapStateToProps = (state) => ({
  headlines: state.headlines,
});

export default connect(mapStateToProps, {
  updateHeadlines: actions.updateHeadlines,
})(Headlines);
