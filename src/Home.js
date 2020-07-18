import React, { Component } from "react";
import { connect } from "react-redux";
import "./Home.css";
import { Link } from "react-router-dom";

import axios from "axios";

import { Card, Divider } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import actions from "./store/actions";
class Home extends Component {
  fetchNews = () => {
    const {
      news: { page, sources },
      updateNews,
    } = this.props;

    axios
      .get(`/api/news?page=${parseInt(page) + 1}&sources=${sources}`)
      .then(({ data: news }) => updateNews(news));
  };

  render() {
    const { news, setCurrentArticle } = this.props;
    return (
      <InfiniteScroll
        dataLength={news.articles.length}
        next={this.fetchNews}
        hasMore={news.articles.length !== news.totalResults}
        loader={<h4>loading...</h4>}
      >
        {news.articles.map((article, i) => {
          const { description, title, urlToImage } = article;
          return (
            <Link to="/details" key={i}>
              <Card
                bordered={false}
                className="article"
                onClick={() => {
                  setCurrentArticle(article);
                }}
              >
                <article>
                  <div className="image-fill">
                    <img src={urlToImage} />
                  </div>
                  <h2 className="title">{title}</h2>
                  <p>{description}</p>
                </article>
              </Card>
              <Divider
                style={{
                  margin: "10px 0",
                }}
              />
            </Link>
          );
        })}
      </InfiniteScroll>
    );
  }
}

const mapStateToProps = (state) => ({
  news: state.news,
});

export default connect(mapStateToProps, {
  updateNews: actions.updateNews,
  setCurrentArticle: actions.setCurrentArticle,
})(Home);
