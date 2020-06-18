import { writable } from "svelte/store";
// import EventSource from "eventsource";

// let eventSource = new EventSource("http://localhost:3000/sse");

let user = {
  id: 1,
  firstName: "Razvan",
  lastName: "Bertea",
  photo: "/images/profile/razvan_img.jpg",
  username: "bertearazvan",
  status: 1,
  public_json: {
    id: 1,
    firstName: "Razvan",
    lastName: "Bertea",
    photo: "/images/profile/razvan_img.jpg",
    status: 1,
    username: "bertearazvan",
  },
  posts: [],
  friends: [],
  activeChats: [],

  notifications: [
    {
      id: 1,
      type: "request",
      body: "Has sent you a request",
      user: {
        id: 3,
        firstName: "Stefan",
        lastName: "Andrei",
        username: "andrei",
        photo: "/images/profile/andrei_img.jpg",
        status: 0,
      },
      timestamp: "now",
    },
    {
      id: 2,
      type: "info",
      body: "Has liked your post",
      timestamp: "now",
      user: {
        id: 3,
        firstName: "Stefan",
        lastName: "Andrei",
        username: "andrei",
        photo: "/images/profile/andrei_img.jpg",
        status: 0,
      },
    },
    {
      id: 3,
      type: "info",
      body: "Has liked your post and more info here",
      timestamp: "now",
      user: {
        id: 2,
        firstName: "Cassandra",
        lastName: "Tiltack",
        username: "cassandra",
        photo: "/images/profile/cass_img.jpg",
        status: 1,
      },
    },
    {
      id: 4,
      type: "info",
      body: "Has liked your post",
      timestamp: "now",
      user: {
        id: 4,
        firstName: "Alin",
        username: "alin",
        lastName: "Chiosa",
        photo: "/images/profile/alin_img.jpg",
        status: 1,
      },
    },
    {
      id: 5,
      type: "request",
      body: "Has sent you a request",
      user: {
        id: 2,
        firstName: "Cassandra",
        username: "cassandra",
        lastName: "Tiltack",
        photo: "/images/profile/cass_img.jpg",
        status: 1,
      },
      timestamp: "now",
    },
    {
      id: 5,
      type: "info",
      body: "Has liked your post",
      timestamp: "now",
      user: {
        id: 4,
        username: "alin",
        firstName: "Alin",
        lastName: "Chiosa",
        photo: "/images/profile/alin_img.jpg",
        status: 1,
      },
    },
  ],
};

// eventSource.onmessage = (data) => {
//   user = JSON.parse(data.data);
//   console.log(user);
//   // $profile = user;
// };

export let users = writable([]);

export let profile = writable({
  id: 1,
  firstName: "Razvan",
  lastName: "Bertea",
  photo: "/images/profile/razvan_img.jpg",
  username: "bertearazvan",
  status: 1,
  public_json: {
    id: 1,
    firstName: "Razvan",
    lastName: "Bertea",
    photo: "/images/profile/razvan_img.jpg",
    status: 1,
    username: "bertearazvan",
  },
  posts: [],
  friends: [],
  activeChats: [],

  notifications: [
    {
      id: 1,
      type: "request",
      body: "Has sent you a request",
      user: {
        id: 3,
        firstName: "Stefan",
        lastName: "Andrei",
        username: "andrei",
        photo: "/images/profile/andrei_img.jpg",
        status: 0,
      },
      timestamp: "now",
    },
    {
      id: 2,
      type: "info",
      body: "Has liked your post",
      timestamp: "now",
      user: {
        id: 3,
        firstName: "Stefan",
        lastName: "Andrei",
        username: "andrei",
        photo: "/images/profile/andrei_img.jpg",
        status: 0,
      },
    },
    {
      id: 3,
      type: "info",
      body: "Has liked your post and more info here",
      timestamp: "now",
      user: {
        id: 2,
        firstName: "Cassandra",
        lastName: "Tiltack",
        username: "cassandra",
        photo: "/images/profile/cass_img.jpg",
        status: 1,
      },
    },
    {
      id: 4,
      type: "info",
      body: "Has liked your post",
      timestamp: "now",
      user: {
        id: 4,
        firstName: "Alin",
        username: "alin",
        lastName: "Chiosa",
        photo: "/images/profile/alin_img.jpg",
        status: 1,
      },
    },
    {
      id: 5,
      type: "request",
      body: "Has sent you a request",
      user: {
        id: 2,
        firstName: "Cassandra",
        username: "cassandra",
        lastName: "Tiltack",
        photo: "/images/profile/cass_img.jpg",
        status: 1,
      },
      timestamp: "now",
    },
    {
      id: 5,
      type: "info",
      body: "Has liked your post",
      timestamp: "now",
      user: {
        id: 4,
        username: "alin",
        firstName: "Alin",
        lastName: "Chiosa",
        photo: "/images/profile/alin_img.jpg",
        status: 1,
      },
    },
  ],
});

export let storePosts = writable([]);

export let postModal = writable({
  show: false,
  postData: undefined,
});
