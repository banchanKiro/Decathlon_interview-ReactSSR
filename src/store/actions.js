import {
  UPDATE_NEWS,
  UPDATE_HEADLINES,
  SET_CURRENT_ARTICLE,
  SET_NEWS,
  SET_HEADLINES,
} from "./types";

const updateNews = (news) => ({
  type: UPDATE_NEWS,
  payload: news,
});

const updateHeadlines = (headlines) => ({
  type: UPDATE_HEADLINES,
  payload: headlines,
});

const setCurrentArticle = (article) => ({
  type: SET_CURRENT_ARTICLE,
  payload: article,
});

const setNews = (news) => ({
  type: SET_NEWS,
  payload: news,
});

const setHeadlines = (headlines) => ({
  type: SET_HEADLINES,
  payload: headlines,
});

export default {
  updateNews,
  updateHeadlines,
  setCurrentArticle,
  setNews,
  setHeadlines,
};
