import React from "react";
import { Card } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";

export default function Details() {
  const article = useSelector((state) => state.article);
  const {
    urlToImage,
    title,
    author,
    content,
    url,
    source,
    publishedAt,
  } = article;
  return (
    <Card className="article-detail">
      <article>
        <div className="image-fill">
          <img src={urlToImage} />
        </div>
        <h2 className="title">{title}</h2>
        <p className="author">{author}</p>
        <p className="source">{source.name}</p>
        <p className="date">{moment(publishedAt).format("LT LL")}</p>
        <p className="content">
          {(!!content
            ? content.substring(0, content.indexOf("["))
            : description) || "No content Available"}
        </p>
        <a href={url}>Read more at {source.name}</a>
      </article>
    </Card>
  );
}
