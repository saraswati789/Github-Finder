// Dependencies
import React, { useReducer } from "react";
import axios from "axios";
import GithubContext from "./githubContext";
import GithubReducer from "./githubReducer";

// Types for dispatch
import {
  SEARCH_USERS,
  SET_LOADING,
  CLEAR_USERS,
  GET_USER,
  GET_REPOS,
  GET_LABELS
} from "../types";

const GithubState = (props) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    labels: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(GithubReducer, initialState);

  // Search multiple users
  const searchUsers = async (user) => {
    setLoading();
    const res = await axios.get(
      `https://api.github.com/search/users?q=${user}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );
    dispatch({
      type: SEARCH_USERS,
      payload: res.data.items,
    });
  };

  // Get data of single user
  const getUser = async (username) => {
    setLoading();
    const res = await axios.get(
      `https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );

    dispatch({
      type: GET_USER,
      payload: res.data,
    });
  };

  // Get repos of single user
  const getUserRepos = async (username) => {
    setLoading();
    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );

    dispatch({
      type: GET_REPOS,
      payload: res.data,
    });
  };

  // Search Labels
  const searchLabels = async(label) => {
    
    const res = await axios.get(
      `https://api.github.com/search/labels?repository_id=64778136&q=${label}`
    );

    dispatch({
      type: GET_LABELS,
      payload: res.data.items
    })
    console.log(res.data);
  };

  //   Clear Users
  const clearUsers = () => dispatch({ type: CLEAR_USERS });

  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <GithubContext.Provider
      value={{
        user: state.user,
        users: state.users,
        loading: state.loading,
        repos: state.repos,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
        searchLabels
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export default GithubState;
