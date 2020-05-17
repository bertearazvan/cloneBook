import { writable } from "svelte/store";

export let profile = writable({
  id: 1,
  firstName: "Razvan",
  lastName: "Bertea",
  photo: "/images/profile/razvan_img.jpg",
  status: 1,
  public_json: {
    id: 1,
    firstName: "Razvan",
    lastName: "Bertea",
    photo: "/images/profile/razvan_img.jpg",
    status: 1,
  },
  posts: [
    {
      id: 1,
      description: "I believe it‼️🤣",
      timestamp: "2hrs",
      likes: [
        {
          id: 1,
          firstName: "Razvan",
          lastName: "Bertea",
          photo: "/images/profile/razvan_img.jpg",
          status: 1,
        },
      ],
      photo: "/images/posts/post_img_food.jpg",
      user: {
        id: 4,
        firstName: "Alin",
        lastName: "Chiosa",
        photo: "/images/profile/alin_img.jpg",
        status: 1,
      },
      comments: [
        {
          id: 1,
          user: {
            id: 3,
            firstName: "Stefan",
            lastName: "Andrei",
            photo: "/images/profile/andrei_img.jpg",
            status: 0,
          },
          post_id: 1,
          likes: [
            {
              id: 1,
              firstName: "Razvan",
              lastName: "Bertea",
              photo: "/images/profile/razvan_img.jpg",
              status: 1,
            },
          ],
          comment_body: "You are very funny Alin!!!",
          timestamp: "35 mins",
          replies: [
            {
              id: 1,
              user: {
                id: 2,
                firstName: "Cassandra",
                lastName: "Tiltack",
                photo: "/images/profile/cass_img.jpg",
                status: 1,
              },
              likes: [
                {
                  id: 1,
                  firstName: "Razvan",
                  lastName: "Bertea",
                  photo: "/images/profile/razvan_img.jpg",
                  status: 1,
                },
              ],
              comment_body: "True😅 very good joke!!!",
              timestamp: "39 mins",
            },
            {
              id: 2,
              user: {
                id: 3,
                firstName: "Stefan",
                lastName: "Andrei",
                photo: "/images/profile/andrei_img.jpg",
                status: 0,
              },
              likes: [],
              comment_body: "Right??? He is so fuckin funnyyy =))))))",
              timestamp: "41 mins",
            },
          ],
        },
        {
          id: 2,
          user: {
            id: 1,
            firstName: "Razvan",
            lastName: "Bertea",
            photo: "/images/profile/razvan_img.jpg",
            status: 0,
          },
          post_id: 1,
          likes: [],
          comment_body: "Hehe Alin, nice joke my friend",
          timestamp: "1hr",
          replies: [
            {
              id: 1,
              user: {
                id: 3,
                firstName: "Stefan",
                lastName: "Andrei",
                photo: "/images/profile/andrei_img.jpg",
                status: 0,
              },
              comment_body: "I thought so too!",
              timestamp: "1hr",
              likes: [],
            },
            {
              id: 2,
              user: {
                id: 3,
                firstName: "Stefan",
                lastName: "Andrei",
                photo: "/images/profile/andrei_img.jpg",
                status: 0,
              },
              comment_body: "blablalba",
              timestamp: "35 mins",
              likes: [
                {
                  id: 1,
                  firstName: "Razvan",
                  lastName: "Bertea",
                  photo: "/images/profile/razvan_img.jpg",
                  status: 1,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  friends: [
    {
      id: 1,
      firstName: "Razvan",
      lastName: "Bertea",
      photo: "/images/profile/razvan_img.jpg",
      status: 0,
    },
    {
      id: 2,
      firstName: "Cassandra",
      lastName: "Tiltack",
      photo: "/images/profile/cass_img.jpg",
      status: 1,
    },
    {
      id: 3,
      firstName: "Stefan",
      lastName: "Andrei",
      photo: "/images/profile/andrei_img.jpg",
      status: 0,
    },
    {
      id: 4,
      firstName: "Alin",
      lastName: "Chiosa",
      photo: "/images/profile/alin_img.jpg",
      status: 1,
    },
  ],
  activeChats: [],
});

export let posts = writable();
