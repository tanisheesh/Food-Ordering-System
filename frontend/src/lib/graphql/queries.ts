import { gql } from '@apollo/client';

export const GET_RESTAURANTS = gql`
  query GetRestaurants {
    restaurants {
      id
      name
      description
      country
      menuItems {
        id
        name
        description
        price
      }
    }
  }
`;

export const GET_MY_ORDERS = gql`
  query GetMyOrders {
    myOrders {
      id
      status
      totalAmount
      createdAt
      user {
        id
        name
        role
      }
      orderItems {
        id
        quantity
        price
        menuItem {
          id
          name
        }
      }
    }
  }
`;

export const GET_PAYMENT_METHODS = gql`
  query GetPaymentMethods {
    myPaymentMethods {
      id
      cardNumber
      cardHolder
      expiryDate
      isDefault
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
      name
      role
      country
      token
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($restaurantId: String!, $items: [OrderItemInput!]!) {
    createOrder(restaurantId: $restaurantId, items: $items) {
      id
      status
      totalAmount
    }
  }
`;

export const CHECKOUT_ORDER = gql`
  mutation CheckoutOrder($orderId: String!) {
    checkoutOrder(orderId: $orderId) {
      id
      status
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($orderId: String!) {
    cancelOrder(orderId: $orderId) {
      id
      status
    }
  }
`;

export const ADD_PAYMENT_METHOD = gql`
  mutation AddPaymentMethod($cardNumber: String!, $cardHolder: String!, $expiryDate: String!) {
    addPaymentMethod(cardNumber: $cardNumber, cardHolder: $cardHolder, expiryDate: $expiryDate) {
      id
      cardNumber
      cardHolder
    }
  }
`;

export const UPDATE_PAYMENT_METHOD = gql`
  mutation UpdatePaymentMethod($id: String!, $cardNumber: String, $cardHolder: String, $expiryDate: String) {
    updatePaymentMethod(id: $id, cardNumber: $cardNumber, cardHolder: $cardHolder, expiryDate: $expiryDate) {
      id
      cardNumber
      cardHolder
      expiryDate
    }
  }
`;

export const DELETE_PAYMENT_METHOD = gql`
  mutation DeletePaymentMethod($id: String!) {
    deletePaymentMethod(id: $id)
  }
`;
