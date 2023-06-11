import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      library {
        book {
          _id
          title
          authors {
            displayName
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

export const QUERY_SINGLE_USER = gql`
  query getSingleUser($username: String!) {
    user(username: $username) {
      _id
      username
      email
      library {
        book {
          _id
          title
          authors {
            displayName
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

export const QUERY_SINGLE_BOOK = gql`
  query getSingleBook($bookId: ID!) {
    book(bookId: $bookId) {
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

export const QUERY_RECS_BY_RECIPIENT = gql`
  query getRecsByRecipient($recipientId: ID!) {
    recs(recipientId: $recipientId) {
      sender {
        _id
        username
      }
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
      timestamp
    }
  }
`;

export const GET_FRIENDS = gql`
  query me {
    me {
      friends {
        _id
        username
        email
      }
    }
  }
`;
