import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_BOOK = gql`
  mutation addBook($input: BookInput!) {
    addBook(input: $input) {
      _id
      title
      authors {
        _id
        displayName
        sortName
      }
      isbn
      isbn13
      date_pub
      num_pages
      cover_img_url
      ratings {
        user {
          _id
          username
        }
        ratingValue
      }
    }
  }
`;

export const ADD_FRIEND = gql`
  mutation addFriend($friendId: ID!) {
    addFriend(friendId: $friendId) {
      _id
      username
      friends {
        _id
        username
      }
    }
  }
`;

export const REMOVE_FRIEND = gql`
  mutation removeFriend($friendId: ID!) {
    removeFriend(friendId: $friendId) {
      _id
      username
      friends {
        _id
        username
      }
    }
  }
`;

export const ADD_RATING = gql`
  mutation addRating($ratingValue: Int!, $bookId: ID!) {
    addRating(ratingValue: $ratingValue, bookId: $bookId) {
      _id
      user {
        _id
        username
      }
      book {
        _id
        title
      }
      ratingValue
    }
  }
`;

export const ADD_OR_UPDATE_RATING = gql`
  mutation AddOrUpdateRating($bookData: BookInput!, $ratingData: RatingInput!) {
    addOrUpdateRating(bookData: $bookData, ratingData: $ratingData) {
      _id
      user {
        _id
        username
      }
      book {
        _id
        title
        authors {
          displayName
        }
        description
        isbn
        isbn13
        date_pub
        num_pages
        cover_img_url
      }
      ratingValue
      readStatus
    }
  }
`;

export const CHANGE_READSTATUS = gql`
  mutation changeReadStatus($readStatus: String!, $bookId: ID!) {
    changeReadStatus(readStatus: $readStatus, bookId: $bookId) {
      _id
      username
      email
      library {
        book {
          _id
          title
          authors {
            displayName
            sortName
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

export const MAKE_REC = gql`
  mutation makeRec($friendId: ID!, $bookId: ID!) {
    makeRec(friendId: $friendId, bookId: $bookId) {
      book {
        title
      }
      sender {
        username
      }
      timestamp
      recipient {
        username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($bookId: ID!, $readStatus: String) {
    saveBook(bookId: $bookId, readStatus: $readStatus) {
      _id
      username
      email
      library {
        book {
          _id
          title
        }
        readStatus
        ratingStatus
        rating {
          _id
          ratingValue
        }
      }
      friends {
        _id
        username
      }
    }
  }
`;

export const UPDATE_RATING = gql`
  mutation updateRating($ratingId: ID!, $ratingValue: Int!) {
    updateRating(ratingId: $ratingId, ratingValue: $ratingValue) {
      _id
      user {
        _id
        username
      }
      book {
        _id
        title
      }
      ratingValue
    }
  }
`;
export const REMOVE_REC = gql`
  mutation removeRec($friendId: ID!, $bookId: ID!) {
    removeRec(friendId: $friendId, bookId: $bookId) {
      book {
        title
      }
      sender {
        username
      }
      timestamp
      recipient {
        username
      }
    }
  }
`;
