import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      library {
        _id
        book {
          _id
          title
          authors {
            firstName
            lastName
          }
          isbn
          isbn13
          date_pub
          num_pages
          cover_img_url
        }
        readStatus
        ratingStatus
        rating {
          ratingValue
        }
      }
      friends {
        _id
        username
        email
      }
    }
  }
`;

export const QUERY_USERS = gql`
  query users {
    users {
      _id
      username
      email
    }
  }
`;

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      library {
        _id
        book {
          _id
          title
          authors {
            firstName
            lastName
          }
          isbn
          isbn13
          date_pub
          num_pages
          cover_img_url
        }
        readStatus
        ratingStatus
        rating {
          ratingValue
        }
      }
      friends {
        _id
        username
        email
      }
    }
  }
`;

export const QUERY_BOOKS = gql`
  query books {
    books {
      _id
      title
      authors {
        firstName
        lastName
      }
      isbn
      isbn13
      date_pub
      num_pages
      cover_img_url
      ratings {
        _id
        ratingValue
      }
    }
  }
`;

export const QUERY_THOUGHTS = gql`
  query getThoughts {
    thoughts {
      _id
      thoughtText
      thoughtAuthor
      createdAt
    }
  }
`;

export const QUERY_SINGLE_THOUGHT = gql`
  query getSingleThought($thoughtId: ID!) {
    thought(thoughtId: $thoughtId) {
      _id
      thoughtText
      thoughtAuthor
      createdAt
      comments {
        _id
        commentText
        commentAuthor
        createdAt
      }
    }
  }
`;
