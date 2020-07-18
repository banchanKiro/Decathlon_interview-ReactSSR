import initialState from "./initialState";

import {
  UPDATE_NEWS,
  UPDATE_HEADLINES,
  SET_CURRENT_ARTICLE,
  SET_NEWS,
  SET_HEADLINES,
} from "./types";

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_NEWS:
      const { articles: newsArticles, ...news } = action.payload;
      return {
        ...state,
        news: {
          ...state.news,
          ...news,
          articles: [...state.news.articles, ...newsArticles],
        },
      };
    case UPDATE_HEADLINES:
      const { articles: HeadlinesArticles, ...headlines } = action.payload;
      return {
        ...state,
        headlines: {
          ...state.headlines,
          ...headlines,
          articles: [...state.headlines.articles, ...HeadlinesArticles],
        },
      };
    case SET_CURRENT_ARTICLE:
      return {
        ...state,
        article: action.payload,
      };
    case SET_NEWS:
      return {
        ...state,
        news: action.payload,
      };
    case SET_HEADLINES:
      return {
        ...state,
        headlines: action.payload,
      };
    default:
      return state;
  }
}
